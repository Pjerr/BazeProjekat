import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductCatergory } from 'src/app/models/product/productCatergoryDto';
import * as ProductCategoryActions from './productCategories.actions';

export interface ProductCategoryState extends EntityState<ProductCatergory> {
  selectedKategorija: string;
  selectedTip: string;
}

const adapter = createEntityAdapter<ProductCatergory>({
  selectId: (kategorija: ProductCatergory) => kategorija.kategorija,
});

const initialState: ProductCategoryState = adapter.getInitialState({
  selectedKategorija: '',
  selectedTip: '',
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
    (state, { kategorija, tip }) => ({
      ...state,
      selectedKategorija: kategorija,
      selectedTip: tip,
    })
  )
);
