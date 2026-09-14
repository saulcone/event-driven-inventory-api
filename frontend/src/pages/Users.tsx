import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { userService } from '../services/userService';
import type { User, UserPage } from '../services/userService';

export const Users: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const data: UserPage = await userService.getAll({ page: page + 1, search: search || undefined });
        setUsers(data.items);
        setTotal(data.count);
      } catch {
        setError('Unable to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [page, search]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}>
              {t.users}
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              {total} users in the system
            </Typography>
          </Box>
          <TextField
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder={t.searchUsersPlaceholder}
            slotProps={{ htmlInput: { 'aria-label': t.searchUsersPlaceholder } }}
            sx={{
              minWidth: { xs: '100%', sm: 280 },
              '& .MuiOutlinedInput-root': { backgroundColor: 'var(--color-surface)' },
            }}
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
                <TableCell>{t.username}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell align="right">{t.role}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography sx={{ color: 'var(--color-text-muted)', py: 3 }}>
                      {t.noUsersFound}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{user.name || '-'}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">{user.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            labelRowsPerPage="Users per page"
          />
        </TableContainer>
      )}
    </Box>
  );
};