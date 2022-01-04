import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import * as ProductActions from './productCategories.actions';

@Injectable()
export class ProductsCategoriesEffects {
  constructor(
    private productsService: ProductsService,
    private actions$: Actions
  ) {}

  loadCategoriesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadCategoriesAndSubcategories),
      mergeMap(() =>
        this.productsService.getAllCategories().pipe(
          map((productCategories) =>
            ProductActions.loadCategoriesAndSubcategoriesSuccess({
              productCategories,
            })
          ),
          catchError(() => of({ type: 'load categories error' }))
        )
      )
    )
  );
}
