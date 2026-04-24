import React, { useEffect, useRef } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Chip,
  LinearProgress, Avatar, Button, Divider, alpha, IconButton, Tooltip,
} from '@mui/material';
import {
  TrendingUp, Add, ArrowForward, Warning,
  CheckCircle, Business, People, AttachMoney,
  Construction, LocationOn, Circle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useProjectStore } from '../store';
import { BRAND } from '../theme/theme';
import DashboardLayout from '../layouts/DashboardLayout';

function StatCard({ label, value, icon, color, sub }) {
  return (
    <Card sx={{
      p: 2.5, height: '100%',
      background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: '0.72rem', color: BRAND.textMuted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: BRAND.textPrimary, lineHeight: 1 }}>
            {value}
          </Typography>
          {sub && <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted, mt: 0.5 }}>{sub}</Typography>}
        </Box>
        <Box sx={{
          width: 44, height: 44, borderRadius: 2,
          bgcolor: alpha(color, 0.12),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
      </Box>
    </Card>
  );
}

function RiskBadge({ score }) {
  const color = score <= 30 ? BRAND.green : score <= 60 ? BRAND.amber : score <= 80 ? BRAND.orange : BRAND.red;
  const label = score <= 30 ? 'Healthy' : score <= 60 ? 'Watch' : score <= 80 ? 'Act Now' : 'Critical';
  return (
    <Chip
      icon={<Warning sx={{ fontSize: '14px !important' }} />}
      label={`Risk ${score} · ${label}`}
      size="small"
      sx={{
        bgcolor: alpha(color, 0.12), color, fontWeight: 700, fontSize: '0.72rem',
        border: `1px solid ${alpha(color, 0.3)}`,
      }}
    />
  );
}

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { setActiveProject } = useProjectStore();
  const spentPct = Math.round((project.spent / project.budget) * 100);
  const isOverBudget = spentPct > project.completion;

  const open = () => {
    setActiveProject(project.id);
    navigate(`/projects/${project.id}/dashboard`);
  };

  return (
    <Card
      onClick={open}
      sx={{
        cursor: 'pointer', height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 16px 48px ${alpha('#000', 0.5)}`,
          border: `1px solid ${alpha(BRAND.amber, 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Chip label={project.type} size="small" sx={{
              mb: 1, fontSize: '0.65rem', fontWeight: 700,
              bgcolor: alpha(BRAND.sky, 0.1), color: BRAND.sky,
              border: `1px solid ${alpha(BRAND.sky, 0.2)}`,
            }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, color: BRAND.textPrimary }}>
              {project.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <LocationOn sx={{ fontSize: 12, color: BRAND.textMuted }} />
              <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted }}>{project.location}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Circle sx={{ fontSize: 8, color: project.status === 'at-risk' ? BRAND.red : BRAND.green }} />
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: '0.75rem', color: BRAND.textMuted }}>Completion</Typography>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: BRAND.textPrimary }}>{project.completion}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.completion}
            sx={{
              height: 6, borderRadius: 999, bgcolor: BRAND.surface2,
              '& .MuiLinearProgress-bar': {
                background: project.completion > 80
                  ? `linear-gradient(90deg, ${BRAND.green}, ${alpha(BRAND.green, 0.7)})`
                  : `linear-gradient(90deg, ${BRAND.amber}, ${BRAND.amberDark})`,
              },
            }}
          />
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          <Grid item xs={6}>
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: BRAND.surface2 }}>
              <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted, mb: 0.25 }}>Budget Spent</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: isOverBudget ? BRAND.orange : BRAND.textPrimary }}>
                ₹{(project.spent / 100000).toFixed(1)}L
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted }}>
                of ₹{(project.budget / 100000).toFixed(0)}L ({spentPct}%)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: BRAND.surface2 }}>
              <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted, mb: 0.25 }}>Workers Today</Typography>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: BRAND.textPrimary }}>
                {project.workers}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted }}>
                {project.activeTasks} active tasks
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RiskBadge score={project.risk} />
          <Button
            size="small"
            endIcon={<ArrowForward sx={{ fontSize: '14px !important' }} />}
            sx={{ fontSize: '0.8rem', color: BRAND.amber, fontWeight: 700, p: 0.5 }}
          >
            Open
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AllProjectsDashboard() {
  const { user } = useAuth();
  const { projects } = useProjectStore();
  const navigate = useNavigate();
  const headerRef = useRef();

  useEffect(() => {
    gsap.fromTo('.project-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const atRisk = projects.filter(p => p.risk > 60).length;
  const totalWorkers = projects.reduce((s, p) => s + p.workers, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ fontSize: '0.72rem' }}>
          Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
              <Box component="span" sx={{ color: BRAND.amber }}>{user?.name?.split(' ')[0]}</Box>
            </Typography>
            <Typography sx={{ color: BRAND.textSecondary, mt: 0.5 }}>
              {projects.length} active projects · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard label="Total Projects" value={projects.length} icon={<Business />} color={BRAND.amber} sub="All active" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Total Budget" value={`₹${(totalBudget / 10000000).toFixed(1)}Cr`} icon={<AttachMoney />} color={BRAND.sky} sub={`₹${(totalSpent / 10000000).toFixed(1)}Cr spent`} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Workers On-Site" value={totalWorkers} icon={<People />} color={BRAND.green} sub="Across all sites" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="At-Risk Projects" value={atRisk} icon={<Warning />} color={BRAND.red} sub="Risk score >60" />
        </Grid>
      </Grid>

      {/* Projects Grid */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Your Projects</Typography>
        <Chip label="Live" size="small" icon={<Circle sx={{ fontSize: '8px !important', color: `${BRAND.green} !important` }} />}
          sx={{ bgcolor: alpha(BRAND.green, 0.1), color: BRAND.green, fontWeight: 600, border: `1px solid ${alpha(BRAND.green, 0.3)}` }} />
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id} className="project-card">
            <ProjectCard project={project} />
          </Grid>
        ))}
        {/* Add Project Card */}
        <Grid item xs={12} md={6} lg={4} className="project-card">
          <Card
            onClick={() => navigate('/projects/new')}
            sx={{
              height: '100%', minHeight: 280, cursor: 'pointer',
              border: `2px dashed ${alpha(BRAND.amber, 0.2)}`,
              bgcolor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              '&:hover': {
                border: `2px dashed ${alpha(BRAND.amber, 0.5)}`,
                bgcolor: alpha(BRAND.amber, 0.03),
              },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2,
                bgcolor: alpha(BRAND.amber, 0.1),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Add sx={{ color: BRAND.amber, fontSize: 28 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: BRAND.textSecondary }}>Add New Project</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: BRAND.textMuted, mt: 0.5 }}>
                Set up 10 modules in minutes
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
