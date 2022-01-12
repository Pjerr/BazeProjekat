import { Injectable } from '@angular/core';
import { ProductCartCass } from '../models/cart/productCartCass';
import { ProductDto } from '../models/product/productDto';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}

  cartProducts: ProductCartCass[] = [];

  getCartProducts(): ProductCartCass[] {
    return this.cartProducts;
  }

  clearCartProducts(): void {
    this.cartProducts = [];
  }

  addToCart(product: ProductDto) {
    let index = this.cartProducts.findIndex((el: ProductCartCass) => {
      return el.product.naziv === product.naziv;
    });
    if (index == -1) {
      let productToPush: ProductCartCass = {
        product: product,
        brojProizvoda: 1,
      };
      this.cartProducts.push(productToPush);
    } else {
      this.cartProducts[index].brojProizvoda++;
    }
    localStorage.setItem('products', JSON.stringify(this.cartProducts));
  }
}
