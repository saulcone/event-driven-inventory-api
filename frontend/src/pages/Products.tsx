import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { productService } from '../services/productService';
import type { Product, ProductInput } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Products: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const canEditProducts = user?.role === 'staff' || user?.role === 'admin';

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await productService.getAll({
          page: page + 1,
          search: search || undefined,
          orderBy: orderBy || undefined,
        });
        setProducts(data.items);
        setTotal(data.count);
      } catch {
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    void loadProducts();
  }, [page, search, orderBy]);

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setOrderBy(event.target.value);
    setPage(0);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
  };

  const handleSave = async () => {
    if (!editingProduct || !editForm) return;
    try {
      setSaving(true);
      setError('');
      const updatedProduct = await productService.update(editingProduct.id, editForm);
      setProducts((prev: Product[]) => prev.map((p: Product) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setEditingProduct(null);
      setEditForm(null);
    } catch {
      setError('Unable to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleting(true);
      setError('');
      await productService.delete(deletingProduct.id);
      setProducts((prev: Product[]) => prev.filter((product: Product) => product.id !== deletingProduct.id));
      setTotal((prev: number) => Math.max(prev - 1, 0));
      setDeletingProduct(null);
    } catch {
      setError('Unable to delete product. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>
            {t.products}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
            {total} products in the catalog
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 200, flex: { xs: 1, sm: 'none' } }}>
            <InputLabel id="sort-select-label">{t.sortBy}</InputLabel>
            <Select
              labelId="sort-select-label"
              value={orderBy}
              label={t.sortBy}
              onChange={handleOrderChange}
              sx={{ backgroundColor: 'var(--color-surface)' }}
            >
              <MenuItem value="">{t.defaultSort}</MenuItem>
              <MenuItem value="name">{t.sortNameAsc}</MenuItem>
              <MenuItem value="-name">{t.sortNameDesc}</MenuItem>
              <MenuItem value="price">{t.sortPriceAsc}</MenuItem>
              <MenuItem value="-price">{t.sortPriceDesc}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder={t.searchPlaceholder}
            sx={{ minWidth: { xs: '100%', sm: 260 }, flex: { xs: 1, sm: 'none' }, '& .MuiOutlinedInput-root': { backgroundColor: 'var(--color-surface)' } }}
          />
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--color-border)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'var(--color-surface-muted)' }}>
              <TableRow>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell align="right">{t.price}</TableCell>
                <TableCell align="right">{t.stock}</TableCell>
                <TableCell align="right">{t.totalSold}</TableCell>
                {canEditProducts && <TableCell align="right">{t.actions}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEditProducts ? 6 : 5} align="center">
                    <Typography sx={{ color: 'var(--color-text-muted)', py: 3 }}>{t.noProductsFound}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: Product) => (
                  <TableRow key={product.id} hover>
                    <TableCell sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">CHF {product.price}</TableCell>
                    <TableCell align="right">{product.stock_quantity}</TableCell>
                    <TableCell align="right">{product.total_sold}</TableCell>
                    {canEditProducts && (
                      <TableCell align="right">
                        <IconButton aria-label={`${t.edit} ${product.name}`} onClick={() => handleEdit(product)} sx={{ color: 'var(--color-primary)' }}>
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          aria-label={`${t.delete} ${product.name}`}
                          onClick={() => setDeletingProduct(product)}
                          sx={{ color: 'var(--color-primary)', ml: 0.5 }}
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, nextPage: number) => setPage(nextPage)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
          />
        </TableContainer>
      )}

      {/* Delete Dialog */}
      <Dialog open={Boolean(deletingProduct)} onClose={() => !deleting && setDeletingProduct(null)} fullWidth maxWidth="xs">
        <DialogTitle>{t.delete} {deletingProduct?.name}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'var(--color-text-muted)', pt: 1 }}>
            {t.confirmDelete}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingProduct(null)} disabled={deleting}>{t.cancel}</Button>
          <Button onClick={() => void handleDelete()} variant="contained" color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : t.delete}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingProduct)} onClose={() => !saving && setEditingProduct(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t.edit} {editingProduct?.name}</DialogTitle>
        <DialogContent>
          {editForm && (
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField label={t.name} value={editForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value })} fullWidth />
              <TextField label="Description" value={editForm.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, description: e.target.value })} multiline minRows={3} fullWidth />
              <TextField label={t.category} value={editForm.category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, category: e.target.value })} fullWidth />
              <TextField label={t.price} type="number" value={editForm.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, price: e.target.value })} slotProps={{ htmlInput: { step: '0.01', min: 0 } }} fullWidth />
              <TextField label={t.stock} type="number" value={editForm.stock_quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, stock_quantity: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0, step: 1 } }} fullWidth />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingProduct(null)} disabled={saving}>{t.cancel}</Button>
          <Button onClick={() => void handleSave()} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t.save}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};