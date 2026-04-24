import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Divider, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, alpha, LinearProgress,
} from '@mui/material';
import {
  AccountBalance, Add, TrendingUp, Warning, CheckCircle,
  Download, ReceiptLong, PieChart,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useBudgetStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PIE_COLORS = [BRAND.amber, BRAND.sky, BRAND.green, BRAND.purple, BRAND.orange, BRAND.red];

function BurnGauge({ pct }) {
  const color = pct <= 100 ? BRAND.green : pct <= 115 ? BRAND.amber : BRAND.red;
  const label = pct <= 100 ? 'On Budget' : pct <= 115 ? 'Watch' : 'Over Budget';
  const angle = Math.min((pct / 150) * 180, 180);
  const rad = (angle - 180) * Math.PI / 180;
  const cx = 75, cy = 75, r = 55;
  const ex = cx + r * Math.cos(rad);
  const ey = cy + r * Math.sin(rad);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <svg width="150" height="90" viewBox="0 0 150 90">
        {/* Track */}
        <path d={`M 20 75 A 55 55 0 0 1 130 75`} fill="none" stroke={BRAND.surface2} strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path
          d={`M 20 75 A 55 55 0 0 1 ${ex} ${ey}`}
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        />
        {/* Needle dot */}
        <circle cx={ex} cy={ey} r={5} fill={color} />
        {/* Center text */}
        <text x="75" y="68" textAnchor="middle" fontSize="16" fontWeight="800" fill={color}>{pct}%</text>
        <text x="75" y="82" textAnchor="middle" fontSize="9" fill={BRAND.textMuted}>{label}</text>
      </svg>
      <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, mt: -1 }}>Burn Rate</Typography>
    </Box>
  );
}

