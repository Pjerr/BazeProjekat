import { createAction, props } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';

export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ product: ProductDto }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{
    product: ProductDto;
  }>()
);

export const loadItemsOfCart = createAction('[Cart] Load items of Cart');

export const loadItemsOfCartSuccess = createAction(
  '[Cart] Load items of Cart Success',
  props<{ products: ProductDto[] }>()
);
