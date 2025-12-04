import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./features/products/ProductList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="*" element={<ProductList />} />
    </Routes>
  );
}
