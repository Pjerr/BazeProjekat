import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Cart } from 'src/app/models/cart/cart';
import { ProductDto } from 'src/app/models/product/productDto';
import * as CartActions from './cart.actions';

//QUESTION: implements EntityState<Cart>??
export interface CartState extends EntityState<ProductDto> {
  products: ProductDto[];
}

const adapter = createEntityAdapter<ProductDto>(
  {selectId: (product:ProductDto) => product.naziv}
);

const initialState: CartState = adapter.getInitialState({
  products: [],
});

//TODO, add functionality, test adding and removing from cart!
export const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCart, (state, { product }) => {
    return adapter.addOne(product, state);
  }),
  on(CartActions.removeFromCart, (state, { product }) => {
    return adapter.removeOne(product.naziv.toString(), state);
  })
);
