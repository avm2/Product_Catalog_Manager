import { isBefore, startOfDay } from "date-fns";

export function validateProduct(data) {
  const errors = {};
  if (!data.name || data.name.trim() === "") errors.name = "Name is required";
  if (!data.category || data.category.trim() === "") errors.category = "Category is required";
  if (data.costPrice == null || data.costPrice === "" || isNaN(Number(data.costPrice)) || Number(data.costPrice) < 0) {
    errors.costPrice = "Cost price must be a non-negative number";
  }
  if (data.sellPrice == null || data.sellPrice === "" || isNaN(Number(data.sellPrice)) || Number(data.sellPrice) < 0) {
    errors.sellPrice = "Sell price must be a non-negative number";
  }
  if (data.discount == null || data.discount === "" || isNaN(Number(data.discount)) || Number(data.discount) < 0 || Number(data.discount) > 90) {
    errors.discount = "Discount % must be between 0 and 90";
  }
  if (!data.expiryDate) {
    errors.expiryDate = "Expiry date required";
  } else {
    const expiry = new Date(data.expiryDate);
    if (isBefore(expiry, startOfDay(new Date()))) {
      errors.expiryDate = "Expiry date cannot be in the past";
    }
  }

  return errors;
}
