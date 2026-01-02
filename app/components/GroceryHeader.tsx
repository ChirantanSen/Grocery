"use client";
import { Box, Typography, Badge } from "@mui/material";

type Props = {
  activeView: "items" | "cart";
  cartCount: number;
  onChange: (view: "items" | "cart") => void;
};

export default function GroceryHeader({
  activeView,
  cartCount,
  onChange,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        px: 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography
          onClick={() => onChange("items")}
          sx={{
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: 600,
            color: activeView === "items" ? "#2e7d32" : "#777",
            borderBottom:
              activeView === "items" ? "3px solid #2e7d32" : "none",
            pb: 0.5,
          }}
        >
          Available Grocery Items
        </Typography>

        <Badge badgeContent={cartCount} color="success">
          <Typography
            onClick={() => onChange("cart")}
            sx={{
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 600,
              color: activeView === "cart" ? "#2e7d32" : "#777",
              borderBottom:
                activeView === "cart" ? "3px solid #2e7d32" : "none",
              pb: 0.5,
            }}
          >
            Cart
          </Typography>
        </Badge>
      </Box>
    </Box>
  );
}
