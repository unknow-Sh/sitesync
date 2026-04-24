import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Grid, Chip, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowForward, Construction, CheckCircle, TrendingUp, Security } from '@mui/icons-material';
import { BRAND } from '../theme/theme';
import ThreeGlobe from '../components/ThreeGlobe';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '9M+', label: 'Active projects in India' },
  { value: '₹15K', label: 'One-time licence (vs ₹8L/yr)' },
  { value: '10', label: 'Modules, one platform' },
  { value: '<1s', label: 'Real-time update latency' },
];

const MODULES = [
  { num: '01', name: 'Live Dashboard', desc: 'Owner sees site activity 24/7 without being present', color: BRAND.amber },
  { num: '02', name: 'Labour Tracker', desc: 'Geo-fenced attendance kills ghost worker fraud', color: BRAND.sky },
  { num: '03', name: 'Material Log', desc: 'OCR delivery slips, real-time stock ledger', color: BRAND.green },
  { num: '04', name: 'Milestone Engine', desc: 'Gantt chart + delay evidence = legal protection', color: BRAND.purple },
  { num: '05', name: 'Budget Tracker', desc: 'Predict overruns weeks before they hit', color: BRAND.orange },
  { num: '06', name: 'AI Risk Engine', desc: 'Risk score from 5 signals. Act before crisis.', color: BRAND.red },
  { num: '07', name: 'Subcontractor Portal', desc: 'Clean audit trail, zero payment disputes', color: BRAND.amber },
  { num: '08', name: 'Document Vault', desc: 'Expiry alerts. Zero compliance surprises.', color: BRAND.sky },
  { num: '09', name: 'Equipment Tracker', desc: 'Save 10-20% on equipment cost per project', color: BRAND.green },
  { num: '10', name: 'Client Reports', desc: 'Professional PDF. Win referrals. Build brand.', color: BRAND.purple },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef();
  const statsRef = useRef();
  const modulesRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'power3.out' });
      gsap.fromTo('.hero-btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });

      // Stats counter animation
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        }
      );

      // Module cards
      gsap.fromTo('.module-card',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: modulesRef.current, start: 'top 75%' },
        }
      );

      // CTA
      gsap.fromTo('.cta-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={heroRef} sx={{ bgcolor: BRAND.navy, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
        display: 'flex', alignItems: 'center', px: { xs: 2, md: 6 }, py: 2,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${alpha(BRAND.border, 0.5)}`,
        bgcolor: alpha(BRAND.navy, 0.85),
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 1.5,
            background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Construction sx={{ color: '#000', fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: BRAND.textPrimary }}>
            SiteSync
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/login')}
          sx={{ mr: 1, borderColor: alpha(BRAND.amber, 0.4), color: BRAND.amber }}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Box>

      {/* Hero Section */}
      <Box sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        pt: { xs: 8, md: 10 },
        px: { xs: 2, md: 6, lg: 10 },
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background gradient */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 60% at 70% 50%, ${alpha(BRAND.amber, 0.06)} 0%, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 20% 80%, ${alpha(BRAND.sky, 0.05)} 0%, transparent 60%)`,
        }} />

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Chip
              className="hero-badge"
              label="Built for India · Middle East · Africa"
              size="small"
              sx={{
                mb: 3, bgcolor: alpha(BRAND.amber, 0.1), color: BRAND.amber,
                border: `1px solid ${alpha(BRAND.amber, 0.3)}`, fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <Typography
              className="hero-title"
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', md: '3.4rem', lg: '4rem' },
                fontWeight: 900,
                lineHeight: 1.08,
                mb: 2.5,
                background: `linear-gradient(135deg, ${BRAND.textPrimary} 0%, ${alpha(BRAND.textPrimary, 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Construction<br />
              <Box component="span" sx={{
                background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Intelligence
              </Box>{' '}Platform
            </Typography>

            <Typography
              className="hero-sub"
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: BRAND.textSecondary,
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 520,
              }}
            >
              Real-time dashboard, labour & material tracking, AI risk engine, 
              client reports — 10 modules in one platform at ₹15,000 (one-time). 
              Procore costs ₹8 lakh/year. SiteSync doesn't.
            </Typography>

            <Box className="hero-btns" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/login')}
                sx={{ px: 3.5, py: 1.5, fontSize: '1rem' }}
              >
                Launch Demo
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ px: 3.5, py: 1.5, fontSize: '1rem', borderColor: alpha(BRAND.textMuted, 0.3), color: BRAND.textSecondary }}
              >
                View Modules
              </Button>
            </Box>

            {/* Trust badges */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              {['Real-time WebSockets', 'GPS Verified', 'OCR Scanning', 'AI Risk Score'].map(b => (
                <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle sx={{ fontSize: 14, color: BRAND.green }} />
                  <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted }}>{b}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Three.js Globe */}
          <Grid item xs={12} lg={6}>
            <Box sx={{
              height: { xs: 320, md: 480 },
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ThreeGlobe />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats */}
      <Box ref={statsRef} sx={{ px: { xs: 2, md: 6, lg: 10 }, py: 8 }}>
        <Grid container spacing={3}>
          {STATS.map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Box
                className="stat-card"
                sx={{
                  p: 3, borderRadius: 3, textAlign: 'center',
                  border: `1px solid ${alpha(BRAND.amber, 0.2)}`,
                  background: alpha(BRAND.amber, 0.04),
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography sx={{
                  fontSize: '2.2rem', fontWeight: 900,
                  background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberLight})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: BRAND.textSecondary, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modules Grid */}
      <Box ref={modulesRef} sx={{ px: { xs: 2, md: 6, lg: 10 }, py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="10 Modules" size="small" sx={{ mb: 2, bgcolor: alpha(BRAND.sky, 0.1), color: BRAND.sky, border: `1px solid ${alpha(BRAND.sky, 0.3)}` }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 2 }}>
            Every problem. One platform.
          </Typography>
          <Typography sx={{ color: BRAND.textSecondary, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
            From daily site attendance to investor-ready reports — built by someone who understands Indian construction.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {MODULES.map((m) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={m.num}>
              <Box
                className="module-card"
                sx={{
                  p: 2.5, borderRadius: 2.5, height: '100%',
                  border: `1px solid ${BRAND.border}`,
                  bgcolor: BRAND.surface,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    border: `1px solid ${alpha(m.color, 0.4)}`,
                    bgcolor: alpha(m.color, 0.04),
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 40px ${alpha(m.color, 0.15)}`,
                  },
                }}
                onClick={() => navigate('/login')}
              >
                <Box sx={{
                  width: 36, height: 36, borderRadius: 1.5, mb: 2,
                  bgcolor: alpha(m.color, 0.12),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: m.color }}>
                    {m.num}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.75, color: BRAND.textPrimary }}>
                  {m.name}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: BRAND.textSecondary, lineHeight: 1.6 }}>
                  {m.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Box ref={ctaRef} sx={{ px: { xs: 2, md: 6, lg: 10 }, py: 10 }}>
        <Box
          className="cta-section"
          sx={{
            borderRadius: 4, p: { xs: 4, md: 8 }, textAlign: 'center',
            background: `radial-gradient(ellipse at center, ${alpha(BRAND.amber, 0.12)} 0%, ${alpha(BRAND.amber, 0.03)} 70%)`,
            border: `1px solid ${alpha(BRAND.amber, 0.2)}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.8rem' }, mb: 2 }}>
            ₹15,000 · All 10 Modules · Lifetime Licence
          </Typography>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '1.05rem', mb: 4, maxWidth: 500, mx: 'auto' }}>
            One-time payment. No subscriptions. No per-user fees. 
            Used by contractors managing ₹50L to ₹5Cr projects.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/login')}
            sx={{ px: 5, py: 1.8, fontSize: '1.05rem' }}
          >
            Start Free Demo
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, borderTop: `1px solid ${BRAND.border}`, textAlign: 'center' }}>
        <Typography sx={{ color: BRAND.textMuted, fontSize: '0.82rem' }}>
          © 2026 SiteSync · Construction Intelligence Platform · India · UAE · Kenya
        </Typography>
      </Box>
    </Box>
  );
}