function AddExpenseDialog({ open, onClose, projectId, budgetItems }) {
  const { addExpense } = useBudgetStore();
  const [form, setForm] = useState({ desc: '', amount: '', category: '', payee: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.desc || !form.amount || !form.category) return;
    addExpense(projectId, { ...form, amount: Number(form.amount), date: new Date().toISOString().split('T')[0] });
    setForm({ desc: '', amount: '', category: '', payee: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Log Expense</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <TextField label="Description" value={form.desc} onChange={e => set('desc', e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Budget Category</InputLabel>
          <Select value={form.category} onChange={e => set('category', e.target.value)} label="Budget Category">
            {budgetItems.map(b => <MenuItem key={b.id} value={b.category}>{b.category}</MenuItem>)}
          </Select>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Amount (₹)" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Paid To" value={form.payee} onChange={e => set('payee', e.target.value)} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save Expense</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function BudgetTracker() {
  const { projectId } = useParams();
  useEffect(() => {
    if (projectId) useBudgetStore.getState().fetchBudget(projectId);
  }, [projectId]);

  const { projects, setActiveProject } = useProjectStore();
  const { budgets } = useBudgetStore();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const budget = budgets[projectId];
  if (!project || !budget) return <DashboardLayout><Box sx={{ p: 4 }}><Typography>No budget data.</Typography></Box></DashboardLayout>;

  const totalSpent = budget.items.reduce((s, i) => s + i.spent, 0);
  const totalBudget = budget.items.reduce((s, i) => s + i.budget, 0);
  const burnRate = Math.round((totalSpent / totalBudget) * 100);
  const plannedSpendPct = project.completion;
  const overrun = burnRate - plannedSpendPct;
  const projectedFinal = Math.round(totalSpent / (project.completion / 100));

  const pieData = budget.items.map((item, i) => ({
    name: item.category, value: item.spent, total: item.budget,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const barData = budget.items.map(item => ({
    name: item.category.split(' ')[0],
    Budget: item.budget / 100000,
    Spent: item.spent / 100000,
    pct: Math.round((item.spent / item.budget) * 100),
  }));

  const categoryStatus = (spent, budget) => {
    const p = (spent / budget) * 100;
    if (p <= 100) return { color: BRAND.green, label: 'On Track' };
    if (p <= 115) return { color: BRAND.amber, label: '5-15% Over' };
    return { color: BRAND.red, label: '>15% Over' };
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 05 · Budget Burn Tracker</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Financial Report</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Log Expense</Button>
        </Box>
      </Box>

      {/* Burn Rate Warning */}
      {overrun > 5 && (
        <Alert severity={overrun > 15 ? 'error' : 'warning'} icon={<Warning />} sx={{ mb: 3 }}>
          <strong>Predictive Alert:</strong> Burn rate is {burnRate}% but project is only {plannedSpendPct}% complete.
          At current spend rate, project will exceed budget by{' '}
          <strong>₹{((projectedFinal - totalBudget) / 100000).toFixed(1)}L</strong>.
        </Alert>
      )}

      {/* Top Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Burn Gauge */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <BurnGauge pct={burnRate} />
            <Divider sx={{ width: '100%', my: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>Spent</Typography>
                <Typography sx={{ fontWeight: 700, color: BRAND.amber }}>₹{(totalSpent / 100000).toFixed(1)}L</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted }}>Total Budget</Typography>
                <Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>₹{(totalBudget / 100000).toFixed(1)}L</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, mt: 0.5 }}>Projected Final Cost</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: projectedFinal > totalBudget ? BRAND.red : BRAND.green }}>
                  ₹{(projectedFinal / 100000).toFixed(1)}L
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} sm={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>Budget vs Spent by Category (₹L)</Typography>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barGap={3}>
                <XAxis dataKey="name" tick={{ fill: BRAND.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: BRAND.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ backgroundColor: BRAND.surface2, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.textPrimary }} formatter={(v) => [`₹${v}L`, '']} />
                <Bar dataKey="Budget" fill={alpha(BRAND.sky, 0.3)} radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="Spent" radius={[4, 4, 0, 0]} name="Spent">
                  {barData.map((d, i) => <Cell key={i} fill={d.pct > 115 ? BRAND.red : d.pct > 100 ? BRAND.amber : BRAND.green} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Category Breakdown */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${BRAND.border}` }}>
          <Typography sx={{ fontWeight: 700 }}>Budget Health by Category</Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          {budget.items.map((item, i) => {
            const pct = Math.round((item.spent / item.budget) * 100);
            const st = categoryStatus(item.spent, item.budget);
            return (
              <Box key={item.id} sx={{ mb: i < budget.items.length - 1 ? 2.5 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: BRAND.textPrimary }}>{item.category}</Typography>
                    <Chip label={st.label} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: alpha(st.color, 0.1), color: st.color }} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: BRAND.textPrimary }}>
                      ₹{(item.spent / 100000).toFixed(1)}L <Box component="span" sx={{ color: BRAND.textMuted, fontWeight: 400 }}>/ ₹{(item.budget / 100000).toFixed(1)}L</Box>
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(pct, 100)}
                  sx={{
                    height: 6, borderRadius: 999, bgcolor: BRAND.surface2,
                    '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${st.color}, ${alpha(st.color, 0.7)})`, borderRadius: 999 },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${BRAND.border}` }}>
          <Typography sx={{ fontWeight: 700 }}>Recent Expenses</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Paid To</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budget.expenses.map(exp => (
                <TableRow key={exp.id} sx={{ '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) } }}>
                  <TableCell><Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: BRAND.textPrimary }}>{exp.desc}</Typography></TableCell>
                  <TableCell><Chip label={exp.category} size="small" sx={{ bgcolor: alpha(BRAND.amber, 0.1), color: BRAND.amber, fontWeight: 600, fontSize: '0.72rem' }} /></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.82rem', color: BRAND.textSecondary }}>{exp.payee}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>{exp.date}</Typography></TableCell>
                  <TableCell align="right"><Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>₹{exp.amount.toLocaleString()}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddExpenseDialog open={addOpen} onClose={() => setAddOpen(false)} projectId={projectId} budgetItems={budget.items} />
    </DashboardLayout>
  );
}
