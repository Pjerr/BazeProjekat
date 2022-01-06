import { createAction, props } from '@ngrx/store';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';

export const loadCategoriesAndSubcategories = createAction(
  '[Product] Load Categories and Subcategories'
);

export const loadCategoriesAndSubcategoriesSuccess = createAction(
  '[Product] Load Categories and Subcategories Success',
  props<{
    productCategories: ProductCatergory[];
  }>()
);

export const selectCategoryAndSubcategory = createAction(
  '[Product] Select Category and Subcategory',
  props<{
    kategorija: string,
    tip: string
  }>()
)