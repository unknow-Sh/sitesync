import React, { useEffect, useRef } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Alert, Divider, alpha, LinearProgress,
} from '@mui/material';
import { Warning, TrendingUp, TrendingDown, Shield } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { useProjectStore, useLabourStore, useMaterialStore, useBudgetStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Risk engine — reads 5 modules, outputs 0-100
function computeRisk(project, workers, deliveries, consumption, budget) {
  let score = 0;
  const signals = [];

  // Signal 1: Attendance drop
  const presentPct = workers.length > 0
    ? (workers.filter(w => w.status === 'present').length / workers.length) * 100
    : 100;
  if (presentPct < 80) {
    score += 15;
    signals.push({ label: 'Labour attendance below 80%', pts: 15, severity: 'high' });
  } else if (presentPct < 90) {
    score += 7;
    signals.push({ label: 'Labour attendance below 90%', pts: 7, severity: 'medium' });
  }

  // Signal 2: Material consumption alert
  const matLedger = {};
  deliveries.forEach(d => { matLedger[d.material] = (matLedger[d.material] || 0) + d.qty; });
  consumption.forEach(c => {
    if (matLedger[c.material] && c.qty > matLedger[c.material] * 1.2) {
      score += 12;
      signals.push({ label: `Material over-consumption: ${c.material}`, pts: 12, severity: 'high' });
    }
  });

  // Signal 3: Budget overrun
  const items = budget?.items || [];
  const totalSpent = items.reduce((s, i) => s + i.spent, 0);
  const totalBudget = items.reduce((s, i) => s + i.budget, 0);
  const burnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  if (burnRate > 115) {
    score += 18;
    signals.push({ label: `Budget burn rate ${Math.round(burnRate)}% (>115%)`, pts: 18, severity: 'critical' });
  } else if (burnRate > 100) {
    score += 10;
    signals.push({ label: `Budget burn rate ${Math.round(burnRate)}% (>100%)`, pts: 10, severity: 'high' });
  }

  // Signal 4: Milestone delays
  if (project.risk > 60) {
    score += 10;
    signals.push({ label: 'Multiple milestone delays detected', pts: 10, severity: 'high' });
  }

  // Signal 5: No recent updates (simulated)
  if (project.status === 'at-risk') {
    score += 8;
    signals.push({ label: 'No site activity for 6+ hours', pts: 8, severity: 'medium' });
  }

  return { score: Math.min(score, 100), signals };
}

const RISK_TREND = [
  { day: 'D-29', score: 12 }, { day: 'D-24', score: 18 }, { day: 'D-19', score: 25 },
  { day: 'D-14', score: 31 }, { day: 'D-9', score: 38 }, { day: 'D-4', score: 55 },
  { day: 'Today', score: null },
];

const SEVERITY_COLORS = {
  critical: BRAND.red, high: BRAND.orange, medium: BRAND.amber, low: BRAND.green,
};

function RiskMeter({ score }) {
  const meterRef = useRef();
  useEffect(() => {
    gsap.fromTo(meterRef.current,
      { strokeDashoffset: 502 },
      { strokeDashoffset: 502 - (502 * score / 100), duration: 1.5, ease: 'power3.out', delay: 0.2 }
    );
  }, [score]);

  const color = score <= 30 ? BRAND.green : score <= 60 ? BRAND.amber : score <= 80 ? BRAND.orange : BRAND.red;
  const label = score <= 30 ? 'Healthy' : score <= 60 ? 'Watch' : score <= 80 ? 'Act Now' : 'Critical';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      <Box sx={{ position: 'relative', width: 180, height: 180 }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="90" cy="90" r="80" fill="none" stroke={BRAND.surface2} strokeWidth="14" />
          {/* Progress */}
          <circle
            ref={meterRef}
            cx="90" cy="90" r="80" fill="none"
            stroke={color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray="502"
            strokeDashoffset="502"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <Box sx={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ fontSize: '2.8rem', fontWeight: 900, color, lineHeight: 1 }}>{score}</Typography>
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, fontWeight: 700, letterSpacing: '0.1em' }}>RISK SCORE</Typography>
          <Chip label={label} size="small" sx={{
            mt: 0.5, bgcolor: alpha(color, 0.15), color, fontWeight: 800,
            fontSize: '0.65rem', border: `1px solid ${alpha(color, 0.4)}`,
          }} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted, mt: 1 }}>
        0–30 Healthy · 31–60 Watch · 61–80 Act Now · 81–100 Critical
      </Typography>
    </Box>
  );
}

