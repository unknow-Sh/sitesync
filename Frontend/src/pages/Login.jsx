import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Chip, CircularProgress, alpha,
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff,
  Construction, ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../theme/theme';

const DEMO_ACCOUNTS = [
  { email: 'owner@sitesync.in', label: 'Owner', color: BRAND.amber },
  { email: 'contractor@sitesync.in', label: 'Contractor', color: BRAND.sky },
  { email: 'supervisor@sitesync.in', label: 'Supervisor', color: BRAND.green },
  { email: 'investor@sitesync.in', label: 'Investor', color: BRAND.purple },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@sitesync.in');
  const [password, setPassword] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acc) => {
    setEmail(acc.email);
    setPassword('demo123');
    setError('');
  };

  return (
    <Box sx={{
      minHeight: '100vh', bgcolor: BRAND.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      px: 2, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background effects */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${alpha(BRAND.amber, 0.07)} 0%, transparent 70%)`,
      }} />
      <Box sx={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(BRAND.sky, 0.06)} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 2.5, mx: 'auto', mb: 2,
            background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 32px ${alpha(BRAND.amber, 0.35)}`,
          }}>
            <Construction sx={{ color: '#000', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Welcome to SiteSync</Typography>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.9rem' }}>
            Construction Intelligence Platform
          </Typography>
        </Box>

        {/* Demo role chips */}
        <Box sx={{
          p: 2.5, borderRadius: 2, mb: 3,
          bgcolor: alpha(BRAND.surface2, 0.5),
          border: `1px solid ${BRAND.border}`,
        }}>
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
            Quick Demo Login — Password: demo123
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <Chip
                key={acc.email}
                label={acc.label}
                size="small"
                onClick={() => quickLogin(acc)}
                sx={{
                  cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem',
                  bgcolor: email === acc.email ? alpha(acc.color, 0.2) : alpha(acc.color, 0.06),
                  color: acc.color,
                  border: `1px solid ${email === acc.email ? alpha(acc.color, 0.5) : alpha(acc.color, 0.2)}`,
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: alpha(acc.color, 0.15) },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3.5, borderRadius: 3,
            bgcolor: BRAND.surface,
            border: `1px solid ${BRAND.border}`,
            boxShadow: `0 24px 64px ${alpha('#000', 0.4)}`,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: BRAND.textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: BRAND.textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass
                        ? <VisibilityOff sx={{ color: BRAND.textMuted, fontSize: 20 }} />
                        : <Visibility sx={{ color: BRAND.textMuted, fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
              sx={{ py: 1.5, mt: 0.5, fontSize: '0.95rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In to SiteSync'}
            </Button>
          </Box>
        </Box>

        <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.78rem', color: BRAND.textMuted }}>
          SiteSync · Construction Intelligence · India · UAE · Africa
        </Typography>
      </Box>
    </Box>
  );
}
