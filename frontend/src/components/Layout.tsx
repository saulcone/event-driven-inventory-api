import React from 'react';
import type { ReactNode } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
};