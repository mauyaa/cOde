import { createTheme } from '@mui/material/styles';
// Creative direction: "Field Truth"
// Every row on the market board is a record in a shared agricultural ledger.
// The palette is single-origin earth: warm paper, deep green, ink black.
// Typography carries all hierarchy; colour speaks only for status and accent.

// ─── Colour ───────────────────────────────────────────────────────────[...]

const colors = {
  // Background — one dominant base
  paper:      '#FAF9F6',
  surface:    '#FFFFFF',
  elevated:   '#F6F4EF',
  scrollbar:  '#EFECE6',
  // Border / structure
  horizon:    '#E8E4DC',
  wireframe:  '#D9D4CA',
  // Text — ink scale, four stops
  ink:        '#13110F',
  muted:      '#6B645B',
  quiet:      '#948D82',
  ghost:      '#BAB3A8',
  // Accent — forest green (one accent, unlimited weight)
  green: {
    50:  '#EDF7F0',
    100: '#D3EDDC',
    200: '#A8DCA8',
    300: '#72C57A',
    400: '#42A74E',
    500: '#2E6B41',
    600: '#235132',
    700: '#1A3F29',
    800: '#122E1F',
    900: '#0B2217',
  },
  // Supporting neutrals (used only for status)
  status: {
    ok:       '#2E6B41',
    okLight:  '#EDF7F0',
    caution:  '#A67200',
    cautionLight: '#FFF9E6',
    danger:   '#9B2335',
    dangerLight: '#FEF2F4',
    info:     '#2A5470',
    infoLight: '#EEF4F8',
  },
};

// ─── Spacing ──────────────────────────────────────────────────────────[...]

const space = {
  gutter: 24,
  gutterNarrow: 16,
  section: 64,
  sectionNarrow: 40,
  cell: 8,          // base unit — multiples only
};

const sectionY = (desktop) => ({
  paddingBlock: desktop ? `${space.section}px` : `${space.sectionNarrow}px`,
});

// ─── Typography Scale ───────────────────────────────────────────────────────[...]
// Single family for body; one display weight for titles.
// Leading is tight (1.3) for headings, generous (1.65) for body.

const type = {
  fontFamily: {
    body:      'var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif)',
    display:   'var(--font-display, "Iowan Old Style", "Noto Serif", Georgia, serif)',
    mono:      '"SF Mono", "Cascadia Code", "Consolas", monospace',
  },
  // Font-size clamp: scales fluidly between breakpoints
  // formula: clamp(min, preferred, max)
  // 1rem = 16px
  xs:   'clamp(0.75rem,  0.72rem  + 0.15vw, 0.8rem)',
  sm:   'clamp(0.813rem, 0.77rem  + 0.21vw, 0.875rem)',
  body: 'clamp(0.875rem, 0.81rem  + 0.32vw, 1rem)',
  lg:   'clamp(1rem,     0.9rem   + 0.5vw,  1.125rem)',
  xl:   'clamp(1.188rem, 1rem     + 0.94vw, 1.563rem)',
  '2xl': 'clamp(1.438rem, 1.2rem   + 1.19vw, 1.875rem)',
  '3xl': 'clamp(1.75rem,  1.4rem   + 1.75vw, 2.375rem)',
  '4xl': 'clamp(2.125rem, 1.6rem   + 2.63vw, 2.813rem)',
  // Letter-spacing
  tracking: {
    tight:    '-0.025em',
    normal:   '0',
    wide:     '0.025em',
  },
  // Line-height
  leading: {
    tight:  1.3,
    snug:   1.4,
    regular:1.65,
    loose:  1.85,
  },
};

// ─── Border Radius & Elevation ────────────────────────────────────────────────

const radius = {
  sm:  '4px',
  md:  '6px',
  lg:  '8px',
  xl:  '12px',
  pill:'999px',
};

const shadow = {
  xs: '0 1px 2px rgba(19,17,15,.04)',
  sm: '0 2px 6px rgba(19,17,15,.06), 0 1px 2px rgba(19,17,15,.04)',
  md: '0 4px 12px rgba(19,17,15,.07), 0 2px 4px rgba(19,17,15,.04)',
  lg: '0 8px 24px rgba(19,17,15,.09), 0 3px 8px rgba(19,17,15,.04)',
  xl: '0 12px 40px rgba(19,17,15,.12), 0 4px 12px rgba(19,17,15,.05)',
};

