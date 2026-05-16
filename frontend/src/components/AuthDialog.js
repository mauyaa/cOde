import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab,
  TextField, Button, Box, Typography,
  MenuItem, Select, InputLabel, FormControl,
  CircularProgress, Divider,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import LockOpenOutlined from '@mui/icons-material/LockOpenOutlined';

const PAGES = { signin: 0, register: 1 };

const FILL_PRESETS = {
  buyer:  { email: 'njeri@buyer.demo',  password: 'demo123' },
  farmer: { email: 'amina@mkulima.demo', password: 'demo123' },
};

export default function AuthDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [page, setPage]         = useState(PAGES.signin);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole]         = useState('buyer');
  const [location, setLocation] = useState('');
  const [phone, setPhone]       = useState('');
  const [bio, setBio]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [loginOk, setLoginOk]   = useState(false);
  const passwordRef = useRef(null);

  // Reset form when dialog closes/reopens
  useEffect(() => {
    if (open) {
      setPage(PAGES.signin);
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('buyer');
      setLocation('');
      setPhone('');
      setBio('');
      setError('');
      setLoginOk(false);
    }
  }, [open]);

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('agri-market-session', JSON.stringify(data));
      setLoginOk(true);
      setTimeout(() => { onClose(); navigate('/dashboard'); }, 400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role, location, phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('agri-market-session', JSON.stringify(data));
      setLoginOk(true);
      setTimeout(() => { onClose(); navigate('/dashboard'); }, 400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (page === PAGES.signin) handleSignIn();
    else handleRegister();
  };

  const preset = FILL_PRESETS[role];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ timeout: 200 }}
      PaperProps={{
        sx: { borderRadius: '12px', overflow: 'hidden' },
      }}
    >
      <Box sx={{ px: 3.5, pt: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
            {loginOk ? 'Welcome back' : page === PAGES.signin ? 'Sign in' : 'Create account'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {loginOk ? 'Redirecting to your workspace…' : page === PAGES.signin
              ? 'Your workspace on Soko Shambani'
              : 'Join as farmer or buyer'
            }
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mt: 2, borderColor: 'divider' }} />

      <DialogContent sx={{ pt: 3, px: 3.5, pb: 1 }}>
        <Tabs
          value={page}
          onChange={(_, v) => { setPage(v); setError(''); }}
          sx={{ mb: 3, minHeight: 36, height: 36 }}
        >
          <Tab label="Sign in" disableRipple sx={{ minHeight: 36, height: 36 }} />
          <Tab label="Register" disableRipple sx={{ minHeight: 36, height: 36 }} />
        </Tabs>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* ── Sign-in form ── */}
        {page === PAGES.signin && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              inputRef={passwordRef}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Demo accounts:
              </Typography>
              <Button
                size="small"
                onClick={() => setRole('buyer')}
                sx={{ fontSize: '11px', px: 1, minWidth: 'auto', py: 0.3 }}
              >
                Buyer
              </Button>
              <Button
                size="small"
                onClick={() => { setRole('farmer'); setEmail(preset.email); }}
                sx={{ fontSize: '11px', px: 1, minWidth: 'auto', py: 0.3 }}
              >
                Farmer
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
              <Button onClick={onClose} color="inherit" sx={{ minWidth: 'auto' }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleSignIn}
                disabled={loading || !email || !password}
                startIcon={loading ? <CircularProgress size={15} color="inherit" /> : <LockOpenOutlined fontSize="small" />}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Register form ── */}
        {page === PAGES.register && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Account type</InputLabel>
                <Select value={role} label="Account type" onChange={(e) => { setRole(e.target.value); setEmail(''); setPassword(''); }}>
                  <MenuItem value="farmer">Farmer</MenuItem>
                  <MenuItem value="buyer">Buyer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputRef={passwordRef}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Location (county)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                placeholder="+254 700 000 000"
              />
            </Box>
            <TextField
              label="Short profile bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
              <Button onClick={onClose} color="inherit" sx={{ minWidth: 'auto' }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                disabled={loading || !email || !password || !fullName}
                startIcon={loading ? <CircularProgress size={15} color="inherit" /> : <PersonAddOutlined fontSize="small" />}
              >
                Create account
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
