import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useLanguage } from '../context/LanguageContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', username: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userService.create(form);
      navigate('/login');
    } catch {
      setError(t.accountError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto' }}>
      <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: 4, border: '1px solid var(--color-border)' }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'var(--color-text-main)', fontWeight: 'bold' }}>
          {t.register}
        </Typography>
        <Typography sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
          {t.createAccount}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2}>
          <TextField label={t.name} value={form.name} onChange={handleChange('name')} required fullWidth />
          <TextField label="Username" value={form.username} onChange={handleChange('username')} required fullWidth />
          <TextField label={t.email} type="email" value={form.email} onChange={handleChange('email')} required fullWidth />
          <TextField label={t.password} type="password" value={form.password} onChange={handleChange('password')} required fullWidth />
          <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: 'var(--color-primary)', '&:hover': { backgroundColor: 'var(--color-primary-hover)' } }}>
            {loading ? t.creatingAccount : t.register}
          </Button>
          <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'var(--color-primary)' }}>
            {t.alreadyHaveAccount}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
