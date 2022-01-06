import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ProductDto } from 'src/app/models/product/productDto';
import * as ProductActions from './product.actions';

export interface ProductsState extends EntityState<ProductDto> {
  selectedKategorija: string,
  selectedTip: string,
  selectedNaziv: string
}

const adapter = createEntityAdapter<ProductDto>({
  selectId: (product: ProductDto) => product.naziv,
});

const initialState: ProductsState = adapter.getInitialState({
  selectedKategorija: "",
  selectedTip: "",
  selectedNaziv: ""
});

export const productsReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products }) => {
    return adapter.setAll(products, state);
  }),
  on(ProductActions.selectProduct, (state, { kategorija, tip, naziv }) => ({
    ...state,
    selectedKategorija: kategorija,
    selectedTip: tip,
    selectedNaziv: naziv
  }))
);
