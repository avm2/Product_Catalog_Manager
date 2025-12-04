import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Grid, Typography, CircularProgress } from "@mui/material";
import { validateProduct } from "../../utils/validators";
import { format } from "date-fns";

export default function ProductForm({ initial = null, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    expiryDate: "",
    costPrice: "",
    sellPrice: "",
    discount: 0,
    discountedSellPrice: 0,
    id: undefined,
    ...initial,
  });

  useEffect(() => {
    // calculate discounted price live
    const sp = Number(form.sellPrice || 0);
    const disc = Number(form.discount || 0);
    const discounted = sp - (sp * disc / 100);
    setForm((f) => ({ ...f, discountedSellPrice: isNaN(discounted) ? 0 : Number(discounted.toFixed(2)) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sellPrice, form.discount]);

  const [errors, setErrors] = useState({});

  const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vals = { ...form };
    const rawErrors = validateProduct(vals);
    setErrors(rawErrors);
    if (Object.keys(rawErrors).length > 0) return;
    // normalize numeric fields
    const productToSave = {
      ...vals,
      costPrice: Number(vals.costPrice),
      sellPrice: Number(vals.sellPrice),
      discount: Number(vals.discount),
      discountedSellPrice: Number(vals.discountedSellPrice),
    };
    await onSave(productToSave);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{initial?.id ? "Edit Product" : "Add Product"}</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" size="small" value={form.name} onChange={handleChange("name")} error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Category" size="small" value={form.category} onChange={handleChange("category")} error={!!errors.category} helperText={errors.category} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Description" size="small" value={form.description} onChange={handleChange("description")} multiline rows={2} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="date" size="small" label="Expiry Date" InputLabelProps={{ shrink: true }} value={form.expiryDate ? format(new Date(form.expiryDate), "yyyy-MM-dd") : ""} onChange={handleChange("expiryDate")} error={!!errors.expiryDate} helperText={errors.expiryDate} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Cost Price" size="small" value={form.costPrice} onChange={handleChange("costPrice")} error={!!errors.costPrice} helperText={errors.costPrice} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Sell Price" size="small" value={form.sellPrice} onChange={handleChange("sellPrice")} error={!!errors.sellPrice} helperText={errors.sellPrice} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Discount (%)" size="small" value={form.discount} onChange={handleChange("discount")} error={!!errors.discount} helperText={errors.discount} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Final Price (calculated)" size="small" value={form.discountedSellPrice} InputProps={{ readOnly: true }} />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onCancel} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : null}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
