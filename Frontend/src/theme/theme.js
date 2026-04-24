import { createTheme, alpha } from '@mui/material/styles';

const BRAND = {
  // Primary: Premium Deep Corporate Navy variants
  amber: '#041734', // User requested exact deep navy primary
  amberDark: '#020C1F',
  amberLight: '#0A2D69',
  
  // Secondary: Sky/Teal
  sky: '#0284C7',
  skyDark: '#0369A1',
  
  // States
  green: '#10B981',
  red: '#EF4444',
  orange: '#F97316',
  purple: '#6366F1',
  
  // Backgrounds: Premium White & Off-White
  navy: '#FFFFFF', // Pure White App Background
  navyMid: '#041734', // Solid dark sidebar requested by user
  surface: '#FFFFFF', // White cards
  surface2: '#F8FAFC', // Slate 50 for slight contrast headers
  surface3: '#F1F5F9', // Slate 100 for hover states
  
  // Borders
  border: '#E2E8F0', // Slate 200
  borderLight: '#CBD5E1', // Slate 300
  
  // Typography (Inverted for Light Mode)
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#64748B', // Slate 500
};

export { BRAND };

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BRAND.amber,
      dark: BRAND.amberDark,
      light: BRAND.amberLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: BRAND.sky,
      dark: BRAND.skyDark,
      contrastText: '#ffffff',
    },
    success: { main: BRAND.green },
    error: { main: BRAND.red },
    warning: { main: BRAND.orange },
    info: { main: BRAND.sky },
    background: {
      default: BRAND.navy,
      paper: BRAND.surface,
    },
    text: {
      primary: BRAND.textPrimary,
      secondary: BRAND.textSecondary,
      disabled: BRAND.textMuted,
    },
    divider: BRAND.border,
  },

  typography: {
    fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 500, color: BRAND.textSecondary },
    subtitle2: { fontWeight: 500, color: BRAND.textMuted },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6, color: BRAND.textSecondary },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em' },
    caption: { color: BRAND.textMuted },
    overline: { fontWeight: 700, letterSpacing: '0.15em', color: BRAND.amberLight },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', margin: 0, padding: 0 },
        html: { scrollBehavior: 'smooth' },
        body: {
          backgroundColor: BRAND.navy,
          color: BRAND.textPrimary,
          fontFamily: '"Outfit", sans-serif',
          overflowX: 'hidden',
        },
        '::-webkit-scrollbar': { width: '8px', height: '8px' },
        '::-webkit-scrollbar-track': { background: BRAND.surface2 },
        '::-webkit-scrollbar-thumb': {
          background: BRAND.borderLight,
          borderRadius: '999px',
          '&:hover': { background: BRAND.textMuted },
        },
        '@import': "url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap')",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND.amberLight} 0%, ${BRAND.amber} 100%)`,
          color: '#ffffff',
          boxShadow: `0 4px 12px ${alpha(BRAND.amber, 0.2)}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(BRAND.amber, 0.3)}`,
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha(BRAND.amberLight, 0.3),
          color: BRAND.amber,
          '&:hover': {
            borderColor: BRAND.amber,
            backgroundColor: alpha(BRAND.amberLight, 0.05),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND.surface,
          border: `1px solid ${BRAND.border}`,
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 32px rgba(0,0,0,0.08)`,
            borderColor: BRAND.borderLight,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND.surface,
          border: `1px solid ${BRAND.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: BRAND.surface,
            '& fieldset': { borderColor: BRAND.border },
            '&:hover fieldset': { borderColor: BRAND.borderLight },
            '&.Mui-focused fieldset': { borderColor: BRAND.amber, borderWidth: 2 },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 10,
          backgroundColor: BRAND.surface,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(BRAND.surface, 0.9),
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BRAND.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: BRAND.navyMid, // Deep Navy Sidebar
          color: '#ffffff', // White text on sidebar
          border: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: BRAND.surface2,
          color: BRAND.textSecondary,
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
        root: {
          borderColor: BRAND.border,
          color: BRAND.textPrimary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BRAND.border },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 6,
          backgroundColor: BRAND.surface2,
        },
        bar: {
          borderRadius: 999,
          background: `linear-gradient(90deg, ${BRAND.sky}, ${BRAND.amberLight})`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          '&.Mui-selected': { color: BRAND.amber },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: BRAND.amber,
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
});

export default theme;
