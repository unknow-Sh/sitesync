import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Grid, Chip, alpha, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowForward, CheckCircle, Speed, Lock, DataUsage,
  Engineering, TrendingDown, People, RequestQuote
} from '@mui/icons-material';
import { BRAND } from '../theme/theme';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '1,400+', label: 'Active Contractors' },
  { value: '₹5Cr+', label: 'Projects Managed' },
  { value: '<1s', label: 'WebSocket Latency' },
  { value: '10', label: 'Integrated Modules' },
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
  const vsRef = useRef();
  const deepDiveRef = useRef();
  const gridRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
      gsap.fromTo('.hero-btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });

      // Stats
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      );

      // VS Section
      gsap.fromTo('.vs-box',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, scrollTrigger: { trigger: vsRef.current, start: 'top 80%' } }
      );

      // Deep Dive Alternating
      gsap.utils.toArray('.deep-dive-row').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: row, start: 'top 80%' } }
        );
      });

      // Grid
      gsap.fromTo('.grid-card',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, scrollTrigger: { trigger: gridRef.current, start: 'top 75%' } }
      );

      // CTA
      gsap.fromTo('.cta-content',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <Box sx={{ bgcolor: BRAND.navy, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ─── Navbar ─── */}
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
        display: 'flex', alignItems: 'center', px: { xs: 3, md: 8 }, py: 2,
        bgcolor: '#041734',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/logo.png" alt="Sitesco Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: BRAND.textPrimary }}>
            Sitesco
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button variant="text" sx={{ color: BRAND.textSecondary, mr: 2, display: { xs: 'none', md: 'block' } }}>Features</Button>
        <Button variant="text" sx={{ color: BRAND.textSecondary, mr: 3, display: { xs: 'none', md: 'block' } }}>Pricing</Button>
        <Button variant="outlined" size="small" onClick={() => navigate('/login')} sx={{ mr: 2, color: BRAND.amber }}>
          Log In
        </Button>
        <Button variant="contained" size="small" onClick={() => navigate('/login')} sx={{ px: 3 }}>
          Get Started
        </Button>
      </Box>

      {/* ─── Section 1: The Hero ─── */}
      <Box ref={heroRef} sx={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        px: { xs: 3, md: 8 }, pt: 10,
        backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${alpha('#0A192F', 0.95)} 0%, ${alpha('#0A192F', 0.6)} 100%)` }} />

        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 800 }}>
          <Chip className="hero-badge" label="Built for Scale · Premium Construction OS"
            sx={{ bgcolor: alpha(BRAND.sky, 0.15), color: BRAND.sky, fontWeight: 700, mb: 4, border: `1px solid ${alpha(BRAND.sky, 0.4)}` }} />

          <Typography className="hero-title" variant="h1" sx={{
            color: '#ffffff', fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 900, lineHeight: 1.1, mb: 3
          }}>
            Manage multi-crore sites without leaving your desk.
          </Typography>

          <Typography className="hero-sub" sx={{ color: alpha('#fff', 0.7), fontSize: '1.2rem', lineHeight: 1.6, mb: 5, maxWidth: 600 }}>
            Sitesco is the luxury 10-module construction intelligence suite.
            Stop bleeding margin to ghost workers, untracked material, and delayed milestones.
          </Typography>

          <Box className="hero-btn" sx={{ display: 'flex', gap: 3 }}>
            <Button variant="contained" size="large" onClick={() => navigate('/login')} endIcon={<ArrowForward />}
              sx={{ px: 4, py: 2, fontSize: '1.1rem', bgcolor: BRAND.sky, '&:hover': { bgcolor: BRAND.skyDark } }}>
              Start Building Let's Go
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ─── Section 2: Social Proof / Metrics ─── */}
      <Box ref={statsRef} sx={{ bgcolor: BRAND.surface, py: 8, borderBottom: `1px solid ${BRAND.border}` }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            {STATS.map((s, i) => (
              <Grid item xs={6} md={3} key={i} className="stat-item">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: BRAND.amber }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: BRAND.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Section 3: Problem vs Solution ─── */}
      <Box ref={vsRef} sx={{ py: 12, bgcolor: BRAND.surface2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 2 }}>Why contractors switch to Sitesco</Typography>
            <Typography sx={{ color: BRAND.textSecondary, fontSize: '1.1rem' }}>You don't need an ₹8L/year enterprise tool designed for America.</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box className="vs-box" sx={{ p: 5, bgcolor: BRAND.surface, borderRadius: 4, border: `1px solid ${BRAND.border}`, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, bgcolor: BRAND.textMuted }} />
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, mb: 1, color: BRAND.textSecondary }}>The Old Way (Procore)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography sx={{ fontSize: '3rem', fontWeight: 900, color: BRAND.textPrimary, lineHeight: 1 }}>₹8 Lakh</Typography>
                  <Typography sx={{ color: BRAND.textSecondary, fontWeight: 600, lineHeight: 1 }}>/year<br />minimum</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['Per-user licensing fees', 'Extremely complex for on-site staff', 'No local Indian compliance standards', 'No real-time WebSocket dashboard'].map(t => (
                    <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Speed sx={{ color: BRAND.textMuted }} />
                      <Typography sx={{ color: BRAND.textSecondary, fontWeight: 500 }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="vs-box" sx={{ p: 5, bgcolor: BRAND.surface, borderRadius: 4, border: `2px solid ${BRAND.sky}`, height: '100%', position: 'relative', overflow: 'hidden', boxShadow: `0 20px 40px ${alpha(BRAND.sky, 0.1)}` }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, bgcolor: BRAND.sky }} />
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, mb: 1, color: BRAND.amber }}>The Sitesco Way</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography sx={{ fontSize: '3rem', fontWeight: 900, color: BRAND.sky, lineHeight: 1 }}>₹15,000</Typography>
                  <Typography sx={{ color: BRAND.textPrimary, fontWeight: 700, lineHeight: 1 }}>/One-Time<br />Lifetime Setup</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['Unlimited users & unlimited projects', '10 exact modules Indian contractors need', 'Geo-fenced attendance & OCR material logging', 'Millisecond latency real-time tracking'].map(t => (
                    <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircle sx={{ color: BRAND.sky }} />
                      <Typography sx={{ color: BRAND.textPrimary, fontWeight: 600 }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── Section 4: Deep Dive Features ─── */}
      <Box ref={deepDiveRef} sx={{ py: 12, bgcolor: BRAND.surface }}>
        <Container maxWidth="lg">

          {/* Feature 1 */}
          <Grid container spacing={8} alignItems="center" className="deep-dive-row" sx={{ mb: 12 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: 400, borderRadius: 4, bgcolor: BRAND.surface2, border: `1px solid ${BRAND.border}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative',
                boxShadow: `0 24px 48px ${alpha('#000', 0.1)}`
              }}>
                <img src="/dashboard-mockup.png" alt="Dashboard Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: alpha(BRAND.amber, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 32, color: BRAND.amber }} />
              </Box>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 2 }}>Live Command Dashboard</Typography>
              <Typography sx={{ fontSize: '1.1rem', color: BRAND.textSecondary, lineHeight: 1.7, mb: 3 }}>
                Know exactly what is happening on site without calling your managers. Watch labour counts, live budget burning, and material stocks update in milliseconds via WebSockets.
              </Typography>
              <Button color="primary" sx={{ fontWeight: 700 }} endIcon={<ArrowForward />}>Explore Dashboard</Button>
            </Grid>
          </Grid>

          {/* Feature 2 */}
          <Grid container spacing={8} alignItems="center" className="deep-dive-row" sx={{ mb: 12, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ width: 60, height: 60, borderRadius: 3, bgcolor: alpha(BRAND.sky, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <People sx={{ fontSize: 32, color: BRAND.sky }} />
              </Box>
              <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 2 }}>Geo-Fenced Labour Tracking</Typography>
              <Typography sx={{ fontSize: '1.1rem', color: BRAND.textSecondary, lineHeight: 1.7, mb: 3 }}>
                Eliminate ghost workers and attendance fraud instantly. The system enforces strict GPS constraints before a worker is marked present, automatically linking it to your daily expense ledger.
              </Typography>
              <Button color="secondary" sx={{ fontWeight: 700 }} endIcon={<ArrowForward />}>Learn About Labour</Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: 400, borderRadius: 4, bgcolor: BRAND.surface2, border: `1px solid ${BRAND.border}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative',
                boxShadow: `0 24px 48px ${alpha('#000', 0.1)}`
              }}>
                <img src="/blueprint-bg.png" alt="Map Geo-Fence Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: BRAND.surface, p: 2, borderRadius: 2, boxShadow: `0 4px 12px ${alpha(BRAND.sky, 0.3)}` }}>
                   <CheckCircle sx={{ color: BRAND.green, fontSize: 32, display: 'block', mx: 'auto', mb: 1 }} />
                   <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>Worker inside Geo-Fence</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

        </Container>
      </Box>

      {/* ─── Section 5: The 10 Modules App Grid ─── */}
      <Box ref={gridRef} sx={{ py: 12, bgcolor: BRAND.surface2, borderTop: `1px solid ${BRAND.border}` }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 2 }}>Every problem. One platform.</Typography>
            <Typography sx={{ color: BRAND.textSecondary, fontSize: '1.1rem' }}>Built exclusively for high-scale construction management.</Typography>
          </Box>
          <Grid container spacing={3}>
            {MODULES.map(m => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={m.num}>
                <Box className="grid-card" sx={{
                  p: 4, bgcolor: BRAND.surface, borderRadius: 3, border: `1px solid ${BRAND.border}`, height: '100%',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px rgba(0,0,0,0.06)`, borderColor: m.color }
                }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: alpha(m.color, 0.2), mb: 1 }}>{m.num}</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: BRAND.textPrimary, mb: 1 }}>{m.name}</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: BRAND.textSecondary, lineHeight: 1.6 }}>{m.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Section 6: Final CTA ─── */}
      <Box ref={ctaRef} sx={{ py: 12, px: 3, bgcolor: BRAND.navy, display: 'flex', justifyContent: 'center' }}>
        <Box className="cta-content" sx={{
          maxWidth: 900, width: '100%', bgcolor: BRAND.amber, borderRadius: 4, p: { xs: 4, md: 8 },
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: `0 24px 48px ${alpha(BRAND.amber, 0.4)}`
        }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, color: '#ffffff', mb: 3 }}>
            Ready to control your sites?
          </Typography>
          <Typography sx={{ fontSize: '1.2rem', color: alpha('#fff', 0.8), mb: 6, maxWidth: 600, mx: 'auto' }}>
            Book a demo today. Setup takes 10 minutes. Pricing is a flat ₹15,000 for life. Start making more margin on your projects immediately.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/login')}
            sx={{ px: 6, py: 2, fontSize: '1.2rem', bgcolor: BRAND.sky, color: '#fff', '&:hover': { bgcolor: BRAND.skyDark } }}>
            Get Started Now
          </Button>
        </Box>
      </Box>

      {/* ─── Footer ─── */}
      <Box sx={{ bgcolor: BRAND.surface, py: 6, borderTop: `1px solid ${BRAND.border}` }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img src="/logo.png" alt="Sitesco Logo" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'grayscale(100%)' }} />
            <Typography sx={{ fontWeight: 800, color: BRAND.textPrimary }}>Sitesco</Typography>
          </Box>
          <Typography sx={{ color: BRAND.textMuted, fontSize: '0.85rem' }}>
            © 2026 Sitesco Software Systems. All rights reserved.
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}
