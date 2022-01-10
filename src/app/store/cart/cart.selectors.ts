import { createSelector } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';
import { AppState } from '../app.state';

export const selectCartFeature = createSelector(
  (state: AppState) => state.cart,
  (cart) => cart
);

export const selectAllProducts = createSelector(
  selectCartFeature,
  (state) => Object.values(state.entities)
  .filter((product) => product != null)
  .map((product)=> <ProductDto>product)
);
