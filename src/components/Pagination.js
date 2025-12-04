import React from "react";
import { Pagination, Box } from "@mui/material";

export default function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Pagination page={page} count={totalPages} onChange={(e, p) => onChange(p)} />
    </Box>
  );
}
