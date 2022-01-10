import { Pipe, PipeTransform } from '@angular/core';
import { ProductDto } from '../models/product/productDto';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: ProductDto[], naziv: string): ProductDto[] {
    if (!products || !naziv) return products;

    return products.filter((product) =>
      product.naziv.toLocaleLowerCase().includes(naziv.toLocaleLowerCase())
    );
  }

}
