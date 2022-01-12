import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, take, takeUntil } from 'rxjs';
import { ProductCartNeo } from 'src/app/models/cart/productCartNeo';
import { Prodavnica } from 'src/app/models/prodavnica';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { ProductCass } from 'src/app/models/product/productCass';
import { ProductNeo } from 'src/app/models/product/productNeo';
import { CasProizvodService } from 'src/app/services/cas-proizvod.service';
import { CasTransakcijaService } from 'src/app/services/cas-transakcija.service';
import { NeoKorisnikService } from 'src/app/services/neo-korisnik.service';
import { NeoProdavnicaService } from 'src/app/services/neo-prodavnica.service';
import { NeoRadnikService } from 'src/app/services/neo-radnik.service';
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
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.initGradAndAdresaProdavnice();
  }

  //SUBS
  productCategories: ProductCatergory[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  //OBSV
  products: any;

  //HELP VARS
  productsForSelling: ProductCartNeo[] | undefined = undefined;
  numberOfProductsForSelling: number[] | undefined = undefined;

  tempCategories: any;
  isSubcategoryShown: boolean[] = [];
  numberToOrder = new FormControl(0);
  prodavnica: Prodavnica | undefined = undefined;

  initGradAndAdresaProdavnice() {
    this.productsForSelling = undefined;
    this.neoRadnikService
      .getInfoOProdavniciUKojojRadiRadnik('todor.kalezic').pipe(takeUntil(this.destroy$))
      .subscribe((prodavnica: Prodavnica) => {
        this.prodavnica = prodavnica;
        setTimeout(() => {
          this.loadProducts(prodavnica);
        });
      });
  }

  loadProducts(prodavnica: Prodavnica) {
    this.neoProdavnicaService
      .getSveProizvodeProdavnice(prodavnica).pipe(takeUntil(this.destroy$))
      .subscribe((niz) => {
        niz.sort((el1, el2) => {
          if (el1.proizvod.naziv > el2.proizvod.naziv) return 1;
          else if (el1.proizvod.naziv < el2.proizvod.naziv) {
            return -1;
          } else return 0;
        });
        this.products = niz;
      });
  }

  addToSellList(product: ProductNeo) {
    if (this.productsForSelling) {
      let index = this.productsForSelling.findIndex((el: ProductCartNeo) => {
        return el.product.naziv === product.naziv;
      });
      if (index == -1) {
        let productToPush: ProductCartNeo = {
          product: product,
          brojProizvoda: 1,
        };
        this.productsForSelling.push(productToPush);
      } else {
        this.productsForSelling[index].brojProizvoda++;
      }
    } else {
      this.productsForSelling = [];
      let productToPush: ProductCartNeo = {
        product: product,
        brojProizvoda: 1,
      };
      this.productsForSelling.push(productToPush);
    }
  }

  reduceNumberFromSellList(productToRemove: ProductNeo) {
    if (this.productsForSelling) {
      const index = this.productsForSelling.findIndex(
        (el: ProductCartNeo) => el.product.naziv === productToRemove.naziv
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

  //TODO ako imas vremena - brises celu stavku bez obzira koliko ima kopija
  removeItemFromSellList() {}

  kupiProizvode() {
    let nizNaziva: string[] = [];
    let nizBrojaProizvoda: number[] = [];
    let ukupnaCena: number = 0;
    if (this.productsForSelling) {
      nizNaziva = this.productsForSelling.map((element: ProductCartNeo) => {
        return element.product.naziv;
      });

      nizBrojaProizvoda = this.productsForSelling.map(
        (element: ProductCartNeo) => {
          return element.brojProizvoda;
        }
      );

      ukupnaCena = this.productsForSelling
        .map(
          (element: ProductCartNeo) =>
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
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          setTimeout(() => {
            if (this.prodavnica)
              this.neoProdavnicaService
                .dektementirajBrojProizvodaMagacina(
                  this.prodavnica.grad,
                  this.prodavnica.adresa,
                  nizNaziva,
                  nizBrojaProizvoda
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  this.toastrService.success('Uspesno ste kupili proizvode', 'Sucess');
                  //OPCIONO, AKO IMA USERNAME
                  // if(username != ""){
                    //tu ide treci api call
                  // }
                  setTimeout(() => {
                    this.neoKorisnikService
                      .kupiProizvode('bogdan.petrov', nizNaziva)
                      .pipe(takeUntil(this.destroy$))
                      .subscribe(() => {
                        this.toastrService.success(
                          'Uspesno ste zabelezili kupovinu sa nalogom',
                          'Success'
                        );
                        this.initGradAndAdresaProdavnice();
                      });
                  });
                });
          });
        });
  }
}
