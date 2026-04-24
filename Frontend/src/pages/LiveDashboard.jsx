import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Avatar, Button, Divider,
  TextField, Select, MenuItem, FormControl, InputLabel, Alert,
  List, ListItem, IconButton, Badge, alpha, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip,
} from '@mui/material';
import {
  Circle, Add, PhotoCamera, GpsFixed, GpsNotFixed,
  CheckCircle, Block, AccessTime, Refresh, Send,
  TrendingUp, People, Assignment, Timer, FiberManualRecord,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useProjectStore, useUpdatesStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

dayjs.extend(relativeTime);

const STATUS_CONFIG = {
  done: { color: BRAND.green, icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Done' },
  'in-progress': { color: BRAND.sky, icon: <AccessTime sx={{ fontSize: 14 }} />, label: 'In Progress' },
  blocked: { color: BRAND.red, icon: <Block sx={{ fontSize: 14 }} />, label: 'Blocked' },
};

const PULSE_LABELS = {
  green: { label: 'Site Active', color: BRAND.green, desc: 'Update in last 2 hours' },
  amber: { label: 'Slow Day', color: BRAND.amber, desc: 'Last update 2-6 hours ago' },
  red: { label: 'No Activity', color: BRAND.red, desc: 'No update for 6+ hours' },
};

function SitePulse({ pulse = 'green' }) {
  const cfg = PULSE_LABELS[pulse];
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2,
      bgcolor: alpha(cfg.color, 0.08), border: `1px solid ${alpha(cfg.color, 0.25)}`,
    }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Circle sx={{ color: cfg.color, fontSize: 18 }} />
        <Box sx={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          border: `2px solid ${cfg.color}`, opacity: 0.3,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.3 },
            '50%': { transform: 'scale(1.6)', opacity: 0 },
            '100%': { transform: 'scale(1)', opacity: 0.3 },
          },
        }} />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: cfg.color }}>{cfg.label}</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>{cfg.desc}</Typography>
      </Box>
    </Box>
  );
}

