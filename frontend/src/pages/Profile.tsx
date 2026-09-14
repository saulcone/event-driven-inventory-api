import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { useLanguage } from '../context/LanguageContext';

export const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setUser(await userService.getMe());
      } catch {
        setError(t.profileError);
      }
    };

    void loadProfile();
  }, [t.profileError]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: 'var(--color-primary)' }} /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-text-main)', fontWeight: 'bold' }}>
        {t.profile}
      </Typography>
      <Paper elevation={0} sx={{ p: 4, border: '1px solid var(--color-border)' }}>
        <Stack spacing={2}>
          <Typography><strong>{t.name}:</strong> {user.name}</Typography>
          <Typography><strong>{t.username}:</strong> {user.username}</Typography>
          <Typography><strong>{t.email}:</strong> {user.email}</Typography>
          <Typography><strong>{t.role}:</strong> {user.role}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
