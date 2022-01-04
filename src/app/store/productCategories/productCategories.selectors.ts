import { createSelector } from '@ngrx/store';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import { AppState } from '../app.state';
import { ProductCategoryState } from './productCategories.reducer';

export const selectProducCategoriesFeature = createSelector(
  (state: AppState) => state.productCategories,
  (productCategories) => productCategories
);

export const selectAllCategories = createSelector(
  selectProducCategoriesFeature,
  (state: ProductCategoryState) =>
    Object.values(state.entities)
      .filter((productCategory) => productCategory != null)
      .map((productCategory) => <ProductCatergory>productCategory)
);

export const selectAllCategoriesAsDict = createSelector(
  selectProducCategoriesFeature,
  (state: ProductCategoryState) => state.entities
);
