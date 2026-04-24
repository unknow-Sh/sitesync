import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, Chip, Button, Alert, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, alpha, Tooltip, IconButton,
} from '@mui/material';
import {
  FolderOpen, Add, Warning, CheckCircle, Download, Upload,
  Visibility, Delete, DocumentScanner, Info, CalendarMonth,
  Notifications, Shield,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDocumentStore, useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

const CATEGORY_ICONS = {
  'Building Permit': '🏛️', 'Commencement Certificate': '📜',
  'Completion Certificate': '✅', 'Engineer NOC': '👷',
  'Soil Report': '📊', 'Structural Drawing': '📐',
  'Architectural Drawing': '🏗️', 'Insurance Certificate': '🛡️',
  'Contractor Licence': '📋', 'Subcontractor Agreement': '🤝',
  'Inspection Report': '🔍', 'Custom': '📁',
};

const DOC_STATUS = {
  valid: { color: BRAND.green, label: 'Valid', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  current: { color: BRAND.green, label: 'Current', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  'expiring-soon': { color: BRAND.amber, label: '⚠ Expiring Soon', icon: <Warning sx={{ fontSize: 14 }} /> },
  critical: { color: BRAND.red, label: '🔴 Expiring <7 days', icon: <Warning sx={{ fontSize: 14 }} /> },
  expired: { color: BRAND.red, label: 'Expired', icon: <Warning sx={{ fontSize: 14 }} /> },
};

function ExpiryBadge({ expiry }) {
  if (!expiry) return null;
  const daysLeft = dayjs(expiry).diff(dayjs(), 'day');
  const color = daysLeft <= 7 ? BRAND.red : daysLeft <= 15 ? BRAND.orange : daysLeft <= 30 ? BRAND.amber : BRAND.green;
  const label = daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`;
  return (
    <Chip label={label} size="small" sx={{
      height: 18, fontSize: '0.62rem', fontWeight: 700,
      bgcolor: alpha(color, 0.12), color,
      border: `1px solid ${alpha(color, 0.3)}`,
    }} />
  );
}

function AddDocumentDialog({ open, onClose }) {
  const [form, setForm] = useState({ name: '', category: 'Building Permit', expiry: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: BRAND.surface, border: `1px solid ${BRAND.border}` } }}>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Upload sx={{ color: BRAND.amber }} /> Upload Document
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
        <Alert severity="info" icon={<DocumentScanner />} sx={{ fontSize: '0.8rem' }}>
          OCR will attempt to auto-detect expiry dates from the uploaded document.
        </Alert>
        <TextField label="Document Name" value={form.name} onChange={e => set('name', e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={form.category} onChange={e => set('category', e.target.value)} label="Category">
            {Object.keys(CATEGORY_ICONS).map(c => (
              <MenuItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Expiry Date (leave blank if none)" type="date" value={form.expiry}
          onChange={e => set('expiry', e.target.value)} fullWidth
          InputLabelProps={{ shrink: true }} />
        <Box sx={{
          border: `2px dashed ${alpha(BRAND.amber, 0.3)}`, borderRadius: 2, p: 3, textAlign: 'center',
          cursor: 'pointer', '&:hover': { borderColor: BRAND.amber, bgcolor: alpha(BRAND.amber, 0.03) },
          transition: 'all 0.2s',
        }}>
          <Upload sx={{ color: BRAND.textMuted, fontSize: 32, mb: 1 }} />
          <Typography sx={{ color: BRAND.textMuted, fontSize: '0.85rem' }}>Click to upload or drag & drop</Typography>
          <Typography sx={{ color: BRAND.textMuted, fontSize: '0.72rem' }}>PDF, JPG, PNG supported</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: BRAND.textSecondary }}>Cancel</Button>
        <Button variant="contained" onClick={onClose}>Upload Document</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DocumentVault() {
  const { projectId } = useParams();
  const { projects, setActiveProject } = useProjectStore();
  const { documents } = useDocumentStore();
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { if (projectId) setActiveProject(projectId); }, [projectId]);

  const project = projects.find(p => p.id === projectId);
  const docs = documents[projectId] || [];

  const expiringCritical = docs.filter(d => d.status === 'critical').length;
  const expiringSoon = docs.filter(d => d.status === 'expiring-soon').length;
  const filteredDocs = filter === 'all' ? docs : docs.filter(d => d.status === filter);

  const COMPLIANCE_LIST = [
    { name: 'Building Permit', required: true },
    { name: 'Commencement Certificate', required: true },
    { name: 'Engineer NOC', required: true },
    { name: 'Structural Drawing', required: true },
    { name: 'Insurance Certificate', required: true },
    { name: 'Soil Report', required: false },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline">Module 08 · Smart Document Vault + Expiry Alerts</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{project?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Download />} size="small">Bulk Download ZIP</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>Upload Document</Button>
        </Box>
      </Box>

      {/* Expiry Alerts */}
      {expiringCritical > 0 && (
        <Alert severity="error" icon={<Warning />} sx={{ mb: 2 }}>
          <strong>CRITICAL:</strong> {expiringCritical} document(s) expire within 7 days.
          Risk of project stoppage and fine. Renew immediately.
        </Alert>
      )}
      {expiringSoon > 0 && (
        <Alert severity="warning" icon={<CalendarMonth />} sx={{ mb: 2 }}>
          <strong>Reminder:</strong> {expiringSoon} document(s) expire within 30 days.
          WhatsApp reminders have been sent to project owner.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Doc List */}
        <Grid item xs={12} lg={8}>
          {/* Filter chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
            {[
              { val: 'all', label: 'All Documents', count: docs.length },
              { val: 'critical', label: 'Critical', count: expiringCritical },
              { val: 'expiring-soon', label: 'Expiring Soon', count: expiringSoon },
            ].map(f => (
              <Chip
                key={f.val}
                label={`${f.label} (${f.count})`}
                onClick={() => setFilter(f.val)}
                size="small"
                sx={{
                  cursor: 'pointer', fontWeight: 600,
                  bgcolor: filter === f.val ? alpha(BRAND.amber, 0.15) : BRAND.surface2,
                  color: filter === f.val ? BRAND.amber : BRAND.textSecondary,
                  border: `1px solid ${filter === f.val ? alpha(BRAND.amber, 0.4) : BRAND.border}`,
                  '&:hover': { bgcolor: alpha(BRAND.amber, 0.1) },
                }}
              />
            ))}
          </Box>

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocs.map(doc => {
                    const st = DOC_STATUS[doc.status] || DOC_STATUS.valid;
                    return (
                      <TableRow key={doc.id} sx={{
                        '&:hover': { bgcolor: alpha(BRAND.surface2, 0.5) },
                        bgcolor: doc.status === 'critical' ? alpha(BRAND.red, 0.03) : 'transparent',
                      }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ fontSize: '1.2rem' }}>{CATEGORY_ICONS[doc.category] || '📁'}</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: BRAND.textPrimary }}>{doc.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.78rem', color: BRAND.textSecondary }}>{doc.category}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={`Rev.${doc.version}`} size="small" sx={{ bgcolor: BRAND.surface2, color: BRAND.textSecondary, fontSize: '0.7rem', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          {doc.expiry ? (
                            <Box>
                              <Typography sx={{ fontSize: '0.78rem', color: BRAND.textPrimary }}>{dayjs(doc.expiry).format('DD MMM YYYY')}</Typography>
                              <ExpiryBadge expiry={doc.expiry} />
                            </Box>
                          ) : (
                            <Typography sx={{ fontSize: '0.78rem', color: BRAND.textMuted }}>No expiry</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={React.cloneElement(st.icon, { sx: { fontSize: '12px !important' } })}
                            label={st.label}
                            size="small"
                            sx={{ bgcolor: alpha(st.color, 0.1), color: st.color, fontWeight: 700, fontSize: '0.7rem',
                              border: `1px solid ${alpha(st.color, 0.3)}`, '& .MuiChip-icon': { color: `${st.color} !important` } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View"><IconButton size="small" sx={{ color: BRAND.textMuted }}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            <Tooltip title="Download"><IconButton size="small" sx={{ color: BRAND.textMuted }}><Download sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Compliance Checklist */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Shield sx={{ color: BRAND.green }} />
              <Typography sx={{ fontWeight: 700 }}>Compliance Checklist</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, mb: 2 }}>
              Residential Project · RERA Compliant
            </Typography>
            {COMPLIANCE_LIST.map((item, i) => {
              const uploaded = docs.some(d => d.category === item.name);
              return (
                <Box key={i} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5,
                  p: 1.5, borderRadius: 1.5,
                  bgcolor: uploaded ? alpha(BRAND.green, 0.05) : alpha(BRAND.red, 0.04),
                  border: `1px solid ${uploaded ? alpha(BRAND.green, 0.2) : alpha(BRAND.red, 0.15)}`,
                }}>
                  {uploaded
                    ? <CheckCircle sx={{ color: BRAND.green, fontSize: 18 }} />
                    : <Warning sx={{ color: item.required ? BRAND.red : BRAND.amber, fontSize: 18 }} />}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: BRAND.textPrimary }}>{item.name}</Typography>
                    {item.required && !uploaded && (
                      <Typography sx={{ fontSize: '0.68rem', color: BRAND.red }}>Required · Not uploaded</Typography>
                    )}
                  </Box>
                  {!item.required && <Chip label="Optional" size="small" sx={{ height: 16, fontSize: '0.6rem', color: BRAND.textMuted, bgcolor: BRAND.surface2 }} />}
                </Box>
              );
            })}
          </Card>
        </Grid>
      </Grid>

      <AddDocumentDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </DashboardLayout>
  );
}
