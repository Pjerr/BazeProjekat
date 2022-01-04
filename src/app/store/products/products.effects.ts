import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductsEffects {
  constructor(
    private productsService: ProductsService,
    private actions$: Actions
  ) {}

  loadProductsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap((action) =>
        this.productsService
          .getProductsByCategoryAndSubcategory(
            action.category,
            action.subcategory
          )
          .pipe(
            map((products) => ProductActions.loadProductsSuccess({ products })),
            catchError(() => of({ type: 'load products error' }))
          )
      )
    )
  );
}
