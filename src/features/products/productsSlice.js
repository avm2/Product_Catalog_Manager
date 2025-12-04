import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// helpers for localStorage
const STORAGE_KEY = "pc_products_v1";
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};
const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

// simulate network latency
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// Async thunks to mimic server
export const fetchProducts = createAsyncThunk("products/fetch", async (_, thunkAPI) => {
  await delay(300);
  return loadFromStorage();
});

export const createProduct = createAsyncThunk("products/create", async (product, thunkAPI) => {
  await delay(500);
  const items = loadFromStorage();
  const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString() };
  items.unshift(newProduct);
  saveToStorage(items);
  return newProduct;
});

export const updateProduct = createAsyncThunk("products/update", async (product, thunkAPI) => {
  await delay(500);
  const items = loadFromStorage();
  const idx = items.findIndex((p) => p.id === product.id);
  if (idx === -1) throw new Error("Not found");
  items[idx] = product;
  saveToStorage(items);
  return product;
});

export const deleteProducts = createAsyncThunk("products/delete", async (ids, thunkAPI) => {
  await delay(300);
  let items = loadFromStorage();
  items = items.filter((p) => !ids.includes(p.id));
  saveToStorage(items);
  return ids;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: loadFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    // optional synchronous helpers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(createProduct.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createProduct.fulfilled, (s, a) => { s.loading = false; s.items.unshift(a.payload); })
      .addCase(createProduct.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(updateProduct.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.map((p) => (p.id === a.payload.id ? a.payload : p));
      })
      .addCase(updateProduct.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(deleteProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deleteProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter((p) => !a.payload.includes(p.id));
      })
      .addCase(deleteProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});

export default productsSlice.reducer;
