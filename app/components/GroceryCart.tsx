"use client";

import { useState, useEffect } from "react";
import GroceryItemCard, { GroceryItem } from "./GroceryItemCard";
import GroceryHeader from "./GroceryHeader";
import { groceryList } from "../data/groceryList";
import { coupons } from "../data/coupons";

import {
  Container,
  Typography,
  Paper,
  Divider,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Cart item with quantity//
type CartItem = GroceryItem & { quantity: number };

export default function GroceryCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<"items" | "cart">("items");

  // Coupon//
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<(typeof coupons)[number] | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

// Bulk discount //
  const [bulkDiscountActive, setBulkDiscountActive] = useState(false);

  //  Add item//
  const addItem = (item: GroceryItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  //  Total //
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  //  Bulk discount eligibility //
  const bulkDiscountEligible = totalPrice >= 500;

  const bulkDiscountAmount = bulkDiscountActive
    ? totalPrice * 0.1
    : 0;

  // Auto-disable bulk discount if cart drops below ₹500
  useEffect(() => {
    if (!bulkDiscountEligible && bulkDiscountActive) {
      setBulkDiscountActive(false);
    }
  }, [bulkDiscountEligible, bulkDiscountActive]);

  // Apply coupon //
  const applyCoupon = () => {
    const found = coupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!found) {
      alert("Invalid coupon code");
      return;
    }

    if (totalPrice < found.value) {
      setShowCouponModal(true);
      return;
    }

    setAppliedCoupon(found);
  };

  const couponDiscountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? (totalPrice * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  const finalAmount = Math.max(
    totalPrice - couponDiscountAmount - bulkDiscountAmount,
    0
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
         Grocery Store
      </Typography>

      <GroceryHeader
        activeView={activeView}
        cartCount={cart.length}
        onChange={setActiveView}
      />

      {/*  ITEMS VIEW */}
      {activeView === "items" && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          {groceryList.map(item => {
            const cartItem = cart.find(c => c.id === item.id);

            return (
              <GroceryItemCard
                key={item.id}
                item={item}
                quantity={cartItem?.quantity || 0}
                onAdd={addItem}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onGoToCart={() => setActiveView("cart")}
              />
            );
          })}
        </Paper>
      )}

      {/*  CART VIEW */}
      {activeView === "cart" && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          {cart.map(item => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                mb: 1.5,
                borderRadius: 2,
                backgroundColor: "#f9fafb",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.price} × {item.quantity}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button size="small" onClick={() => decreaseQty(item.id)}>
                  −
                </Button>
                <Typography fontWeight={600}>{item.quantity}</Typography>
                <Button size="small" onClick={() => increaseQty(item.id)}>
                  +
                </Button>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/*  BULK DISCOUNT OFFER */}
          {bulkDiscountEligible && !bulkDiscountActive && (
            <Paper
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#e8f5e9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={600} color="success.main">
                 Get 10% OFF on orders above ₹500
              </Typography>

              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => setBulkDiscountActive(true)}
              >
                Apply
              </Button>
            </Paper>
          )}

          {/*  Coupon */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <Button variant="contained" color="success" onClick={applyCoupon}>
              Apply
            </Button>
          </Box>

          {/*  SUMMARY */}
          <Box sx={{ backgroundColor: "#f5f6f8", p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{totalPrice}</Typography>
            </Box>

            {appliedCoupon && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="success.main">
                  Coupon ({appliedCoupon.code})
                </Typography>
                <Typography color="success.main">
                  − ₹{couponDiscountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}

            {bulkDiscountActive && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="success.main">
                  Bulk Discount (10%)
                </Typography>
                <Typography color="success.main">
                  − ₹{bulkDiscountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={700}>Payable</Typography>
              <Typography fontWeight={700} color="success.main">
                ₹{finalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/*  COUPON MODAL */}
      <Dialog
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
      >
        <DialogTitle>Coupon Not Applicable</DialogTitle>
        <DialogContent>
          <Typography>
            Add more items to avail this offer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setShowCouponModal(false);
              setActiveView("items");
            }}
          >
            Add More Items
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