// ─── Animation Timing ───────────────────────────────────────────────────────[...]

const motion = {
  fast:     '120ms cubic-bezier(0.4, 0, 0.2, 1)',
  base:     '220ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow:     '360ms cubic-bezier(0.4, 0, 0.2, 1)',
  fadeIn:   { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slideUp:  { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } },
};

// ─── Breakpoints ────────────────────────────────────────────────────────[...]

const breakpoints = {
  sm: '640px',
  md: '900px',
  lg: '1200px',
  xl: '1440px',
};

// ─── MUI Theme Overrides ─────────────────────────────────────────────────────

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
        fontSize:    type['4xl'],
        fontWeight: 600,
        lineHeight:  type.leading.tight,
        letterSpacing: type.tracking.tight,
        color: colors.ink,
      },
      h2: {
        fontFamily: type.fontFamily.display,
        fontSize:    type['3xl'],
        fontWeight: 600,
        lineHeight:  1.25,
        letterSpacing: type.tracking.tight,
        color: colors.ink,
      },
      h3: {
        fontSize:    type['2xl'],
        fontWeight: 600,
        lineHeight:  1.3,
        letterSpacing: type.tracking.tight,
        color: colors.ink,
      },
      h4: {
        fontSize:    type['xl'],
        fontWeight: 500,
        lineHeight:  1.35,
        color: colors.ink,
      },
      body1: {
        fontSize:    type.body,
        lineHeight:  type.leading.regular,
        color: colors.muted,
      },
      body2: {
        fontSize:    type.sm,
        lineHeight:  type.leading.regular,
        color: colors.quiet,
      },
      overline: {
        fontSize:    type.xs,
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: colors.quiet,
      },
      button: {
        fontSize:    type.sm,
        fontWeight: 500,
        letterSpacing: type.tracking.normal,
        textTransform: 'none',
      },
    },
    palette: {
      mode: 'light',
      background: {
        default:    colors.paper,
        paper:      colors.surface,
        elevated:   colors.elevated,
      },
      text: {
        primary:   colors.ink,
        secondary: colors.muted,
        disabled:  colors.ghost,
      },
      divider:    colors.horizon,
      primary: {
        main:       colors.green[500],
        light:      colors.green[100],
        dark:       colors.green[700],
        contrastText: colors.surface,
      },
      secondary: {
        main:       colors.ink,
        light:      colors.elevated,
      },
      success: {
        main:       colors.status.ok,
      },
      warning: {
        main:       colors.status.caution,
      },
      error: {
        main:       colors.status.danger,
      },
      info: {
        main:       colors.status.info,
      },
    },
    shape: { borderRadius: radius.md },
    spacing: (factor) => `${space.cell * factor}px`,
    // Component overrides
    components: {
      // ── Reset scrollbar
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.paper,
            color: colors.ink,
            fontFamily: type.fontFamily.body,
            fontSize: type.body,
            lineHeight: type.leading.regular,
            letterSpacing: type.tracking.normal,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            // Scrollbar — minimal match
            scrollbarColor: `${colors.wireframe} transparent`,
            scrollbarWidth:  'thin',
            '&::-webkit-scrollbar':          { width: 6, height: 6 },
            '&::-webkit-scrollbar-thumb':    { backgroundColor: colors.wireframe, borderRadius: radius.pill },
            '&::-webkit-scrollbar-track':    { backgroundColor: 'transparent' },
            // Subtle grain for warmth (noise texture via SVG)
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(46,107,65,.02) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(46,107,65,.015) 0%, transparent 50%)
            `,
            backgroundAttachment: 'fixed',
          },
          // Respect reduced motion
          '@media (prefers-reduced-motion: reduce)': {
            '*': { animationDuration: '0ms !important', transitionDuration: '0ms !important' },
          },
        },
      },
      // ── Cards / Surfaces
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.horizon}`,
            transition: `box-shadow ${motion.base}, border-color ${motion.fast}, transform ${motion.base}`,
            '&:hover': {
              boxShadow: shadow.sm,
              borderColor: colors.wireframe,
            },
          },
        },
      },
      // ── Buttons — primary dominant, secondary brooding, text serene
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            padding: '10px 22px',
            fontWeight: 500,
            letterSpacing: type.tracking.normal,
            transition: `all ${motion.fast}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0)',
              transition: `background-color ${motion.fast}`,
            },
            '&:active::before': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          containedPrimary: {
            backgroundColor: colors.green[600],
            color: colors.surface,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: colors.green[700],
              boxShadow: shadow.md,
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: shadow.sm,
            },
            '&:disabled': {
              backgroundColor: colors.ghost,
              color: colors.quiet,
              boxShadow: 'none',
            },
          },
          containedSecondary: {
            backgroundColor: colors.paper,
            color: colors.ink,
            border: `1px solid ${colors.wireframe}`,
            '&:hover': {
              backgroundColor: colors.elevated,
              borderColor: colors.horizon,
              boxShadow: shadow.xs,
            },
          },
          contained: {
            boxShadow: 'none',
          },
          outlined: {
            '&:hover': {
              backgroundColor: colors.elevated,
              borderColor: colors.wireframe,
            },
          },
          text: {
            backgroundColor: 'transparent',
            color: colors.muted,
            '&:hover': {
              backgroundColor: colors.elevated,
              color: colors.ink,
            },
          },
        },
      },
      // ── Chips / labels
      MuiChip: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            fontWeight: 500,
            fontSize: type.xs,
            letterSpacing: type.tracking.wide,
            transition: `all ${motion.fast}`,
            '&:hover': {
              backgroundColor: colors.elevated,
            },
          },
          filled: { border: `1px solid transparent` },
          outlined: {
            backgroundColor: 'transparent',
            borderColor: colors.wireframe,
            color: colors.muted,
            '&:hover': {
              borderColor: colors.horizon,
              backgroundColor: colors.elevated,
            },
          },
        },
      },
      // ── Dialog
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadow.xl,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: type.fontFamily.display,
            fontSize: type['2xl'],
            fontWeight: 600,
            color: colors.ink,
            paddingBottom: 0,
          },
        },
      },
      // ── Text fields
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.elevated,
            borderRadius: radius.md,
            transition: `all ${motion.fast}`,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.horizon },
            '&:hover .MuiOutlinedInput-notchedOutline':   { borderColor: colors.wireframe },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
              borderColor: colors.green[500], 
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${colors.green[50]}`,
            },
          },
          notchedOutline: {},
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.quiet,
            fontSize: type.xs,
          },
          shrink: {
            color:        colors.muted,
            backgroundColor: colors.elevated,
            padding: '0 4px',
            fontSize: type.xs,
          },
        },
      },
      // ── Tabs
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 48, borderBottom: `1px solid ${colors.horizon}` },
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
            fontWeight: 500,
            fontSize: type.sm,
            textTransform: 'none',
            minHeight: 48,
            transition: `all ${motion.fast}`,
            '&.Mui-selected': { 
              color: colors.green[700],
              fontWeight: 600,
            },
            '&:hover': {
              color: colors.ink,
            },
          },
        },
      },
      // ── AppBar / Navigation
      MuiAppBar: {
        defaultProps: { elevation: 0, position: 'sticky' },
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.horizon}`,
            color: colors.ink,
            boxShadow: shadow.xs,
          },
        },
      },
      // ── Snackbar
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: colors.ink,
            color: colors.surface,
            borderRadius: radius.md,
            boxShadow: shadow.lg,
          },
        },
      },
      // ── LinearProgress
      MuiLinearProgress: {
        styleOverrides: {
          root: { height: 3, borderRadius: radius.pill, backgroundColor: colors.horizon },
          bar:   { borderRadius: radius.pill, backgroundColor: colors.green[500] },
        },
      },
      // ── Drawer / Modal backdrop
      MuiBackdrop: {
        styleOverrides: { root: { backgroundColor: 'rgba(19,17,15,.4)' } },
      },
      MuiSlide: { transition: { easing: motion.fast } },
    },
  };
}

// ─── Dark mode not supported. One paper. One surface. ───────────────────────

export { type, space, colors, shadow, radius, motion, breakpoints, overrides };

// Default theme — what the rest of the app imports as `theme`
export default createTheme(overrides());
