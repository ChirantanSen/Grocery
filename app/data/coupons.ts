export type Coupon = {
  code: string;
  discountType: "percentage" | "flat";
  value: number;
};

export const coupons: Coupon[] = [
  {
    code: "SAVE10",
    discountType: "flat",
    value: 10, 
  },
  {
    code: "FLAT50",
    discountType: "flat",
    value: 50, // ₹50 off
  },
  {
    code: "SAVE20",
    discountType: "flat",
    value: 20,
  },
];
