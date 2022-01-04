import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';
import * as ProductActions from './product.actions';

export interface ProductsState extends EntityState<ProductDto> {
  selectedProductID: number;
}

const adapter = createEntityAdapter<ProductDto>();

const initialState: ProductsState = adapter.getInitialState({
  selectedProductID: -1,
});

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products }) => {
    return adapter.setAll(products, state);
  }),
  on(ProductActions.selectProduct, (state, { productID }) => ({
    ...state,
    selectedProductID: productID,
  }))
);
