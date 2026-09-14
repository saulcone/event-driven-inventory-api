import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

export const DRAWER_WIDTH = 260;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, loading, signOut } = useAuth();

  const handleLanguageChange = (event: SelectChangeEvent<Language>) => {
    setLanguage(event.target.value as Language);
  };

const navItems = [
  { text: 'Dashboard', icon: <SpaceDashboardOutlinedIcon />, path: '/dashboard' },
  { text: t.products, icon: <Inventory2OutlinedIcon />, path: '/products' },
  ...(user?.role === 'admin'
    ? [{ text: t.users, icon: <PeopleAltOutlinedIcon />, path: '/users' }]
    : []),
];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'var(--color-text-main)',
          color: 'var(--color-primary-contrast)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--color-text-muted)',
        },
      }}
    >
      <Box>
        {/* Branding Header */}
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            component="img"
            src={logo}
            alt="Application"
            sx={{ width: 145, height: 'auto', filter: 'brightness(0) invert(1)' }}
          />
          <Box>
            <Typography variant="caption" sx={{ color: 'var(--color-accent-blue)' }}>
              {t.brandSubtitle}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'var(--color-text-muted)' }} />

        {/* Navigation List */}
        <List sx={{ px: 1.5, py: 2 }}>
          {navItems.map((item) => {
            const isSelected = location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(233, 58, 55, 0.16)' : 'transparent',
                    color: isSelected ? 'var(--color-primary-hover)' : 'var(--color-accent-blue)',
                    '&:hover': {
                      backgroundColor: 'rgba(233, 58, 55, 0.16)',
                      color: 'var(--color-primary-contrast)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? 'var(--color-primary-hover)' : 'var(--color-accent-blue)', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{ primary: { sx: { fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 } } }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Language Switcher Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid var(--color-text-muted)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'var(--color-accent-blue)' }}>
          <LanguageOutlinedIcon fontSize="small" />
          <Typography variant="caption">{t.language}</Typography>
        </Box>
        <FormControl fullWidth size="small">
          <Select
            value={language}
            onChange={handleLanguageChange}
            sx={{
              color: 'var(--color-primary-contrast)',
              backgroundColor: 'rgba(242, 242, 242, 0.1)',
              fontSize: '0.85rem',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-text-muted)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary-hover)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
              '.MuiSvgIcon-root': { color: 'var(--color-accent-blue)' },
            }}
          >
            <MenuItem value="en">English (EN)</MenuItem>
            <MenuItem value="de_CH">Deutsch (DE)</MenuItem>
          </Select>
        </FormControl>
        {!loading && (user ? (
          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              startIcon={<AccountCircleOutlinedIcon />}
              onClick={() => navigate('/profile')}
              sx={{ justifyContent: 'flex-start', color: 'var(--color-primary-contrast)', textTransform: 'none' }}
            >
              {user.name || user.email}
            </Button>
            <Button
              fullWidth
              startIcon={<LogoutOutlinedIcon />}
              onClick={signOut}
              sx={{ justifyContent: 'flex-start', color: 'var(--color-accent-blue)', textTransform: 'none' }}
            >
              {t.logout}
            </Button>
          </Box>
        ) : (
          <Button
            component="a"
            href="/login"
            fullWidth
            startIcon={<LoginOutlinedIcon />}
            sx={{
              mt: 2,
              justifyContent: 'flex-start',
              color: 'var(--color-primary-contrast)',
              border: '1px solid var(--color-text-muted)',
              '&:hover': {
                backgroundColor: 'rgba(233, 58, 55, 0.16)',
                borderColor: 'var(--color-primary-hover)',
              },
            }}
          >
            {t.signIn}
          </Button>
        ))}
      </Box>
    </Drawer>
  );
};