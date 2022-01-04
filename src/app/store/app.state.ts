import { CommonState } from './common/common.reducer';
import { ProductCategoryState } from './productCategories/productCategories.reducer';
import { ProductsState } from './products/products.reducer';

export interface AppState {
  common: CommonState;
  products: ProductsState;
  productCategories: ProductCategoryState
}
