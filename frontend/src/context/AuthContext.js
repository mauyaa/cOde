import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'agri-market-session';

export function AuthProvider({ children }) {
  const [token,     setToken]     = useState(null);
  const [user,      setUser]      = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [authDialog, setAuthDialog] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const sess = JSON.parse(raw);
        setToken(sess.token || null);
        setUser(sess.user || null);
      }
    } catch (_) {}
    setIsHydrating(false);
  }, []);

  const saveSession = useCallback(({ token: t, user: u }) => {
    if (t && u) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ token: t, user: u }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res  = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed. Check your email and password.');
    }
    const { token: t, ...rest } = await res.json();
    setToken(t);
    setUser(rest);
    saveSession({ token: t, user: { ...rest, token: t } });
    return { token: t, ...rest };
  }, [saveSession]);

  const register = useCallback(async (body) => {
    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Registration failed.');
    }
    const { token: t, ...rest } = await res.json();
    setToken(t);
    setUser(rest);
    saveSession({ token: t, user: { ...rest, token: t } });
    return { token: t, ...rest };
  }, [saveSession]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    saveSession(null);
  }, [saveSession]);

  const openAuthDialog  = useCallback(() => setAuthDialog(true),  []);
  const closeAuthDialog = useCallback(() => setAuthDialog(false), []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{
      token, user, isAuthenticated, isHydrating,
      authDialog, login, register, logout,
      openAuthDialog, closeAuthDialog,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