export default function RiskEngine() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { workers } = useLabourStore();
  const { deliveries, consumption } = useMaterialStore();
  const { budgets } = useBudgetStore();

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const projWorkers = workers[projectId] || [];
  const projDeliveries = deliveries[projectId] || [];
  const projConsumption = consumption[projectId] || [];
  const projBudget = budgets[projectId];

  const { score, signals } = computeRisk(project, projWorkers, projDeliveries, projConsumption, projBudget);

  const trendData = [...RISK_TREND.slice(0, -1), { day: 'Today', score }];

  const alertSeverity = score <= 30 ? 'success' : score <= 60 ? 'warning' : 'error';

  const recommendations = score <= 30
    ? ['Continue current pace', 'Schedule risk review next week']
    : score <= 60
    ? ['Schedule site visit this week', 'Review labour attendance patterns', 'Check material consumption logs']
    : ['Immediate site visit required', 'Contractor review meeting today', 'Audit material deliveries', 'Review payment schedule'];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline">Module 06 · AI Risk Prediction Engine</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.85rem', mt: 0.5 }}>
          Multi-signal detection across 5 modules · Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>

      {/* NLP Alert */}
      <Alert
        severity={alertSeverity}
        icon={score > 60 ? <Warning /> : <Shield />}
        sx={{ mb: 3, '& .MuiAlert-message': { width: '100%' } }}
      >
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
          {project?.name} · Risk Score: {score}/100 · {score <= 30 ? 'Healthy' : score <= 60 ? 'Needs Attention' : 'Immediate Action Required'}
        </Typography>
        <Typography sx={{ fontSize: '0.85rem' }}>
          {signals.length === 0
            ? 'All signals normal. Project is tracking well across all 5 modules.'
            : `${signals.length} risk signal(s) detected: ${signals.map(s => s.label).join(' · ')}.`
          }
          {score > 40 ? ' Recommend site visit and contractor review this week.' : ''}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Risk Meter */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Live Risk Score</Typography>
            <RiskMeter score={score} />
          </Card>
        </Grid>

        {/* Signals */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Active Risk Signals</Typography>
            {signals.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Shield sx={{ fontSize: 48, color: BRAND.green, mb: 1 }} />
                <Typography sx={{ color: BRAND.green, fontWeight: 700 }}>All signals clear</Typography>
                <Typography sx={{ color: BRAND.textMuted, fontSize: '0.82rem', mt: 0.5 }}>
                  No risk factors detected across 5 modules
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {signals.map((sig, i) => {
                  const col = SEVERITY_COLORS[sig.severity] || BRAND.amber;
                  return (
                    <Box key={i} sx={{
                      p: 2, borderRadius: 2,
                      bgcolor: alpha(col, 0.07),
                      border: `1px solid ${alpha(col, 0.25)}`,
                      borderLeft: `3px solid ${col}`,
                      display: 'flex', alignItems: 'center', gap: 2,
                    }}>
                      <Warning sx={{ color: col, fontSize: 20, flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: BRAND.textPrimary }}>{sig.label}</Typography>
                        <Chip label={sig.severity.toUpperCase()} size="small" sx={{
                          mt: 0.5, height: 18, fontSize: '0.6rem', fontWeight: 800,
                          bgcolor: alpha(col, 0.12), color: col,
                        }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, color: col, fontSize: '1.1rem', flexShrink: 0 }}>
                        +{sig.pts}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Recommended Actions */}
            <Divider sx={{ my: 2.5 }} />
            <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.88rem' }}>Recommended Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommendations.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: BRAND.amber, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: BRAND.textSecondary }}>{r}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* 30-Day Risk Trend */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>30-Day Risk Trend</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <XAxis dataKey="day" tick={{ fill: BRAND.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: BRAND.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ backgroundColor: BRAND.surface2, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.textPrimary }} />
                <ReferenceLine y={30} stroke={BRAND.green} strokeDasharray="4 4" opacity={0.5} />
                <ReferenceLine y={60} stroke={BRAND.amber} strokeDasharray="4 4" opacity={0.5} />
                <ReferenceLine y={80} stroke={BRAND.red} strokeDasharray="4 4" opacity={0.5} />
                <Line
                  type="monotone" dataKey="score" stroke={BRAND.amber}
                  strokeWidth={2.5} dot={{ fill: BRAND.amber, r: 4 }}
                  activeDot={{ r: 6, fill: BRAND.amber }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
