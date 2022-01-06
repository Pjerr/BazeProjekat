import { createAction, props } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';

export const rate = createAction(
  '[Product] Rate Product',
  props<{
    productID: number;
    voteOutcome: number;
  }>()
);

export const rateProductSuccess = createAction(
  '[Product] Rate Product Success'
);

export const loadProducts = createAction(
  '[Product] Load Products',
  props<{
    kategorija: string;
    tip: string;
  }>()
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{
    products: ProductDto[];
  }>()
);

export const selectProduct = createAction(
  '[Product] Select Product',
  props<{
    kategorija: string;
    tip: string;
    naziv: string
  }>()
);
