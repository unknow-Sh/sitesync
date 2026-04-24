import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Divider, Alert,
  Switch, FormControlLabel, TextField, Select, MenuItem, FormControl, InputLabel,
  alpha, LinearProgress, Avatar,
} from '@mui/material';
import {
  Assessment, Download, Share, CheckCircle, Construction,
  People, AccountBalance, Warning, PhotoCamera, ContentCopy,
  Visibility, Send, FiberManualRecord,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useProjectStore, useUpdatesStore, useBudgetStore, useMilestoneStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

function ReportPreview({ project, milestones, budget }) {
  const items = budget?.items || [];
  const totalBudget = items.reduce((s, i) => s + i.budget, 0);
  const totalSpent = items.reduce((s, i) => s + i.spent, 0);
  const burnPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const budgetColor = burnPct <= 100 ? BRAND.green : burnPct <= 115 ? BRAND.amber : BRAND.red;
  const budgetLabel = burnPct <= 100 ? 'On Budget' : burnPct <= 115 ? 'Watch' : 'Over Budget';

  return (
    <Box sx={{
      p: 4, borderRadius: 3,
      background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${BRAND.navyMid} 100%)`,
      border: `1px solid ${BRAND.border}`,
      boxShadow: `0 8px 48px ${alpha('#000', 0.5)}`,
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Report Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        pb: 3, borderBottom: `2px solid ${BRAND.amber}`, mb: 3,
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 1.5,
              background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Construction sx={{ color: '#000', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: BRAND.amber, fontSize: '1rem' }}>SiteSync</Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: BRAND.textPrimary }}>{project?.name}</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: BRAND.textSecondary }}>Progress Report · Week of {dayjs().format('DD MMM YYYY')}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Chip label="Confidential" size="small" sx={{ bgcolor: alpha(BRAND.amber, 0.1), color: BRAND.amber, fontWeight: 700, mb: 1 }} />
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>Prepared for: Client</Typography>
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>Report #{dayjs().format('YYYYWW')}</Typography>
        </Box>
      </Box>

      {/* Completion Highlights */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(BRAND.amber, 0.06), borderRadius: 2 }}>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: BRAND.amber }}>{project?.completion}%</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>OVERALL COMPLETION</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(budgetColor, 0.06), borderRadius: 2 }}>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: budgetColor }}>{budgetLabel}</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>BUDGET STATUS</Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(BRAND.sky, 0.06), borderRadius: 2 }}>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: BRAND.sky }}>{project?.workers}</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>WORKERS ON SITE</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Milestone Table */}
      <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.88rem', color: BRAND.textPrimary }}>Milestone Status</Typography>
      <Box sx={{ mb: 3 }}>
        {(milestones || []).slice(0, 4).map((m, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, p: 1.25, bgcolor: BRAND.surface2, borderRadius: 1.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.completion === 100 ? BRAND.green : m.status === 'delayed' ? BRAND.red : BRAND.amber, flexShrink: 0 }} />
            <Typography sx={{ flex: 1, fontSize: '0.82rem', color: BRAND.textPrimary }}>{m.name}</Typography>
            <LinearProgress variant="determinate" value={m.completion}
              sx={{ width: 80, height: 4, borderRadius: 999, bgcolor: BRAND.surface, '& .MuiLinearProgress-bar': { bgcolor: m.completion === 100 ? BRAND.green : BRAND.amber } }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: BRAND.textSecondary, minWidth: 30, textAlign: 'right' }}>{m.completion}%</Typography>
          </Box>
        ))}
      </Box>

      {/* Next Steps */}
      <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.88rem', color: BRAND.textPrimary }}>Next 2 Weeks Plan</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 3 }}>
        {['Complete shuttering for 5th floor slab', 'Pour RCC columns Grid A1–F8', 'Start brickwork on floors 1–2', 'Material: Order 400 bags cement for next pour'].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: BRAND.amber, mt: 0.9, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.82rem', color: BRAND.textSecondary }}>{item}</Typography>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ pt: 2, borderTop: `1px solid ${BRAND.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>Generated by SiteSync · {dayjs().format('DD MMM YYYY · HH:mm')}</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>SiteSync.in</Typography>
      </Box>
    </Box>
  );
}

export default function ClientReport() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { milestones } = useMilestoneStore();
  const { budgets } = useBudgetStore();
  const [showBudget, setShowBudget] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const projMilestones = milestones[projectId] || [];
  const projBudget = budgets[projectId];

  const shareLink = `https://sitesync.in/share/${project?.id || 'demo'}-${Date.now().toString(36)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 10 · Client Presentation Mode + Site Report</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Download PDF</Button>
          <Button variant="contained" startIcon={<Send />} size="small">Send to Client</Button>
        </Box>
      </Box>

      {/* Auto-send notice */}
      <Alert severity="info" icon={<Send />} sx={{ mb: 3 }}>
        <strong>Auto-send active</strong> — Client receives this report every Friday at 5:00 PM via WhatsApp.
        Last sent: {dayjs().subtract(5, 'day').format('DD MMM YYYY')}
      </Alert>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Report Settings */}
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Report Settings</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch checked={true} color="primary" size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>Show milestone status</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={true} color="primary" size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>Show photo gallery</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={showBudget} onChange={e => setShowBudget(e.target.checked)} color="primary" size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>Show budget details</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={true} color="primary" size="small" />}
                  label={<Typography sx={{ fontSize: '0.85rem' }}>Show next 2-week plan</Typography>}
                />
              </Box>
            </Card>

            {/* Live Share Link */}
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>Live Share Link</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: BRAND.textSecondary, mb: 2 }}>
                Client opens this URL on mobile — sees a live, read-only dashboard with real-time site updates.
              </Typography>
              <Box sx={{
                p: 1.5, borderRadius: 1.5, bgcolor: BRAND.surface2, mb: 1.5,
                border: `1px solid ${BRAND.border}`, wordBreak: 'break-all',
              }}>
                <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, fontFamily: 'monospace' }}>
                  {shareLink.slice(0, 50)}...
                </Typography>
              </Box>
              <Button
                fullWidth variant="outlined" size="small"
                startIcon={linkCopied ? <CheckCircle /> : <ContentCopy />}
                onClick={copyLink}
                sx={{
                  borderColor: linkCopied ? BRAND.green : alpha(BRAND.amber, 0.4),
                  color: linkCopied ? BRAND.green : BRAND.amber,
                }}
              >
                {linkCopied ? 'Link Copied!' : 'Copy Share Link'}
              </Button>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Link Expiry', value: '30 days' },
                  { label: 'Client can comment', value: 'Yes' },
                  { label: 'Budget visible', value: showBudget ? 'Yes' : 'No' },
                ].map(item => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: BRAND.textPrimary }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Milestone Celebrations */}
            <Card sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>🎉 Milestone Celebrations</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: BRAND.textSecondary }}>
                When a major milestone is marked complete, SiteSync auto-sends a congratulatory update to client with a site photo.
              </Typography>
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: alpha(BRAND.green, 0.06), border: `1px solid ${alpha(BRAND.green, 0.2)}` }}>
                <Typography sx={{ fontSize: '0.78rem', color: BRAND.green, fontWeight: 700 }}>
                  🎉 Foundation completed — Sent to client 12 days ago
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Report Preview */}
        <Grid item xs={12} lg={8}>
          <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.textSecondary, fontSize: '0.85rem' }}>
            REPORT PREVIEW
          </Typography>
          <ReportPreview project={project} milestones={projMilestones} budget={projBudget} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
