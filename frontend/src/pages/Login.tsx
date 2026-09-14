import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch {
      setError(t.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto' }}>
      <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: 4, border: '1px solid var(--color-border)' }}>
        <Typography variant="h4" sx={{ mb: 1, color: 'var(--color-text-main)', fontWeight: 'bold' }}>
          {t.signIn}
        </Typography>
        <Typography sx={{ mb: 3, color: 'var(--color-text-muted)' }}>
          {t.accessAccount}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2}>
          <TextField
            label={t.email}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label={t.password}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: 'var(--color-primary)', '&:hover': { backgroundColor: 'var(--color-primary-hover)' } }}>
            {loading ? t.signingIn : t.signIn}
          </Button>
          <Button component={RouterLink} to="/register" variant="text" sx={{ color: 'var(--color-primary)' }}>
            {t.createAccount}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
