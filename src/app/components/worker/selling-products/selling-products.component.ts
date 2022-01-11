import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, take } from 'rxjs';
import { Prodavnica } from 'src/app/models/prodavnica';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { ProductDto } from 'src/app/models/product/productDto';
import { ProductNeo } from 'src/app/models/product/productNeo';
import { CasProizvodService } from 'src/app/services/cas-proizvod.service';
import { CasTransakcijaService } from 'src/app/services/cas-transakcija.service';
import { NeoKorisnikService } from 'src/app/services/neo-korisnik.service';
import { NeoProdavnicaService } from 'src/app/services/neo-prodavnica.service';
import { NeoRadnikService } from 'src/app/services/neo-radnik.service';
interface ProductToSell {
  product: ProductNeo;
  brojProizvoda: number;
}
@Component({
  selector: 'app-selling-products',
  templateUrl: './selling-products.component.html',
  styleUrls: ['./selling-products.component.scss'],
})
export class SellingProductsComponent implements OnInit {
  constructor(
    private casProizvodService: CasProizvodService,
    private neoProdavnicaService: NeoProdavnicaService,
    private neoRadnikService: NeoRadnikService,
    private neoKorisnikService: NeoKorisnikService,
    private casTransakcijaService: CasTransakcijaService,
    private toastrService: ToastrService
  ) {}

  ngOnDestroy(): void {
    if (this.productCategoriesSub) this.productCategoriesSub.unsubscribe();
  }

  ngOnInit(): void {
    //this.getAllCategories();
    this.initSubcategoryShown();
    this.initGradAndAdresaProdavnice();
  }

  //SUBS
  productCategoriesSub: Subscription | undefined = undefined;
  productCategories: ProductCatergory[] = [];

  //OBSV
  products: any;

  //HELP VARS
  productsForSelling: ProductToSell[] | undefined = undefined;
  numberOfProductsForSelling: number[] | undefined = undefined;

  tempCategories: any;
  isSubcategoryShown: boolean[] = [];
  numberToOrder = new FormControl(0);
  prodavnica: Prodavnica | undefined = undefined;

  getAllCategories(): void {
    this.productCategoriesSub = this.casProizvodService
      .getKategorijeITipove()
      .subscribe((data) => {
        this.tempCategories = data;
        this.tempCategories.forEach((element: any) => {
          const foundElement = this.productCategories.find(
            (category: ProductCatergory) =>
              category.kategorija === element.kategorija
          );
          if (foundElement) foundElement.tipovi.push(element.tip);
          else {
            let noviElement: ProductCatergory = {
              kategorija: element.kategorija,
              tipovi: [element.tip],
            };
            this.productCategories.push(noviElement);
          }
        });
      });
  }

  initGradAndAdresaProdavnice() {
    this.neoRadnikService
      .getInfoOProdavniciUKojojRadiRadnik('todor.kalezic')
      .subscribe((prodavnica: Prodavnica) => {
        this.prodavnica = prodavnica;
        setTimeout(() => {
          this.loadProducts(prodavnica);
        });
      });
  }

  initSubcategoryShown(): void {
    this.productCategories.forEach(() => {
      this.isSubcategoryShown.push(false);
    });
  }

  toggleSubcategories(index: number) {
    this.isSubcategoryShown[index] = !this.isSubcategoryShown[index];
  }

  hideSubcategories(index: number) {
    this.isSubcategoryShown[index] = false;
  }

  loadProducts(prodavnica: Prodavnica) {
    let nizProizvoda: any;
    this.neoProdavnicaService
      .getSveProizvodeProdavnice(prodavnica)
      .subscribe((niz) => {
        //this.products = niz.map((element:any)=> (element.proizvod));
        niz.sort((el1, el2) => {
          if (el1.proizvod.naziv > el2.proizvod.naziv) return 1;
          else if (el1.proizvod.naziv < el2.proizvod.naziv) {
            return -1;
          } else return 0;
        });
        this.products = niz;
      });
  }

  //QUESTION: da li ovde mogu samo niz imena da pravim ili treba ceo objekat?
  addToSellList(product: ProductNeo) {
    if (this.productsForSelling) {
      let index = this.productsForSelling.findIndex((el: ProductToSell) => {
        return el.product.naziv === product.naziv;
      });
      if (index == -1) {
        let productToPush: ProductToSell = {
          product: product,
          brojProizvoda: 1,
        };
        this.productsForSelling.push(productToPush);
      } else {
        this.productsForSelling[index].brojProizvoda++;
      }
    } else {
      this.productsForSelling = [];
      let productToPush: ProductToSell = {
        product: product,
        brojProizvoda: 1,
      };
      this.productsForSelling.push(productToPush);
    }
  }

  reduceNumberFromSellList(productToRemove: ProductNeo) {
    if (this.productsForSelling) {
      const index = this.productsForSelling.findIndex(
        (el: ProductToSell) => el.product.naziv === productToRemove.naziv
      );
      if (this.productsForSelling[index].brojProizvoda == 1) {
        this.productsForSelling.splice(index, 1);
      } else {
        this.productsForSelling[index].brojProizvoda--;
      }
      if (this.productsForSelling.length == 0) {
        this.productsForSelling = undefined;
      }
    }
  }

  //TODO
  removeItemFromSellList() {}

  kupiProizvode() {
    console.log(this.productsForSelling);
    console.log(this.prodavnica);
    //API CALL - I TO DOSTA KOMADA OVDE
    let nizNaziva: string[] = [];
    let ukupnaCena: number = 0;
    if (this.productsForSelling) {
      nizNaziva = this.productsForSelling.map((element: ProductToSell) => {
        return element.product.naziv;
      });

      ukupnaCena = this.productsForSelling
        .map(
          (element: ProductToSell) =>
            (element.product.cena -
              (element.product.cena * element.product.popust) / 100) *
            element.brojProizvoda
        )
        .reduce((broj1: number, broj2: number) => {
          return broj1 + broj2;
        });
    }
    const naziviZaSlanjeCass = nizNaziva.join('\r\n');
    if (this.prodavnica)
      this.casTransakcijaService
        .addTransakcija(
          false,
          this.prodavnica.grad,
          this.prodavnica.adresa,
          naziviZaSlanjeCass,
          ukupnaCena,
          'bogdan.petrov'
        )
        .subscribe(() => {
          this.toastrService.success("CASS DOBAR", "Success");
          // setTimeout(() => {
          //   if (this.productsForSelling) {
          //     this.productsForSelling.forEach((element: ProductToSell) => {
          //       let naziv = element.product.naziv;
          //       let brojProizvoda = element.brojProizvoda;
          //       if (this.prodavnica)
          //         this.neoProdavnicaService.dektementirajBrojProizvodaMagacina(
          //           naziv,
          //           this.prodavnica.grad,
          //           this.prodavnica.adresa,
          //           brojProizvoda
          //         ).pipe(take(1)).subscribe(()=>{
          //           this.toastrService.success("NEO_PRODAVNICA dekrement dobar", "Success");
          //         });
          //     });
          //   }
          // });

          //OPCIONO AKO POSTOJI USERNAME
          setTimeout(()=>{
            this.neoKorisnikService.kupiProizvode("bogdan.petrov", nizNaziva).subscribe(()=>{
              this.toastrService.success("NEO_KORISNIK uspesno", "Success");
            });
          })
        });
  }
}
