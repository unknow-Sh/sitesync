import { createTheme, alpha } from '@mui/material/styles';

const BRAND = {
  amber: '#F59E0B',
  amberDark: '#D97706',
  amberLight: '#FCD34D',
  sky: '#0EA5E9',
  skyDark: '#0284C7',
  green: '#10B981',
  red: '#EF4444',
  orange: '#F97316',
  purple: '#8B5CF6',
  navy: '#0A0E1A',
  navyMid: '#0D1220',
  surface: '#111827',
  surface2: '#1F2937',
  surface3: '#374151',
  border: '#1F2937',
  borderLight: '#374151',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
};

export { BRAND };

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: BRAND.amber,
      dark: BRAND.amberDark,
      light: BRAND.amberLight,
      contrastText: '#0A0E1A',
    },
    secondary: {
      main: BRAND.sky,
      dark: BRAND.skyDark,
      contrastText: '#fff',
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
    fontFamily: '"Inter", "DM Sans", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: BRAND.textSecondary },
    subtitle2: { fontWeight: 500, color: BRAND.textMuted },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6, color: BRAND.textSecondary },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { color: BRAND.textMuted },
    overline: { fontWeight: 700, letterSpacing: '0.1em', color: BRAND.amber },
  },

  shape: { borderRadius: 12 },

  shadows: [
    'none',
    `0 1px 3px ${alpha('#000', 0.4)}`,
    `0 4px 12px ${alpha('#000', 0.4)}`,
    `0 8px 24px ${alpha('#000', 0.5)}`,
    `0 12px 40px ${alpha('#000', 0.6)}`,
    `0 4px 20px ${alpha(BRAND.amber, 0.15)}`,
    `0 8px 40px ${alpha(BRAND.amber, 0.2)}`,
    `0 4px 20px ${alpha(BRAND.sky, 0.15)}`,
    `0 8px 40px ${alpha(BRAND.sky, 0.2)}`,
    `0 4px 20px ${alpha(BRAND.green, 0.15)}`,
    `0 4px 20px ${alpha(BRAND.red, 0.2)}`,
    ...Array(14).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', margin: 0, padding: 0 },
        html: { scrollBehavior: 'smooth' },
        body: {
          backgroundColor: BRAND.navy,
          color: BRAND.textPrimary,
          fontFamily: '"Inter", sans-serif',
          overflowX: 'hidden',
        },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: BRAND.surface },
        '::-webkit-scrollbar-thumb': {
          background: BRAND.surface3,
          borderRadius: '999px',
          '&:hover': { background: BRAND.amber },
        },
        '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap')",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND.amber} 0%, ${BRAND.amberDark} 100%)`,
          color: '#0A0E1A',
          boxShadow: `0 4px 16px ${alpha(BRAND.amber, 0.3)}`,
          '&:hover': {
            boxShadow: `0 6px 24px ${alpha(BRAND.amber, 0.5)}`,
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha(BRAND.amber, 0.5),
          '&:hover': {
            borderColor: BRAND.amber,
            backgroundColor: alpha(BRAND.amber, 0.08),
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
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: `0 8px 32px ${alpha('#000', 0.4)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
            backgroundColor: BRAND.surface2,
            '& fieldset': { borderColor: BRAND.border },
            '&:hover fieldset': { borderColor: alpha(BRAND.amber, 0.5) },
            '&.Mui-focused fieldset': { borderColor: BRAND.amber },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 10,
          backgroundColor: BRAND.surface2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(BRAND.surface, 0.85),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${BRAND.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: BRAND.navyMid,
          border: 'none',
          borderRight: `1px solid ${BRAND.border}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: BRAND.surface2,
          color: BRAND.textSecondary,
          fontWeight: 600,
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: BRAND.surface2,
          border: `1px solid ${BRAND.border}`,
          color: BRAND.textPrimary,
          fontSize: '0.75rem',
          borderRadius: 8,
        },
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
          background: `linear-gradient(90deg, ${BRAND.amber}, ${BRAND.amberDark})`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid',
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