function UpdateCard({ update }) {
  const st = STATUS_CONFIG[update.status];
  return (
    <Box sx={{
      p: 2, borderRadius: 2, mb: 1.5,
      bgcolor: BRAND.surface2, border: `1px solid ${BRAND.border}`,
      borderLeft: `3px solid ${st.color}`,
      transition: 'all 0.2s',
      '&:hover': { bgcolor: alpha(BRAND.surface2, 0.8) },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(st.color, 0.15), fontSize: '0.75rem', color: st.color, fontWeight: 700 }}>
          {update.user.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: BRAND.textPrimary }}>
              {update.task}
            </Typography>
            <Chip
              icon={st.icon}
              label={st.label}
              size="small"
              sx={{
                height: 20, fontSize: '0.65rem', fontWeight: 700,
                bgcolor: alpha(st.color, 0.12), color: st.color,
                border: `1px solid ${alpha(st.color, 0.3)}`,
                '& .MuiChip-icon': { color: `${st.color} !important` },
              }}
            />
          </Box>
          <Typography sx={{ fontSize: '0.8rem', color: BRAND.textSecondary, mb: 1 }}>{update.note}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {update.gps_ok
                ? <GpsFixed sx={{ fontSize: 12, color: BRAND.green }} />
                : <GpsNotFixed sx={{ fontSize: 12, color: BRAND.red }} />}
              <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>
                {update.gps_ok ? 'GPS Verified' : 'GPS Flagged'}
              </Typography>
            </Box>
            {update.photo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhotoCamera sx={{ fontSize: 12, color: BRAND.sky }} />
                <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>Photo attached</Typography>
              </Box>
            )}
            <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, ml: 'auto' }}>
              {dayjs(update.time).fromNow()} · {update.user}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function LogUpdateDialog({ open, onClose, projectId }) {
  const { addUpdate } = useUpdatesStore();
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('in-progress');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!task.trim()) return;
    addUpdate({ projectId, task, status, note, user: 'Mohan Singh', gps_ok: true, photo: false });
    setTask(''); setNote(''); setStatus('in-progress');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Log Site Update</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <TextField label="Task Name" value={task} onChange={e => setTask(e.target.value)} fullWidth placeholder="e.g. Column RCC - Grid E5" />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={e => setStatus(e.target.value)} label="Status">
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Note" value={note} onChange={e => setNote(e.target.value)} fullWidth multiline rows={3} placeholder="Add a note about the update..." />
        <Alert severity="info" icon={<GpsFixed />} sx={{ fontSize: '0.8rem' }}>
          GPS will be verified on submission. Update will be flagged if logged outside site boundary.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} endIcon={<Send />}>Submit Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LiveDashboard() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { updates } = useUpdatesStore();
  const [logOpen, setLogOpen] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    if (projectId) setActiveProject(projectId);
  }, [projectId]);

  useEffect(() => {
    gsap.fromTo('.dash-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' });
  }, []);

  const project = projects.find(p => p.id === projectId);
  const projectUpdates = updates.filter(u => u.projectId === projectId);

  if (!project) return (
    <DashboardLayout>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Project not found. <Button onClick={() => window.history.back()}>Go Back</Button></Typography>
      </Box>
    </DashboardLayout>
  );

  const todayUpdates = projectUpdates.filter(u => dayjs(u.time).isAfter(dayjs().startOf('day')));
  const blockedCount = projectUpdates.filter(u => u.status === 'blocked').length;
  const doneToday = projectUpdates.filter(u => u.status === 'done').length;

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 01 · Live Site Dashboard</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project.name}</Typography>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.85rem' }}>{project.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button variant="outlined" startIcon={<Refresh />} size="small">Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setLogOpen(true)}>Log Update</Button>
        </Box>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Completion', value: `${project.completion}%`, color: BRAND.amber, className: 'dash-stat' },
          { label: 'Today\'s Updates', value: todayUpdates.length, color: BRAND.sky, className: 'dash-stat' },
          { label: 'Tasks Done', value: doneToday, color: BRAND.green, className: 'dash-stat' },
          { label: 'Blocked', value: blockedCount, color: BRAND.red, className: 'dash-stat' },
          { label: 'Workers', value: project.workers, color: BRAND.purple, className: 'dash-stat' },
          { label: 'Risk Score', value: `${project.risk}/100`, color: project.risk > 60 ? BRAND.red : BRAND.amber, className: 'dash-stat' },
        ].map((s, i) => (
          <Grid item xs={6} sm={4} md={2} key={i}>
            <Box className={s.className} sx={{
              p: 2, borderRadius: 2, textAlign: 'center',
              bgcolor: BRAND.surface, border: `1px solid ${alpha(s.color, 0.2)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.04)} 100%)`,
            }}>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, fontWeight: 600, mt: 0.25 }}>{s.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Live Feed */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BRAND.border}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge badgeContent={projectUpdates.length} color="primary">
                  <Assignment sx={{ color: BRAND.textSecondary }} />
                </Badge>
                <Typography sx={{ fontWeight: 700 }}>Real-Time Activity Feed</Typography>
              </Box>
              <Chip
                icon={<FiberManualRecord sx={{ fontSize: '10px !important', color: `${BRAND.green} !important` }} />}
                label="LIVE"
                size="small"
                sx={{ fontSize: '0.65rem', fontWeight: 800, bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, border: `1px solid ${alpha(BRAND.green, 0.3)}` }}
              />
            </Box>
            <Box sx={{ p: 2.5, maxHeight: 480, overflow: 'auto' }}>
              {projectUpdates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Assignment sx={{ fontSize: 40, color: BRAND.textMuted, mb: 2 }} />
                  <Typography sx={{ color: BRAND.textMuted }}>No updates yet. Log the first update.</Typography>
                </Box>
              ) : (
                projectUpdates.map(u => <UpdateCard key={u.id} update={u} />)
              )}
            </Box>
          </Card>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Site Pulse */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Site Pulse</Typography>
              <SitePulse pulse="green" />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Last Update', value: dayjs(projectUpdates[0]?.time).fromNow() || 'Never' },
                  { label: 'Updates Today', value: todayUpdates.length },
                  { label: 'GPS Verified', value: `${projectUpdates.filter(u => u.gps_ok).length}/${projectUpdates.length}` },
                ].map(item => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: BRAND.textPrimary }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Overall Progress */}
            <Card sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Project Progress</Typography>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: `conic-gradient(${BRAND.amber} ${project.completion}%, ${BRAND.surface2} 0%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 24px ${alpha(BRAND.amber, 0.2)}`,
                }}>
                  <Box sx={{
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: BRAND.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: BRAND.amber }}>{project.completion}%</Typography>
                    <Typography sx={{ fontSize: '0.58rem', color: BRAND.textMuted }}>DONE</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>Start: {dayjs(project.startDate).format('DD MMM YY')}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>End: {dayjs(project.endDate).format('DD MMM YY')}</Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <LogUpdateDialog open={logOpen} onClose={() => setLogOpen(false)} projectId={projectId} />
    </DashboardLayout>
  );
}
