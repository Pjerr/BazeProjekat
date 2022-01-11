import { CartState } from './cart/cart.reducer';
import { CommonState } from './common/common.reducer';

export interface AppState {
  common: CommonState;
  cart: CartState
}
