import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Alert, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, alpha, LinearProgress,
} from '@mui/material';
import {
  Construction, Add, Warning, CheckCircle, Download,
  Timer, LocalGasStation, Build, Analytics,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useEquipmentStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';

const EQUIP_TYPE_ICONS = {
  'Tower Crane': '🏗️', 'Concrete Pump': '🏭', 'Transit Mixer': '🚛',
  'JCB Excavator': '🚜', 'Compactor': '⚙️', 'Generator': '⚡',
  'Concrete Mixer': '🔄', 'Default': '🔧',
};

function AddEquipmentDialog({ open, onClose }) {
  const [form, setForm] = useState({ type: 'JCB Excavator', supplier: '', dailyRate: '', operator: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Register Equipment</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Equipment Type</InputLabel>
          <Select value={form.type} onChange={e => set('type', e.target.value)} label="Equipment Type">
            {Object.keys(EQUIP_TYPE_ICONS).filter(k => k !== 'Default').map(t => (
              <MenuItem key={t} value={t}>{EQUIP_TYPE_ICONS[t]} {t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Rental Supplier" value={form.supplier} onChange={e => set('supplier', e.target.value)} fullWidth />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Daily Rate (₹)" type="number" value={form.dailyRate} onChange={e => set('dailyRate', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Operator Name" value={form.operator} onChange={e => set('operator', e.target.value)} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>Register</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function EquipmentTracker() {
  const { projectId } = useParams();
  useEffect(() => {
    if (projectId) useEquipmentStore.getState().fetchEquipment(projectId);
  }, [projectId]);

  const { projects, setActiveProject } = useProjectStore();
  const { equipment } = useEquipmentStore();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const equips = equipment[projectId] || [];

  const active = equips.filter(e => e.status === 'active').length;
  const idle = equips.filter(e => e.status === 'idle').length;
  const totalDailyRate = equips.reduce((s, e) => s + e.dailyRate, 0);
  const idleCost = equips.filter(e => e.status === 'idle').reduce((s, e) => s + e.dailyRate, 0);

  const chartData = equips.map(e => ({
    name: e.type.split(' ')[0],
    Active: e.status === 'active' ? e.dailyRate / 1000 : 0,
    Idle: e.status === 'idle' ? e.dailyRate / 1000 : 0,
  }));

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 09 · Equipment & Machinery Tracker</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Usage Report PDF</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Register Machine</Button>
        </Box>
      </Box>

      {/* Idle Alert */}
      {idle > 0 && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          <strong>{idle} machine(s) idle</strong> — Cost: ₹{idleCost.toLocaleString()}/day in idle rental.
          Verify with supervisor and log idle reason to challenge invoice.
        </Alert>
      )}

      {/* Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Machines', value: equips.length, color: BRAND.amber },
          { label: 'Active', value: active, color: BRAND.green },
          { label: 'Idle Today', value: idle, color: BRAND.red },
          { label: 'Daily Cost', value: `₹${(totalDailyRate / 1000).toFixed(0)}K`, color: BRAND.sky },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{
              p: 2.5, textAlign: 'center',
              border: `1px solid ${alpha(s.color, 0.25)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.05)} 100%)`,
            }}>
              <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Equipment Cards */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {equips.length === 0 ? (
              <Card sx={{ p: 5, textAlign: 'center' }}>
                <Construction sx={{ fontSize: 48, color: BRAND.textMuted, mb: 2 }} />
                <Typography sx={{ color: BRAND.textMuted }}>No equipment registered</Typography>
              </Card>
            ) : equips.map(eq => (
              <Card key={eq.id} sx={{
                p: 3, borderLeft: `3px solid ${eq.status === 'idle' ? BRAND.red : BRAND.green}`,
                border: `1px solid ${alpha(eq.status === 'idle' ? BRAND.red : BRAND.green, 0.2)}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    width: 50, height: 50, borderRadius: 2,
                    bgcolor: alpha(eq.status === 'idle' ? BRAND.red : BRAND.amber, 0.1),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                    flexShrink: 0,
                  }}>
                    {EQUIP_TYPE_ICONS[eq.type] || EQUIP_TYPE_ICONS.Default}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>{eq.type}</Typography>
                      <Chip
                        label={eq.status === 'idle' ? `⚠ Idle ${eq.idleHours}h` : '✓ Active'}
                        size="small"
                        sx={{
                          bgcolor: alpha(eq.status === 'idle' ? BRAND.red : BRAND.green, 0.12),
                          color: eq.status === 'idle' ? BRAND.red : BRAND.green,
                          fontWeight: 700, fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Grid container spacing={1.5}>
                      {[
                        { label: 'Supplier', value: eq.supplier },
                        { label: 'Operator', value: eq.operator },
                        { label: 'Daily Rate', value: `₹${eq.dailyRate.toLocaleString()}` },
                        { label: 'Status', value: eq.status === 'idle' ? `Idle for ${eq.idleHours}h` : 'Productive' },
                      ].map(m => (
                        <Grid item xs={6} sm={3} key={m.label}>
                          <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: BRAND.surface2 }}>
                            <Typography sx={{ fontSize: '0.62rem', color: BRAND.textMuted }}>{m.label}</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND.textPrimary }}>{m.value}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                {eq.status === 'idle' && (
                  <Alert severity="error" sx={{ mt: 2, py: 0.75, fontSize: '0.78rem' }}>
                    Machine has been idle for {eq.idleHours} hours. Log idle reason for invoice dispute protection.
                  </Alert>
                )}
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Daily Cost by Machine (₹K)</Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barGap={2}>
                  <XAxis dataKey="name" tick={{ fill: BRAND.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: BRAND.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{ backgroundColor: BRAND.surface2, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.textPrimary }} formatter={(v) => [`₹${v}K`, '']} />
                  <Bar dataKey="Active" fill={BRAND.green} radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="Idle" fill={BRAND.red} radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : <Typography sx={{ color: BRAND.textMuted, textAlign: 'center', py: 4 }}>No data</Typography>}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Invoice Verification</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: BRAND.textSecondary, mb: 2 }}>
              Compare actual on-site hours vs hours billed by supplier. Use this report to dispute inflated invoices.
            </Typography>
            <Button variant="outlined" fullWidth startIcon={<Download />} size="small">
              Generate Invoice Dispute Report
            </Button>
          </Card>
        </Grid>
      </Grid>

      <AddEquipmentDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </DashboardLayout>
  );
}
