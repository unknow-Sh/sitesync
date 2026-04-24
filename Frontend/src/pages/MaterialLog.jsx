import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Alert, alpha, IconButton, Tooltip, LinearProgress,
} from '@mui/material';
import {
  Add, Inventory2, Warning, CheckCircle, TrendingDown,
  DocumentScanner, Download, Info, LocalShipping,
  ReceiptLong, Analytics,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useMaterialStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const MATERIAL_COLORS = {
  'Cement (OPC 53)': BRAND.amber,
  'TMT Steel (Fe-500)': BRAND.sky,
  'Coarse Aggregate': BRAND.green,
  'Ready-Mix Concrete M30': BRAND.purple,
};

function AddDeliveryDialog({ open, onClose, projectId }) {
  const { addDelivery } = useMaterialStore();
  const [form, setForm] = useState({ material: '', qty: '', unit: 'bags', supplier: '', rate: '', challan: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.material || !form.qty) return;
    addDelivery(projectId, { ...form, qty: Number(form.qty), rate: Number(form.rate), date: new Date().toISOString().split('T')[0] });
    setForm({ material: '', qty: '', unit: 'bags', supplier: '', rate: '', challan: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DocumentScanner sx={{ color: BRAND.amber }} /> Log Delivery
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <Alert severity="info" icon={<DocumentScanner />} sx={{ fontSize: '0.8rem' }}>
          In production, photograph the challan — OCR auto-fills quantity, supplier and material type.
        </Alert>
        <TextField label="Material Type" value={form.material} onChange={e => set('material', e.target.value)} fullWidth
          placeholder="e.g. Cement (OPC 53)" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Quantity" type="number" value={form.qty} onChange={e => set('qty', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select value={form.unit} onChange={e => set('unit', e.target.value)} label="Unit">
                {['bags', 'tonnes', 'cubic m', 'litres', 'pieces', 'metres', 'kg'].map(u => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField label="Supplier Name" value={form.supplier} onChange={e => set('supplier', e.target.value)} fullWidth />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Rate (₹/unit)" type="number" value={form.rate} onChange={e => set('rate', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Challan No." value={form.challan} onChange={e => set('challan', e.target.value)} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save Delivery</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function MaterialLog() {
  const { projectId } = useParams();
  const { setActiveProject, projects } = useProjectStore();
  const { deliveries, consumption } = useMaterialStore();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const projDeliveries = deliveries[projectId] || [];
  const projConsumption = consumption[projectId] || [];

  const totalDelivered = projDeliveries.reduce((s, d) => s + d.qty * d.rate, 0);
  const totalConsumed = projConsumption.reduce((s, c) => s + c.qty, 0);

  // Build ledger by material type
  const ledger = {};
  projDeliveries.forEach(d => {
    if (!ledger[d.material]) ledger[d.material] = { delivered: 0, consumed: 0, unit: d.unit };
    ledger[d.material].delivered += d.qty;
  });
  projConsumption.forEach(c => {
    if (!ledger[c.material]) ledger[c.material] = { delivered: 0, consumed: 0, unit: c.unit };
    ledger[c.material].consumed += c.qty;
  });

  const ledgerItems = Object.entries(ledger).map(([material, data]) => ({
    material,
    ...data,
    balance: data.delivered - data.consumed,
    alertFlag: data.consumed > data.delivered * 1.05,
  }));

  const chartData = ledgerItems.map(l => ({
    name: l.material.split(' ')[0],
    Delivered: l.delivered,
    Consumed: l.consumed,
    Balance: l.balance,
  }));

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 03 · Material Intelligence Log</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Weekly Report</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Log Delivery</Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Deliveries', value: projDeliveries.length, color: BRAND.sky, icon: <LocalShipping /> },
          { label: 'Total Value', value: `₹${(totalDelivered / 100000).toFixed(1)}L`, color: BRAND.amber, icon: <ReceiptLong /> },
          { label: 'Units Consumed', value: totalConsumed.toFixed(1), color: BRAND.green, icon: <Analytics /> },
          { label: 'Theft Alerts', value: ledgerItems.filter(l => l.alertFlag).length, color: BRAND.red, icon: <Warning /> },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{
              p: 2.5, border: `1px solid ${alpha(s.color, 0.2)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.05)} 100%)`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: alpha(s.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 20 } })}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Stock Ledger */}
        <Grid item xs={12} lg={7}>
          <Card>
            <Box sx={{ p: 2.5, borderBottom: `1px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory2 sx={{ color: BRAND.textSecondary }} />
              <Typography sx={{ fontWeight: 700 }}>Real-Time Stock Ledger</Typography>
              <Tooltip title="Delivered - Consumed = Balance. Red = consumption exceeds delivery (theft/waste alert).">
                <Info sx={{ fontSize: 16, color: BRAND.textMuted, ml: 'auto', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Material</TableCell>
                    <TableCell align="right">Delivered</TableCell>
                    <TableCell align="right">Consumed</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ledgerItems.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: BRAND.textMuted }}>No deliveries logged yet.</TableCell></TableRow>
                  ) : ledgerItems.map((item, i) => (
                    <TableRow key={i} sx={{
                      bgcolor: item.alertFlag ? alpha(BRAND.red, 0.04) : 'transparent',
                      '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) },
                    }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: BRAND.textPrimary }}>{item.material}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: BRAND.textMuted }}>{item.unit}</Typography>
                      </TableCell>
                      <TableCell align="right"><Typography sx={{ fontWeight: 600, color: BRAND.sky }}>{item.delivered}</Typography></TableCell>
                      <TableCell align="right"><Typography sx={{ fontWeight: 600, color: BRAND.amber }}>{item.consumed}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 700, color: item.balance < 0 ? BRAND.red : BRAND.green }}>
                          {item.balance.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {item.alertFlag ? (
                          <Chip icon={<Warning sx={{ fontSize: '12px !important' }} />} label="Alert" size="small"
                            sx={{ bgcolor: alpha(BRAND.red, 0.12), color: BRAND.red, fontWeight: 700, border: `1px solid ${alpha(BRAND.red, 0.3)}`, fontSize: '0.65rem' }} />
                        ) : (
                          <Chip icon={<CheckCircle sx={{ fontSize: '12px !important' }} />} label="OK" size="small"
                            sx={{ bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontWeight: 700, border: `1px solid ${alpha(BRAND.green, 0.3)}`, fontSize: '0.65rem' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Chart + Deliveries */}
        <Grid item xs={12} lg={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Bar chart */}
            {chartData.length > 0 && (
              <Card sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Delivered vs Consumed</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barGap={2}>
                    <XAxis dataKey="name" tick={{ fill: BRAND.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: BRAND.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: BRAND.surface2, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.textPrimary }} />
                    <Bar dataKey="Delivered" fill={BRAND.sky} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Consumed" fill={BRAND.amber} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Recent Deliveries */}
            <Card>
              <Box sx={{ p: 2, borderBottom: `1px solid ${BRAND.border}` }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Deliveries</Typography>
              </Box>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {projDeliveries.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: BRAND.textMuted, fontSize: '0.85rem' }}>No deliveries yet</Typography>
                  </Box>
                ) : projDeliveries.slice().reverse().map(d => (
                  <Box key={d.id} sx={{
                    p: 2, borderBottom: `1px solid ${BRAND.border}`,
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) },
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: BRAND.textPrimary }}>{d.material}</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: BRAND.amber }}>
                        ₹{(d.qty * d.rate).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>{d.qty} {d.unit} · {d.supplier}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>{d.challan}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <AddDeliveryDialog open={addOpen} onClose={() => setAddOpen(false)} projectId={projectId} />
    </DashboardLayout>
  );
}
