"use client";

import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";

export type GroceryItem = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  item: GroceryItem;
  quantity: number; 
  onAdd: (item: GroceryItem) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onGoToCart: () => void;
};

export default function GroceryItemCard({
  item,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  onGoToCart,
}: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={0.5}>
          {item.name}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={700}
          color="success.main"
          mb={2}
        >
          ₹{item.price}
        </Typography>

        {/* 🔹 CONDITIONAL AREA */}
        {quantity === 0 ? (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => onAdd(item)}
          >
            Add
          </Button>
        ) : (
          <Box>
            {/* Quantity Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => onDecrease(item.id)}
              >
                −
              </Button>

              <Typography fontWeight={600}>
                {quantity}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                onClick={() => onIncrease(item.id)}
              >
                +
              </Button>
            </Box>

            {/* Go to Cart */}
            <Button
              fullWidth
              size="small"
              color="success"
              variant="text"
              onClick={onGoToCart}
            >
              Go to Cart →
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
