import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, createProduct, updateProduct, deleteProducts } from "./productsSlice";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Tooltip,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  TableFooter
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchFilterBar from "../../components/SearchFilterBar";
import Pager from "../../components/Pagination";
import ProductForm from "./ProductForm";
import { format } from "date-fns";

const parseNum = (v, fallback = 10) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function ProductList() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, loading } = useSelector((s) => s.products);

  // URL state
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = parseNum(searchParams.get("page"), 1);
  const limit = parseNum(searchParams.get("limit"), 10);

  // UI state
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 🔥 CLEAN NORMALIZE FUNCTION FOR SEARCH
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  // 🔥 Final filtering logic
  const filtered = useMemo(() => {
    let arr = [...items];

    const fq = normalize(query);

    // SEARCH
    if (fq) {
      arr = arr.filter((p) => {
        const name = normalize(p.name);
        const desc = normalize(p.description);
        return name.includes(fq) || desc.includes(fq);
      });
    }

    // CATEGORY FILTER
    if (category) {
      arr = arr.filter((p) => p.category === category);
    }

    // SORTING
    arr.sort((a, b) => {
      const dir = order === "asc" ? 1 : -1;

      if (sortBy === "sellPrice" || sortBy === "costPrice") {
        return dir * (Number(a[sortBy]) - Number(b[sortBy]));
      }

      if (!a[sortBy]) return 1;
      if (!b[sortBy]) return -1;
      return dir * (new Date(a[sortBy]) - new Date(b[sortBy]));
    });

    return arr;
  }, [items, query, category, sortBy, order]);

  // PAGINATION
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * limit, (currentPage - 1) * limit + limit);

  // PAGE TOTALS
  const totals = pageItems.reduce(
    (acc, p) => {
      acc.cost += Number(p.costPrice || 0);
      acc.sell += Number(p.sellPrice || 0);
      acc.final += Number(p.discountedSellPrice || 0);
      return acc;
    },
    { cost: 0, sell: 0, final: 0 }
  );

  // 🔧 Helper to update URL cleanly
  const updateURL = (overrides = {}) => {
    const params = {
      q: query || "",
      category: category || "",
      sortBy,
      order,
      page: currentPage,
      limit,
      ...overrides,
    };

    Object.keys(params).forEach((k) => {
      if (!params[k]) delete params[k];
    });

    setSearchParams(params);
  };

  // SELECTION HANDLERS
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () => {
    if (selected.length === pageItems.length) setSelected([]);
    else setSelected(pageItems.map((p) => p.id));
  };

  // FORM HANDLERS
  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleSave = async (product) => {
    setSaving(true);
    try {
      if (product.id) await dispatch(updateProduct(product)).unwrap();
      else await dispatch(createProduct(product)).unwrap();

      setShowForm(false);
      setSelected([]);
      updateURL({ page: 1 });
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOne = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await dispatch(deleteProducts([id]));
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Delete ${selected.length} selected products?`)) return;
    await dispatch(deleteProducts(selected));
    setSelected([]);
  };

  // RESET FILTERS
  const onResetFilters = () => setSearchParams({});

  return (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Product Catalog</Typography>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Product
          </Button>

          <Button
            sx={{ ml: 1 }}
            variant="outlined"
            color="error"
            disabled={selected.length === 0}
            onClick={handleBulkDelete}
          >
            Delete Selected
          </Button>
        </Box>
      </Toolbar>

      <SearchFilterBar
        query={query}
        setQuery={(v) => updateURL({ q: v, page: 1 })}
        category={category}
        setCategory={(v) => updateURL({ category: v, page: 1 })}
        sortBy={sortBy}
        setSortBy={(v) => updateURL({ sortBy: v, page: 1 })}
        order={order}
        setOrder={(v) => updateURL({ order: v, page: 1 })}
        limit={limit}
        setLimit={(v) => updateURL({ limit: v, page: 1 })}
        onReset={onResetFilters}
      />

      <Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={pageItems.length > 0 && selected.length === pageItems.length}
                      onChange={toggleAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell align="right">Cost Price</TableCell>
                  <TableCell align="right">Sell Price</TableCell>
                  <TableCell align="right">Final Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((p) => (
                    <TableRow key={p.id} hover selected={selected.includes(p.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(p.id)}
                          onChange={() => toggleOne(p.id)}
                        />
                      </TableCell>

                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>
                        {p.expiryDate ? format(new Date(p.expiryDate), "yyyy-MM-dd") : "-"}
                      </TableCell>
                      <TableCell align="right">{Number(p.costPrice).toFixed(2)}</TableCell>
                      <TableCell align="right">{Number(p.sellPrice).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {Number(p.discountedSellPrice).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(p)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteOne(p.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <strong>Page totals:</strong>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell align="right">
                    <strong>{totals.cost.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.sell.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.final.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>

            <Pager
              page={currentPage}
              totalPages={totalPages}
              onChange={(p) => updateURL({ page: p })}
            />
          </>
        )}
      </Paper>

      {showForm && (
        <Box sx={{ mt: 2 }}>
          <ProductForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        </Box>
      )}
    </Box>
  );
}
