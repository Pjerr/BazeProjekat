import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import * as ProductCategoryActions from './productCategories.actions';

export interface ProductCategoryState extends EntityState<ProductCatergory> {
  selectedCategory: string;
  selectedSubcategory: string;
}

const adapter = createEntityAdapter<ProductCatergory>();

const initialState: ProductCategoryState = adapter.getInitialState({
  selectedCategory: '',
  selectedSubcategory: '',
});

export const productsCategoriesReducer = createReducer(
  initialState,
  on(
    ProductCategoryActions.loadCategoriesAndSubcategoriesSuccess,
    (state, { productCategories }) => {
      return adapter.setAll(productCategories, state);
    }
  ),
  on(
    ProductCategoryActions.selectCategoryAndSubcategory,
    (state, { category, subcategory }) => ({
      ...state,
      selectedCategory: category,
      selectedSubcategory: subcategory,
    })
  )
);
