import { createSelector } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';
import { AppState } from '../app.state';
import { ProductsState } from './products.reducer';

export const selectProducsFeature = createSelector(
  (state: AppState) => state.products,
  (products) => products
);

export const selectAllProducts = createSelector(
  selectProducsFeature,
  (state: ProductsState) =>
    Object.values(state.entities)
      .filter((product) => product != null)
      .map((product) => <ProductDto>product)
);

export const selectAllProductsAsDict = createSelector(
  selectProducsFeature,
  (state: ProductsState) => state.entities
);

export const selectOneProductID = createSelector(
  selectProducsFeature,
  (state: ProductsState) => state.selectedProductID
);

export const selectOneProduct = createSelector(
  selectAllProducts,
  selectOneProductID,
  (allProducts, productID) => allProducts[productID] ?? null
);
