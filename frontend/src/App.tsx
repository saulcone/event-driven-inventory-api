import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Users } from './pages/Users';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;