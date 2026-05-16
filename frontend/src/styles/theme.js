import { createTheme } from '@mui/material/styles';

// Creative direction: "Field Truth" — Refined & Modern
// A calm, modern agricultural marketplace with premium feel
// Clean lines, generous whitespace, and purposeful color usage

// ─── Colour ───────────────────────────────────────────────────────────

const colors = {
  // Modern neutral base
  paper:      '#FAFBFC',
  surface:    '#FFFFFF',
  elevated:   '#F8FAFC',
  bg:         '#F0F4F8',
  scrollbar:  '#E8ECEF',
  
  // Refined borders
  horizon:    '#E2E8EF',
  wireframe:  '#D4DDE5',
  
  // Text — refined scale
  ink:        '#0F172A',
  muted:      '#475569',
  quiet:      '#64748B',
  ghost:      '#94A3B8',
  
  // Primary accent — modern forest green
  green: {
    50:  '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#145231',
  },
  
  // Secondary emerald for depth
  emerald: {
    50:  '#F0FDF4',
    100: '#DBEAFE',
    500: '#10B981',
    600: '#059669',
  },
  
  // Status colors — modern palette
  status: {
    ok:         '#22C55E',
    okLight:    '#F0FDF4',
    caution:    '#F59E0B',
    cautionLight: '#FFFBEB',
    danger:     '#EF4444',
    dangerLight: '#FEF2F2',
    info:       '#3B82F6',
    infoLight:  '#EFF6FF',
  },
};

// ─── Spacing ──────────────────────────────────────────────────────────

const space = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// ─── Typography ───────────────────────────────────────────────────────

const type = {
  fontFamily: {
    body:    'var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif)',
    display: 'var(--font-display, "Iowan Old Style", "Noto Serif", Georgia, serif)',
    mono:    '"SF Mono", "Cascadia Code", "Consolas", monospace',
  },
  
  size: {
    xs:   '12px',
    sm:   '13px',
    body: '14px',
    lg:   '16px',
    xl:   '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '32px',
  },
  
  tracking: {
    tight:  '-0.02em',
    normal: '0',
    wide:   '0.02em',
  },
  
  leading: {
    tight:   1.2,
    snug:    1.4,
    normal:  1.6,
    relaxed: 1.8,
  },
};

// ─── Border Radius ────────────────────────────────────────────────────

const radius = {
  none:  '0px',
  xs:    '4px',
  sm:    '6px',
  md:    '8px',
  lg:    '12px',
  xl:    '16px',
  '2xl': '20px',
  pill:  '999px',
};

// ─── Shadows ──────────────────────────────────────────────────────────

const shadow = {
  none:   'none',
  xs:     '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  sm:     '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
  md:     '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
  lg:     '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
  xl:     '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
  '2xl':  '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
};

// ─── Motion ───────────────────────────────────────────────────────────

const motion = {
  fast:   '150ms cubic-bezier(0.16, 1, 0.3, 1)',
  base:   '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow:   '350ms cubic-bezier(0.16, 1, 0.3, 1)',
};

// ─── Breakpoints ──────────────────────────────────────────────────────

const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '1024px',
  lg: '1280px',
  xl: '1536px',
};

// ─── MUI Theme Overrides ──────────────────────────────────────────────

