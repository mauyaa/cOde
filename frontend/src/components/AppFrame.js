import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { useAuth } from '../context/AuthContext';
import AuthDialog from './AuthDialog';

const navItems = [
  { label: 'Overview', path: '/',            icon: <HomeOutlinedIcon fontSize="small" /> },
  { label: 'Market board', path: '/marketplace', icon: <StorefrontIcon fontSize="small" /> },
  { label: 'Workspace',   path: '/dashboard',   icon: <DashboardIcon fontSize="small" /> },
];

const brand = {
  mark: 'Soko',
  tag:  'Shambani',
};

export default function AppFrame({ children }) {
  const { token, user, logout, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        component="nav"
        sx={{
          top: 0,
          zIndex: (t) => t.zIndex.drawer + 1,
          px: { md: '32px', lg: '48px' },
          py: 0,
        }}
      >
        <Toolbar
          sx={{
            minHeight: '64px !important',
            gap: { xs: 0, md: 3 },
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: (t) => t.typography.display,
                fontWeight: 600,
                fontSize: (t) => t.typography.type['2xl'],
                lineHeight: 1,
                color: 'inherit',
              }}
            >
              {brand.mark}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: (t) => t.typography.display,
                fontSize: (t) => t.typography.type.xs,
                color: 'text.secondary',
                letterSpacing: (t) => t.typography.tracking.wide,
                fontWeight: 400,
              }}
            >
              {brand.tag}
            </Typography>
          </Link>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              ml: 4,
            }}
          >
            {navItems.map(({ label, path, icon }) => (
              <Link
                key={path}
                component={RouterLink}
                to={path}
                underline="none"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: radius.md,
                  fontSize: (t) => t.typography.type.sm,
                  fontWeight: 500,
                  color: isActive(path) ? 'text.primary' : 'text.secondary',
                  backgroundColor: isActive(path) ? (t) => t.palette.primary.light : 'transparent',
                  transition: `all ${motion.fast}`,
                  '&:hover': {
                    backgroundColor: (t) => t.palette.elevated,
                    color: 'text.primary',
                  },
                }}
              >
                {label}
              </Link>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {token && user ? (
              <>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Badge
                    variant="dot"
                    color="primary"
                    invisible={false}
                    sx={{ '& .MuiBadge-badge': { width: 7, height: 7, minWidth: 7, top: 3, right: 3 } }}
                  >
                    <AccountCircle sx={{ color: 'text.muted', fontSize: 22 }} />
                  </Badge>
                  <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontSize: type.xs }}>
                      {user.fullName}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: type.xs,
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { px: 1 },
                      }}
                      color={user.role === 'farmer' ? 'primary' : 'default'}
                    />
                  </Box>
                </Box>

                <IconButton
                  size="small"
                  onClick={handleLogout}
                  aria-label="Log out"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <ExitToApp sx={{ fontSize: 18 }} />
                </IconButton>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  fontFamily: 'inherit',
                  fontSize: type.sm,
                  fontWeight: 500,
                  color: colors.green[600],
                  borderRadius: radius.md,
                  transition: `background-color ${motion.fast}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.elevated)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Sign in
              </button>
            )}

            {/* Mobile hamburger */}
            <IconButton
              size="small"
              onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
              aria-label="Menu"
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
            >
              <SettingsOutlined fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={() => setMobileMenuAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {navItems.map(({ label, path, icon }) => (
                <MenuItem
                  key={path}
                  component={RouterLink}
                  to={path}
                  onClick={() => setMobileMenuAnchor(null)}
                  selected={isActive(path)}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                  {label}
                </MenuItem>
              ))}
              <Divider />
              {token ? (
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon sx={{ minWidth: 36 }}><ExitToApp fontSize="small" /></ListItemIcon>
                  Sign out
                </MenuItem>
              ) : (
                <MenuItem onClick={() => { setShowAuth(true); setMobileMenuAnchor(null); }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><SettingsOutlined fontSize="small" /></ListItemIcon>
                  Sign in
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box component="main" sx={{ flex: 1, mt: '64px' }}>
        {children}
      </Box>

      {/* Auth dialog */}
      {showAuth && (
        <AuthDialog
          open={showAuth}
          onClose={() => setShowAuth(false)}
        />
      )}
    </Box>
  );
}
