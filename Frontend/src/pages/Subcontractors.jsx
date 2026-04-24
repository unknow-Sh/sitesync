import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Divider, Avatar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, alpha, LinearProgress,
  Tabs, Tab,
} from '@mui/material';
import {
  Groups, Add, CheckCircle, Warning, AccessTime, Refresh,
  Download, Send, ThumbUp, ThumbDown, Undo,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useSubcontractorStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

const CLAIM_STATUS = {
  pending: { color: BRAND.amber, label: 'Pending Review', icon: <AccessTime sx={{ fontSize: 14 }} /> },
  approved: { color: BRAND.green, label: 'Approved', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  revision: { color: BRAND.orange, label: 'Revision Needed', icon: <Refresh sx={{ fontSize: 14 }} /> },
  rejected: { color: BRAND.red, label: 'Rejected', icon: <Warning sx={{ fontSize: 14 }} /> },
};

function ClaimRow({ claim, sc, onApprove, onRevise }) {
  const st = CLAIM_STATUS[claim.status];
  return (
    <TableRow sx={{ '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) } }}>
      <TableCell>
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: BRAND.textPrimary }}>{claim.desc}</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>{sc?.name} · {sc?.trade}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 600, color: BRAND.textPrimary }}>{claim.qty} {claim.unit}</Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontWeight: 700, color: BRAND.amber }}>₹{claim.amount.toLocaleString()}</Typography>
      </TableCell>
      <TableCell>
        <Chip
          icon={React.cloneElement(st.icon, { sx: { fontSize: '12px !important' } })}
          label={st.label}
          size="small"
          sx={{
            bgcolor: alpha(st.color, 0.12), color: st.color, fontWeight: 700, fontSize: '0.7rem',
            border: `1px solid ${alpha(st.color, 0.3)}`,
            '& .MuiChip-icon': { color: `${st.color} !important` },
          }}
        />
      </TableCell>
      <TableCell>
        {claim.status === 'pending' && (
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Button size="small" startIcon={<ThumbUp sx={{ fontSize: '14px !important' }} />}
              onClick={() => onApprove(claim.id)}
              sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: '0.72rem', bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontWeight: 700, '&:hover': { bgcolor: alpha(BRAND.green, 0.2) } }}>
              Approve
            </Button>
            <Button size="small" startIcon={<Refresh sx={{ fontSize: '14px !important' }} />}
              onClick={() => onRevise(claim.id)}
              sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: '0.72rem', bgcolor: alpha(BRAND.amber, 0.1), color: BRAND.amber, fontWeight: 700, '&:hover': { bgcolor: alpha(BRAND.amber, 0.2) } }}>
              Revise
            </Button>
          </Box>
        )}
        {claim.status === 'approved' && (
          <Chip label="Payment Advice Ready" size="small" sx={{ bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontSize: '0.68rem', fontWeight: 600 }} />
        )}
        {claim.status === 'revision' && (
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.orange, fontStyle: 'italic', maxWidth: 180 }}>
            {claim.rejectionReason}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

export default function Subcontractors() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { subcontractors, claims } = useSubcontractorStore();
  const [tab, setTab] = useState(0);
  const [localClaims, setLocalClaims] = useState(null);

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const scs = subcontractors[projectId] || [];
  const projClaims = localClaims ?? claims[projectId] ?? [];

  const approveClaim = (id) => setLocalClaims(projClaims.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  const reviseClaim = (id) => setLocalClaims(projClaims.map(c => c.id === id ? { ...c, status: 'revision', rejectionReason: 'Please resubmit with clear measurements' } : c));

  const totalClaimed = scs.reduce((s, sc) => s + sc.totalClaimed, 0);
  const totalPaid = scs.reduce((s, sc) => s + sc.paid, 0);
  const pendingCount = projClaims.filter(c => c.status === 'pending').length;

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 07 · Subcontractor Portal + Payment Trail</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>Add Subcontractor</Button>
      </Box>

      {/* Summary */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Subcontractors', value: scs.length, color: BRAND.sky },
          { label: 'Total Claimed', value: `₹${(totalClaimed / 100000).toFixed(1)}L`, color: BRAND.amber },
          { label: 'Total Paid', value: `₹${(totalPaid / 100000).toFixed(1)}L`, color: BRAND.green },
          { label: 'Pending Review', value: pendingCount, color: pendingCount > 0 ? BRAND.orange : BRAND.textMuted },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{
              p: 2.5, textAlign: 'center',
              border: `1px solid ${alpha(s.color, 0.25)}`,
              background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(s.color, 0.05)} 100%)`,
            }}>
              <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: BRAND.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: `1px solid ${BRAND.border}` }}>
        <Tab label="Subcontractors" />
        <Tab label={`Claims ${pendingCount > 0 ? `(${pendingCount} pending)` : ''}`} />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2.5}>
          {scs.map(sc => {
            const paymentPct = Math.round((sc.paid / sc.totalClaimed) * 100) || 0;
            return (
              <Grid item xs={12} md={6} key={sc.id}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Avatar sx={{ bgcolor: alpha(BRAND.sky, 0.15), color: BRAND.sky, fontWeight: 700 }}>
                      {sc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: BRAND.textPrimary }}>{sc.name}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>{sc.trade} · {sc.rateType}</Typography>
                    </Box>
                    <Chip label="Active" size="small" sx={{ bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontWeight: 700 }} />
                  </Box>
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {[
                      { label: 'Contract Value', value: `₹${(sc.rate / 100000).toFixed(1)}L` },
                      { label: 'Total Claimed', value: `₹${(sc.totalClaimed / 1000).toFixed(0)}K` },
                      { label: 'Paid', value: `₹${(sc.paid / 1000).toFixed(0)}K` },
                      { label: 'Balance', value: `₹${((sc.totalClaimed - sc.paid) / 1000).toFixed(0)}K` },
                    ].map(m => (
                      <Grid item xs={6} key={m.label}>
                        <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: BRAND.surface2 }}>
                          <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted }}>{m.label}</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: BRAND.textPrimary }}>{m.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted }}>Payment Progress</Typography>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: BRAND.green }}>{paymentPct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={paymentPct}
                      sx={{ height: 5, borderRadius: 999, bgcolor: BRAND.surface, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${BRAND.green}, ${alpha(BRAND.green, 0.7)})` } }} />
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {tab === 1 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Work Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projClaims.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: BRAND.textMuted }}>No claims submitted yet.</TableCell></TableRow>
                ) : projClaims.map(claim => (
                  <ClaimRow
                    key={claim.id} claim={claim}
                    sc={scs.find(s => s.id === claim.scId)}
                    onApprove={approveClaim} onRevise={reviseClaim}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </DashboardLayout>
  );
}
