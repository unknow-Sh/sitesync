import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Divider,
  LinearProgress, Alert, alpha, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  AccountTree, Warning, CheckCircle, AccessTime, Block,
  Add, Download, Info, TrendingUp, Flag,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMilestoneStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

const MILESTONE_COLORS = {
  'in-progress': { color: BRAND.sky, icon: <AccessTime sx={{ fontSize: 14 }} />, label: 'In Progress' },
  upcoming: { color: BRAND.textMuted, icon: <Flag sx={{ fontSize: 14 }} />, label: 'Upcoming' },
  delayed: { color: BRAND.red, icon: <Warning sx={{ fontSize: 14 }} />, label: 'Delayed' },
  'at-risk': { color: BRAND.orange, icon: <Warning sx={{ fontSize: 14 }} />, label: 'At Risk' },
  completed: { color: BRAND.green, icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Completed' },
};

function GanttBar({ milestone, totalDays, projectStart }) {
  const start = dayjs(milestone.plannedStart);
  const end = dayjs(milestone.plannedEnd);
  const projStart = dayjs(projectStart);
  const offsetDays = start.diff(projStart, 'day');
  const durationDays = end.diff(start, 'day');
  const offsetPct = (offsetDays / totalDays) * 100;
  const widthPct = (durationDays / totalDays) * 100;
  const status = MILESTONE_COLORS[milestone.status] || MILESTONE_COLORS.upcoming;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {status.icon}
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND.textPrimary }}>{milestone.name}</Typography>
          {milestone.delayDays > 0 && (
            <Chip label={`+${milestone.delayDays}d`} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: alpha(BRAND.red, 0.1), color: BRAND.red }} />
          )}
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted, flexShrink: 0 }}>
          {milestone.completion}%
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', height: 28, bgcolor: BRAND.surface2, borderRadius: 1, overflow: 'hidden' }}>
        {/* Planned bar */}
        <Box sx={{
          position: 'absolute',
          left: `${Math.min(offsetPct, 100)}%`,
          width: `${Math.min(widthPct, 100 - Math.min(offsetPct, 100))}%`,
          height: '100%',
          bgcolor: alpha(status.color, 0.15),
          borderRadius: 1,
          border: `1px solid ${alpha(status.color, 0.3)}`,
        }} />
        {/* Progress fill */}
        <Box sx={{
          position: 'absolute',
          left: `${Math.min(offsetPct, 100)}%`,
          width: `${Math.min(widthPct * milestone.completion / 100, 100 - Math.min(offsetPct, 100))}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${status.color}, ${alpha(status.color, 0.7)})`,
          borderRadius: 1,
        }} />
        {/* Today line */}
        <Box sx={{
          position: 'absolute',
          left: `${Math.min((dayjs().diff(projStart, 'day') / totalDays) * 100, 100)}%`,
          height: '100%', width: 2,
          bgcolor: BRAND.amber, opacity: 0.8,
        }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.4 }}>
        <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted }}>{start.format('DD MMM YY')}</Typography>
        <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted }}>{end.format('DD MMM YY')}</Typography>
      </Box>
    </Box>
  );
}

