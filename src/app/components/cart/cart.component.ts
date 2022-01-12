import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, take, takeUntil } from 'rxjs';
import { ProductCartCass } from 'src/app/models/cart/productCartCass';
import { ProductDto } from 'src/app/models/product/productDto';
import { CartService } from 'src/app/services/cart.service';
import { CasTransakcijaService } from 'src/app/services/cas-transakcija.service';
import { NeoKorisnikService } from 'src/app/services/neo-korisnik.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private casTransakcijaService: CasTransakcijaService,
    private neoKorisnikService: NeoKorisnikService,
    private toastrService: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  cartProductsObv: Observable<ProductDto[]> = of([]);
  cartProducts: ProductCartCass[] | undefined = undefined;
  ukupnaCena: number = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.loadCartProducts();
    this.izracunajUkupnuCenu();
  }

  loadCartProducts(): void {
    this.cartProducts = this.cartService.getCartProducts();
    if (this.cartProducts.length === 0) {
      const fromLocalStorage = localStorage.getItem('products');
      if (fromLocalStorage != null) {
        this.cartProducts = JSON.parse(fromLocalStorage);
      }
    }
  }

  izracunajUkupnuCenu() {
    if (this.cartProducts && this.cartProducts.length > 0)
      this.ukupnaCena = this.cartProducts
        .map(
          (element: ProductCartCass) =>
            (element.product.cena -
              (element.product.cena * element.product.popust) / 100) *
            element.brojProizvoda
        )
        .reduce((broj1: number, broj2: number) => {
          return broj1 + broj2;
        });
  }

  kupiProizvode(): void {
    if (this.cartProducts) {
      let nizNazivaNeo = this.cartProducts.map(
        (element: ProductCartCass) => element.product.naziv
      );
      let nizNazivaCass = nizNazivaNeo.join('\r\n');
      this.casTransakcijaService
        .addTransakcija(
          true,
          '',
          '',
          nizNazivaCass,
          this.ukupnaCena,
          'bogdan.petrov'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          setTimeout(() => {
            this.neoKorisnikService
              .kupiProizvode('bogdan.petrov', nizNazivaNeo)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.toastrService.success(
                  'Uspesno kupljeni proizvodi!',
                  'Success'
                );
                localStorage.removeItem('products');
                this.cartService.clearCartProducts();
              });
          });
        });
    }
  }

  removeFromCart(productToRemove: ProductDto) {
    if (this.cartProducts) {
      let index = this.cartProducts.findIndex(
        (element: ProductCartCass) =>
          element.product.naziv === productToRemove.naziv
      );
      if (this.cartProducts[index].brojProizvoda == 1)
        this.cartProducts.splice(index, 1);
      else this.cartProducts[index].brojProizvoda--;
    }
    localStorage.setItem('products', JSON.stringify(this.cartProducts));
  }
}