function overrides() {
  return {
    typography: {
      fontFamily: type.fontFamily.body,
      fontSize: 14,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      
      h1: {
        fontFamily: type.fontFamily.display,
        fontSize: '36px',
        fontWeight: 600,
        lineHeight: type.leading.tight,
        letterSpacing: type.tracking.tight,
        color: colors.ink,
        marginBottom: '8px',
      },
      h2: {
        fontFamily: type.fontFamily.display,
        fontSize: '28px',
        fontWeight: 600,
        lineHeight: type.leading.snug,
        color: colors.ink,
        marginBottom: '12px',
      },
      h3: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: type.leading.snug,
        color: colors.ink,
        marginBottom: '8px',
      },
      h4: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: type.leading.snug,
        color: colors.ink,
      },
      h5: {
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: type.leading.normal,
        color: colors.ink,
      },
      h6: {
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: colors.quiet,
      },
      body1: {
        fontSize: '14px',
        lineHeight: type.leading.normal,
        color: colors.muted,
      },
      body2: {
        fontSize: '12px',
        lineHeight: type.leading.normal,
        color: colors.quiet,
      },
      overline: {
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.ghost,
      },
      caption: {
        fontSize: '12px',
        lineHeight: type.leading.normal,
        color: colors.quiet,
      },
    },
    
    palette: {
      mode: 'light',
      background: {
        default: colors.paper,
        paper: colors.surface,
      },
      text: {
        primary: colors.ink,
        secondary: colors.muted,
        disabled: colors.ghost,
      },
      divider: colors.horizon,
      primary: {
        main: colors.green[600],
        light: colors.green[50],
        lighter: colors.green[100],
        dark: colors.green[700],
        darker: colors.green[900],
        contrastText: colors.surface,
      },
      secondary: {
        main: colors.emerald[500],
        light: colors.emerald[50],
        dark: colors.emerald[600],
        contrastText: colors.surface,
      },
      success: { main: colors.status.ok, light: colors.status.okLight },
      warning: { main: colors.status.caution, light: colors.status.cautionLight },
      error: { main: colors.status.danger, light: colors.status.dangerLight },
      info: { main: colors.status.info, light: colors.status.infoLight },
      action: {
        active: colors.green[600],
        hover: colors.green[50],
        selected: colors.green[100],
        disabled: colors.ghost,
        disabledBackground: colors.bg,
      },
    },
    
    shape: { borderRadius: radius.md },
    spacing: (factor) => `${space.sm * factor}px`,
    
    components: {
      // Global styles
      MuiCssBaseline: {
        styleOverrides: {
          html: { scrollBehavior: 'smooth' },
          body: {
            backgroundColor: colors.paper,
            color: colors.ink,
            fontFamily: type.fontFamily.body,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            '&::-webkit-scrollbar': { width: 8, height: 8 },
            '&::-webkit-scrollbar-track': { backgroundColor: colors.paper },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colors.wireframe,
              borderRadius: radius.pill,
              '&:hover': { backgroundColor: colors.quiet },
            },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
            },
          },
        },
      },
      
      // Cards
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.horizon}`,
            transition: `all ${motion.base}`,
            
            '&:hover': {
              borderColor: colors.wireframe,
              boxShadow: shadow.md,
            },
          },
          elevation0: { boxShadow: 'none' },
        },
      },
      
      // Buttons
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'none',
            transition: `all ${motion.fast}`,
            padding: '10px 20px',
            border: 'none',
            
            '&:disabled': {
              backgroundColor: colors.bg,
              color: colors.ghost,
              cursor: 'not-allowed',
            },
          },
          
          containedPrimary: {
            backgroundColor: colors.green[600],
            color: colors.surface,
            boxShadow: shadow.sm,
            
            '&:hover': {
              backgroundColor: colors.green[700],
              boxShadow: shadow.md,
              transform: 'translateY(-1px)',
            },
            
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: shadow.xs,
            },
          },
          
          containedSecondary: {
            backgroundColor: colors.emerald[50],
            color: colors.emerald[700],
            border: `1px solid ${colors.emerald[200]}`,
            
            '&:hover': {
              backgroundColor: colors.emerald[100],
              borderColor: colors.emerald[300],
            },
          },
          
          outlined: {
            borderColor: colors.wireframe,
            color: colors.muted,
            
            '&:hover': {
              backgroundColor: colors.elevated,
              borderColor: colors.horizon,
            },
          },
          
          text: {
            color: colors.muted,
            
            '&:hover': {
              backgroundColor: colors.elevated,
              color: colors.ink,
            },
          },
          
          sizeLarge: {
            padding: '14px 28px',
            fontSize: '15px',
          },
          
          sizeSmall: {
            padding: '7px 16px',
            fontSize: '13px',
          },
        },
      },
      
      // Text Fields
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.elevated,
            borderRadius: radius.md,
            transition: `all ${motion.fast}`,
            fontSize: '14px',
            
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.horizon,
              transition: `border-color ${motion.fast}`,
            },
            
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.wireframe,
            },
            
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.green[500],
              borderWidth: '2px',
              boxShadow: `0 0 0 4px ${colors.green[50]}`,
            },
          },
          input: {
            padding: '10px 12px',
          },
        },
      },
      
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.quiet,
            fontSize: '13px',
            fontWeight: 500,
            
            '&.Mui-focused': {
              color: colors.green[600],
            },
          },
        },
      },
      
      // Chips
      MuiChip: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            fontSize: '12px',
            fontWeight: 500,
            transition: `all ${motion.fast}`,
            height: 28,
          },
          
          filled: {
            backgroundColor: colors.elevated,
            color: colors.ink,
            border: `1px solid ${colors.horizon}`,
          },
          
          outlined: {
            backgroundColor: 'transparent',
            borderColor: colors.horizon,
            color: colors.muted,
            
            '&:hover': {
              backgroundColor: colors.elevated,
              borderColor: colors.wireframe,
            },
          },
          
          colorPrimary: {
            backgroundColor: colors.green[100],
            color: colors.green[700],
            border: `1px solid ${colors.green[300]}`,
          },
        },
      },
      
      // Dialogs
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadow.xl,
            border: `1px solid ${colors.horizon}`,
          },
        },
      },
      
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '20px',
            fontWeight: 600,
            color: colors.ink,
            paddingBottom: '8px',
          },
        },
      },
      
      // AppBar
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.horizon}`,
            color: colors.ink,
            boxShadow: shadow.xs,
          },
        },
      },
      
      // Tabs
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 44,
            borderBottom: `1px solid ${colors.horizon}`,
          },
          indicator: {
            height: 3,
            backgroundColor: colors.green[600],
            borderRadius: radius.pill,
          },
        },
      },
      
      MuiTab: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'none',
            transition: `all ${motion.fast}`,
            color: colors.quiet,
            
            '&.Mui-selected': {
              color: colors.green[700],
              fontWeight: 600,
            },
            
            '&:hover': {
              color: colors.muted,
              backgroundColor: colors.elevated,
            },
          },
        },
      },
      
      // Snackbar
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: colors.ink,
            color: colors.surface,
            borderRadius: radius.md,
            boxShadow: shadow.lg,
            fontSize: '13px',
          },
        },
      },
      
      // Menu
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '14px',
            transition: `all ${motion.fast}`,
            
            '&:hover': {
              backgroundColor: colors.elevated,
            },
            
            '&.Mui-selected': {
              backgroundColor: colors.green[50],
              color: colors.green[700],
              fontWeight: 600,
              
              '&:hover': {
                backgroundColor: colors.green[100],
              },
            },
          },
        },
      },
      
      // Linear Progress
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 4,
            borderRadius: radius.pill,
            backgroundColor: colors.bg,
          },
          bar: {
            borderRadius: radius.pill,
            backgroundColor: colors.green[600],
          },
        },
      },
    },
  };
}

export { type, space, colors, shadow, radius, motion, breakpoints, overrides };
export default createTheme(overrides());
