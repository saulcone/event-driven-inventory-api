import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { productService } from '../services/productService';
import type { Product, ProductSummary } from '../services/productService';
import axios from 'axios';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<ProductSummary>({ total_products: 0, low_stock_items: 0, total_sold: 0 });
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [topProductsError, setTopProductsError] = useState('');

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        setLoadingTopProducts(true);
        setTopProductsError('');
        const [topProductsData, summaryData] = await Promise.all([
          productService.getMostSold(),
          productService.getSummary(),

          
        ]);
        setTopProducts(topProductsData.items);
        setSummary(summaryData);
      } catch(error: unknown) {

        if(axios.isAxiosError(error) && error.response?.status === 403) {
          setTopProductsError(t.accessError);
        } else {
          setTopProductsError(t.bestSellingError);
        }
      } finally {
        setLoadingTopProducts(false);
      }
    };

    void loadTopProducts();
  }, [t.bestSellingError, t.accessError]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text-main)', mb: 0.5, fontWeight: 'bold' }}>
          {t.inventory} {t.overview}
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
          {t.welcomeBack}
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'var(--color-accent-blue)', color: 'var(--color-text-main)' }}>
              <Inventory2OutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {t.totalProducts}
              </Typography>
              <Typography variant="h5" sx={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>
                {summary.total_products}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'var(--color-accent-peach)', color: 'var(--color-primary)' }}>
              <WarningAmberOutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {t.lowStock} {t.items}
              </Typography>
              <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                {summary.low_stock_items}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'var(--color-accent-green)', color: 'var(--color-primary-contrast)' }}>
              <TrendingUpOutlinedIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {t.totalSold}
              </Typography>
              <Typography variant="h5" sx={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>
                {summary.total_sold}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'var(--color-text-main)', mb: 0.5, fontWeight: 'bold' }}>
          {t.bestSellingProducts}
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
          {t.topFiveSales}
        </Typography>

        {topProductsError && <Alert severity="error" sx={{ mb: 3 }}>{topProductsError}</Alert>}

        {loadingTopProducts ? (
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
                </TableRow>
              </TableHead>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">CHF {product.price}</TableCell>
                    <TableCell align="right">{product.stock_quantity}</TableCell>
                    <TableCell align="right">{product.total_sold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Quick Action Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'var(--color-text-main)',
          color: 'var(--color-primary-contrast)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 'bold' }}>
            {t.readyToManageCatalog}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-accent-blue)' }}>
            {t.catalogDescription}
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForwardOutlinedIcon />}
          onClick={() => navigate('/products')}
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
          }}
        >
          {t.goTo} {t.products}
        </Button>
      </Paper>
    </Box>
  );
};