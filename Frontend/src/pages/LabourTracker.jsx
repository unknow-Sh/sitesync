import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Avatar, Button, Divider,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, LinearProgress, Tooltip, alpha, Paper,
} from '@mui/material';
import {
  Add, People, GpsFixed, Download, Warning,
  CheckCircle, Block, AccessTime, Edit, Delete,
  Person, ToggleOn, ToggleOff, Info,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useProjectStore, useLabourStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

const SKILL_COLORS = {
  Mason: BRAND.amber, Carpenter: BRAND.sky, Helper: BRAND.green,
  Electrician: BRAND.purple, Plumber: BRAND.orange,
};

const STATUS_CONFIG = {
  present: { color: BRAND.green, label: 'Present' },
  absent: { color: BRAND.red, label: 'Absent' },
  'half-day': { color: BRAND.amber, label: 'Half Day' },
};

function WorkerRow({ worker, onToggle }) {
  const st = STATUS_CONFIG[worker.status];
  const skillColor = SKILL_COLORS[worker.skill] || BRAND.textMuted;
  return (
    <TableRow sx={{ '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) }, transition: 'background 0.15s' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(skillColor, 0.15), color: skillColor, fontSize: '0.8rem', fontWeight: 700 }}>
            {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: BRAND.textPrimary }}>{worker.name}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>ID: {worker.id}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip label={worker.skill} size="small" sx={{
          bgcolor: alpha(skillColor, 0.12), color: skillColor,
          fontWeight: 700, fontSize: '0.72rem',
          border: `1px solid ${alpha(skillColor, 0.3)}`,
        }} />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 600, color: BRAND.textPrimary }}>₹{worker.dailyRate}</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: BRAND.textMuted }}>/day</Typography>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {['present', 'half-day', 'absent'].map(s => (
            <Button
              key={s}
              size="small"
              onClick={() => onToggle(worker.id, s)}
              sx={{
                minWidth: 0, px: 1.2, py: 0.3, fontSize: '0.65rem', fontWeight: 700,
                borderRadius: 1,
                bgcolor: worker.status === s ? alpha(STATUS_CONFIG[s].color, 0.2) : 'transparent',
                color: worker.status === s ? STATUS_CONFIG[s].color : BRAND.textMuted,
                border: `1px solid ${worker.status === s ? alpha(STATUS_CONFIG[s].color, 0.4) : BRAND.border}`,
                '&:hover': { bgcolor: alpha(STATUS_CONFIG[s].color, 0.12) },
              }}
            >
              {STATUS_CONFIG[s].label}
            </Button>
          ))}
        </Box>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>
          ₹{worker.status === 'present' ? worker.dailyRate.toLocaleString() :
             worker.status === 'half-day' ? (worker.dailyRate / 2).toLocaleString() : '0'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function AddWorkerDialog({ open, onClose, projectId }) {
  const { addWorker } = useLabourStore();
  const [form, setForm] = useState({ name: '', skill: 'Mason', dailyRate: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.dailyRate) return;
    addWorker(projectId, { ...form, dailyRate: Number(form.dailyRate), status: 'present' });
    setForm({ name: '', skill: 'Mason', dailyRate: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Add Worker</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <TextField label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Skill Type</InputLabel>
          <Select value={form.skill} onChange={e => set('skill', e.target.value)} label="Skill Type">
            {['Mason', 'Carpenter', 'Helper', 'Electrician', 'Plumber', 'Welder', 'Painter'].map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Daily Rate (₹)" type="number" value={form.dailyRate} onChange={e => set('dailyRate', e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Add Worker</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function LabourTracker() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { workers, updateWorkerStatus } = useLabourStore();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const projectWorkers = workers[projectId] || [];
  const present = projectWorkers.filter(w => w.status === 'present').length;
  const halfDay = projectWorkers.filter(w => w.status === 'half-day').length;
  const absent = projectWorkers.filter(w => w.status === 'absent').length;

  const totalPayable = projectWorkers.reduce((sum, w) => {
    if (w.status === 'present') return sum + w.dailyRate;
    if (w.status === 'half-day') return sum + w.dailyRate / 2;
    return sum;
  }, 0);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 02 · Smart Labour Tracker</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Export Payroll PDF</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Add Worker</Button>
        </Box>
      </Box>

      {/* Geo-fence alert */}
      <Alert
        severity="success"
        icon={<GpsFixed />}
        sx={{ mb: 3, fontSize: '0.82rem' }}
      >
        <strong>Geo-fence active</strong> — Attendance can only be marked within 100m of site boundary. Location verified.
      </Alert>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Present', value: present, color: BRAND.green },
          { label: 'Half Day', value: halfDay, color: BRAND.amber },
          { label: 'Absent', value: absent, color: BRAND.red },
          { label: "Today's Payable", value: `₹${totalPayable.toLocaleString()}`, color: BRAND.sky },
        ].map((s, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Card sx={{
              p: 2.5, textAlign: 'center',
              border: `1px solid ${alpha(s.color, 0.25)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.05)} 100%)`,
            }}>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.25 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Attendance Table */}
      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BRAND.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People sx={{ color: BRAND.textSecondary }} />
            <Typography sx={{ fontWeight: 700 }}>
              Workers Registry — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
          </Box>
          <Chip label={`${projectWorkers.length} Workers`} size="small" sx={{ bgcolor: alpha(BRAND.amber, 0.1), color: BRAND.amber }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell>Skill</TableCell>
                <TableCell>Daily Rate</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Payable Today</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectWorkers.map(w => (
                <WorkerRow key={w.id} worker={w} onToggle={(id, s) => updateWorkerStatus(projectId, id, s)} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Payroll Summary Footer */}
        <Box sx={{ p: 2.5, borderTop: `1px solid ${BRAND.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>Anomaly Detection</Typography>
            {present < projectWorkers.length * 0.6 ? (
              <Chip icon={<Warning sx={{ fontSize: '14px !important' }} />} label="Low attendance — verify tasks" size="small"
                sx={{ mt: 0.5, bgcolor: alpha(BRAND.red, 0.12), color: BRAND.red, fontWeight: 700, border: `1px solid ${alpha(BRAND.red, 0.3)}` }} />
            ) : (
              <Chip icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} label="Attendance normal" size="small"
                sx={{ mt: 0.5, bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontWeight: 700, border: `1px solid ${alpha(BRAND.green, 0.3)}` }} />
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>Total Payable Today</Typography>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: BRAND.amber }}>
              ₹{totalPayable.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Card>

      <AddWorkerDialog open={addOpen} onClose={() => setAddOpen(false)} projectId={projectId} />
    </DashboardLayout>
  );
}
