import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppFrame from './components/AppFrame';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import theme from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppFrame />}>
              <Route path="/"            element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/dashboard"   element={<Dashboard />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