function MilestoneCard({ milestone }) {
  const status = MILESTONE_COLORS[milestone.status] || MILESTONE_COLORS.upcoming;
  return (
    <Box sx={{
      p: 2.5, borderRadius: 2, mb: 2,
      bgcolor: BRAND.surface2, border: `1px solid ${BRAND.border}`,
      borderLeft: `3px solid ${status.color}`,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>{milestone.name}</Typography>
        <Chip
          icon={React.cloneElement(status.icon, { sx: { fontSize: '12px !important' } })}
          label={status.label}
          size="small"
          sx={{
            bgcolor: alpha(status.color, 0.12), color: status.color, fontWeight: 700, fontSize: '0.7rem',
            border: `1px solid ${alpha(status.color, 0.3)}`,
            '& .MuiChip-icon': { color: `${status.color} !important` },
          }}
        />
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>Completion</Typography>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: status.color }}>{milestone.completion}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={milestone.completion}
          sx={{
            height: 5, borderRadius: 999, bgcolor: BRAND.surface,
            '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${status.color}, ${alpha(status.color, 0.6)})` },
          }}
        />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>Planned Start</Typography>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: BRAND.textPrimary }}>
            {dayjs(milestone.plannedStart).format('DD MMM YYYY')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>Planned End</Typography>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: BRAND.textPrimary }}>
            {dayjs(milestone.plannedEnd).format('DD MMM YYYY')}
          </Typography>
        </Grid>
      </Grid>
      {milestone.delayDays > 0 && (
        <Alert severity="warning" sx={{ mt: 1.5, py: 0.75, fontSize: '0.78rem' }}>
          Delayed by {milestone.delayDays} days. Penalty may apply.
        </Alert>
      )}
    </Box>
  );
}

export default function Milestones() {
  const { projectId } = useParams();
  useEffect(() => {
    if (projectId) useMilestoneStore.getState().fetchMilestones(projectId);
  }, [projectId]);

  const { projects, setActiveProject } = useProjectStore();
  const { milestones } = useMilestoneStore();
  const [view, setView] = useState('gantt');

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const projMilestones = milestones[projectId] || [];

  const totalDays = dayjs(project?.endDate).diff(dayjs(project?.startDate), 'day') || 365;
  const totalDelayDays = projMilestones.reduce((s, m) => s + (m.delayDays || 0), 0);
  const avgCompletion = projMilestones.length
    ? Math.round(projMilestones.reduce((s, m) => s + m.completion, 0) / projMilestones.length)
    : 0;

  const penalty = totalDelayDays * 5000;

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 04 · Milestone & Delay Engine</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Delay Report PDF</Button>
          <Button variant="contained" startIcon={<Add />} size="small">Add Milestone</Button>
        </Box>
      </Box>

      {/* Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Milestones', value: projMilestones.length, color: BRAND.amber },
          { label: 'Avg Completion', value: `${avgCompletion}%`, color: BRAND.sky },
          { label: 'Total Delay', value: `${totalDelayDays} days`, color: BRAND.red },
          { label: 'Penalty Exposure', value: `₹${(penalty / 100000).toFixed(1)}L`, color: BRAND.orange },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{
              p: 2.5, textAlign: 'center',
              border: `1px solid ${alpha(s.color, 0.25)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.05)} 100%)`,
            }}>
              <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Penalty Alert */}
      {totalDelayDays > 0 && (
        <Alert severity="error" icon={<Warning />} sx={{ mb: 3 }}>
          <strong>Penalty Clause Active:</strong> Project is {totalDelayDays} days behind schedule.
          At ₹5,000/day penalty rate, exposure = <strong>₹{penalty.toLocaleString()}</strong>.
          Download delay report to document evidence for dispute resolution.
        </Alert>
      )}

      {/* View Toggle */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {['gantt', 'cards'].map(v => (
          <Button key={v} onClick={() => setView(v)} size="small"
            variant={view === v ? 'contained' : 'outlined'}
            sx={{ textTransform: 'capitalize', minWidth: 90 }}
          >
            {v === 'gantt' ? 'Gantt Chart' : 'Card View'}
          </Button>
        ))}
      </Box>

      {view === 'gantt' ? (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700 }}>Planned vs Actual Timeline</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 3, bgcolor: BRAND.amber, borderRadius: 1 }} />
                <Typography sx={{ fontSize: '0.7rem', color: BRAND.textMuted }}>Today</Typography>
              </Box>
            </Box>
          </Box>
          {projMilestones.map(m => (
            <GanttBar key={m.id} milestone={m} totalDays={totalDays} projectStart={project?.startDate} />
          ))}
        </Card>
      ) : (
        <Box>
          {projMilestones.map(m => <MilestoneCard key={m.id} milestone={m} />)}
        </Box>
      )}
    </DashboardLayout>
  );
}
