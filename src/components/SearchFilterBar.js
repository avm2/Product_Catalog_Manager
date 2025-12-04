import React from "react";
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchFilterBar({ query, setQuery, category, setCategory, sortBy, setSortBy, order, setOrder, limit, setLimit, onReset }) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
      <TextField
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name or description"
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
      />
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Category</InputLabel>
        <Select value={category || ""} label="Category" onChange={(e) => setCategory(e.target.value || null)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Grocery">Grocery</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort</InputLabel>
        <Select value={`${sortBy}:${order}`} label="Sort" onChange={(e) => { const [s, o] = e.target.value.split(":"); setSortBy(s); setOrder(o); }}>
          <MenuItem value="createdAt:desc">Newest</MenuItem>
          <MenuItem value="createdAt:asc">Oldest</MenuItem>
          <MenuItem value="expiryDate:asc">Expiry (Soon)</MenuItem>
          <MenuItem value="expiryDate:desc">Expiry (Far)</MenuItem>
          <MenuItem value="sellPrice:asc">Price Low→High</MenuItem>
          <MenuItem value="sellPrice:desc">Price High→Low</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Per page</InputLabel>
        <Select value={limit} label="Per page" onChange={(e) => setLimit(Number(e.target.value))}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

      <Button onClick={onReset} size="small">Reset</Button>
    </Box>
  );
}
