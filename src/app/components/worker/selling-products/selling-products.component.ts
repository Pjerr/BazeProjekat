import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { ProductDto } from 'src/app/models/product/productDto';
import { CasProizvodService } from 'src/app/services/cas-proizvod.service';
import { ModalService } from '../../_modal';

@Component({
  selector: 'app-selling-products',
  templateUrl: './selling-products.component.html',
  styleUrls: ['./selling-products.component.scss']
})
export class SellingProductsComponent implements OnInit {

  constructor(
    private casProizvodService: CasProizvodService,
    private modalService: ModalService,
    private toastrService: ToastrService
  ) {}

  ngOnDestroy(): void {
    if (this.productCategoriesSub) this.productCategoriesSub.unsubscribe();
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.initSubcategoryShown();
  }

  //SUBS
  productCategoriesSub: Subscription | undefined = undefined;
  productCategories: ProductCatergory[] = [];

  //OBSV
  products: Observable<ProductDto[]> | undefined = undefined;

  //HELP VARS
  productsForSelling: ProductDto[] | undefined = undefined;
  tempCategories: any;
  isSubcategoryShown: boolean[] = [];
  numberToOrder = new FormControl(0);

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

  loadProducts(kategorija: string, tip: string) {
    this.products = this.casProizvodService.getCassandraProizvodi(
      kategorija,
      tip,
      '',
      '',
      'Cena',
      0
    );
  }

  //QUESTION: da li ovde mogu samo niz imena da pravim ili treba ceo objekat?
  addToSellList(product:ProductDto){
    if(this.productsForSelling){
      this.productsForSelling.push(product);
    }else{
      this.productsForSelling = [];
      this.productsForSelling.push(product);
    }
  }

  removeItemFromSellList(productToRemove: ProductDto){
    if(this.productsForSelling){
      const index = this.productsForSelling.findIndex((product:ProductDto)=> product.naziv === productToRemove.naziv);
      this.productsForSelling.splice(index, 1);
      if(this.productsForSelling.length == 0){
        this.productsForSelling = undefined;
      }
    }
  }
}
