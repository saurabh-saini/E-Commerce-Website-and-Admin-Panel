import type { RootState } from "../index";

export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce((sum: number, item) => sum + item.quantity, 0);
