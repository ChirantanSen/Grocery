import { GroceryItem } from "../app/components/GroceryItemCard";
import { coupons } from "../app/data/coupons";

export type CartItem = GroceryItem & { quantity: number };

export type CartState = {
  items: CartItem[];
  appliedCoupon: (typeof coupons)[number] | null;
  bulkDiscountActive: boolean;
};



export type CartAction =
  | { type: "ADD_ITEM"; payload: GroceryItem }
  | { type: "INCREASE_QTY"; payload: number }
  | { type: "DECREASE_QTY"; payload: number }
  | { type: "APPLY_COUPON"; payload: (typeof coupons)[number] }
  | { type: "REMOVE_COUPON" }
  | { type: "ACTIVATE_BULK_DISCOUNT" }
  | { type: "DEACTIVATE_BULK_DISCOUNT" };

export const initialCartState: CartState = {
  items: [],
  appliedCoupon: null,
  bulkDiscountActive: false,
};

export function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        i => i.id === action.payload.id
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items
          .map(i =>
            i.id === action.payload
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter(i => i.quantity > 0),
      };

    case "APPLY_COUPON":
      return { ...state, appliedCoupon: action.payload };

    case "REMOVE_COUPON":
      return { ...state, appliedCoupon: null };

    case "ACTIVATE_BULK_DISCOUNT":
      return { ...state, bulkDiscountActive: true };

    case "DEACTIVATE_BULK_DISCOUNT":
      return { ...state, bulkDiscountActive: false };

    default:
      return state;
  }
}
