import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Chip, Divider, Tooltip, Badge, useMediaQuery,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon, PeopleTwoTone as People, InventoryTwoTone as Inventory2,
  AccountTreeTwoTone as AccountTree, AccountBalanceTwoTone as AccountBalance, 
  WarningTwoTone as Warning, GroupsTwoTone as Groups,
  FolderOpenTwoTone as FolderOpen, AssessmentTwoTone as Assessment, 
  NotificationsTwoTone as Notifications, SettingsTwoTone as Settings,
  AnalyticsTwoTone as Analytics, ConstructionTwoTone as Construction, Circle,
  DashboardTwoTone as Dashboard,
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectStore } from '../store';
import { BRAND } from '../theme/theme';

const DRAWER_WIDTH = 260;

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'All Projects', icon: <Dashboard fontSize="small" />, path: '/dashboard' },
    ],
  },
  {
    label: 'Core Modules',
    projectRequired: true,
    items: [
      { label: 'Live Dashboard', icon: <Analytics fontSize="small" />, path: 'dashboard', module: '01' },
      { label: 'Labour Tracker', icon: <People fontSize="small" />, path: 'labour', module: '02' },
      { label: 'Material Log', icon: <Inventory2 fontSize="small" />, path: 'materials', module: '03' },
      { label: 'Milestones', icon: <AccountTree fontSize="small" />, path: 'milestones', module: '04' },
      { label: 'Budget Tracker', icon: <AccountBalance fontSize="small" />, path: 'budget', module: '05' },
    ],
  },
  {
    label: 'Power Modules',
    projectRequired: true,
    items: [
      { label: 'AI Risk Engine', icon: <Warning fontSize="small" />, path: 'risk', module: '06', badge: 'AI' },
      { label: 'Subcontractors', icon: <Groups fontSize="small" />, path: 'subcontractors', module: '07' },
      { label: 'Document Vault', icon: <FolderOpen fontSize="small" />, path: 'documents', module: '08' },
      { label: 'Equipment', icon: <Construction fontSize="small" />, path: 'equipment', module: '09' },
      { label: 'Client Report', icon: <Assessment fontSize="small" />, path: 'report', module: '10' },
    ],
  },
];

function ModuleBadge({ module, badge }) {
  if (badge) return (
    <Chip label={badge} size="small" sx={{
      height: 18, fontSize: '0.6rem', fontWeight: 800,
      background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.amberDark})`,
      color: '#000', ml: 'auto',
    }} />
  );
  if (module) return (
    <Typography variant="caption" sx={{
      ml: 'auto', color: BRAND.textMuted, fontWeight: 700,
      fontSize: '0.65rem', letterSpacing: '0.05em',
    }}>
      {module}
    </Typography>
  );
  return null;
}

function SidebarContent({ projectId, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { projects, activeProject } = useProjectStore();
  const [projectsOpen, setProjectsOpen] = useState(true);

  const isActive = (path, isProjectPath) => {
    if (isProjectPath && projectId) {
      return location.pathname === `/projects/${projectId}/${path}` ||
        location.pathname.startsWith(`/projects/${projectId}/${path}`);
    }
    return location.pathname === path;
  };

  const navigateTo = (path, isProjectPath) => {
    if (isProjectPath && projectId) {
      navigate(`/projects/${projectId}/${path}`);
    } else {
      navigate(path);
    }
    if (onClose) onClose();
  };

  const activeProj = projects.find(p => p.id === projectId);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 38, height: 38, borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src="/logo.png" alt="Sitesco Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.2 }}>
            Sitesco
          </Typography>
          <Typography sx={{ fontSize: '0.62rem', color: alpha('#fff', 0.6), fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Construction SaaS
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Active Project Chip */}
      {activeProj && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: '0.65rem', color: BRAND.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1 }}>
            Active Project
          </Typography>
          <Box
            onClick={() => navigate('/dashboard')}
            sx={{
              p: 1.5, borderRadius: 2, cursor: 'pointer',
              border: `1px solid ${alpha(BRAND.amber, 0.3)}`,
              background: alpha(BRAND.amber, 0.05),
              '&:hover': { background: alpha(BRAND.amber, 0.1) },
              transition: 'all 0.2s',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: BRAND.textPrimary, mb: 0.3 }} noWrap>
              {activeProj.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Circle sx={{ fontSize: 8, color: activeProj.status === 'at-risk' ? BRAND.red : BRAND.green }} />
              <Typography sx={{ fontSize: '0.7rem', color: BRAND.textMuted }}>
                {activeProj.completion}% complete
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1, py: 1 }}>
        {NAV_GROUPS.map((group) => {
          if (group.projectRequired && !projectId) return null;
          return (
            <Box key={group.label} sx={{ mb: 2 }}>
              <Typography sx={{
                px: 1.5, mb: 0.5, fontSize: '0.65rem', fontWeight: 700,
                color: BRAND.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {group.label}
              </Typography>
              {group.items.map((item) => {
                const active = isActive(item.path, group.projectRequired);
                return (
                  <ListItemButton
                    key={item.label}
                    onClick={() => navigateTo(item.path, group.projectRequired)}
                    sx={{
                      borderRadius: 2, mb: 0.25, px: 1.5, py: 0.9,
                      background: active ? alpha(BRAND.amber, 0.12) : 'transparent',
                      '&:hover': { background: active ? alpha(BRAND.amber, 0.15) : alpha('#fff', 0.04) },
                      transition: 'all 0.15s',
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 32,
                      color: active ? '#ffffff' : alpha('#fff', 0.6),
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? '#ffffff' : alpha('#fff', 0.7),
                      }}
                    />
                    <ModuleBadge module={item.module} badge={item.badge} />
                  </ListItemButton>
                );
              })}
            </Box>
          );
        })}
      </Box>

      <Divider />

      {/* User Profile */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{
          width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700,
          background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.skyDark})`,
        }}>
          {user?.avatar}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#ffffff' }} noWrap>
            {user?.name}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: alpha('#fff', 0.6), textTransform: 'capitalize' }} noWrap>
            {user?.role} · {user?.company}
          </Typography>
        </Box>
        <Tooltip title="Settings">
          <IconButton size="small" sx={{ color: alpha('#fff', 0.6) }}>
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { projectId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { activeProject} = useProjectStore();
  useEffect(() => { useProjectStore.getState().fetchProjects(); }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: BRAND.navy, overflow: 'hidden' }}>
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          <SidebarContent projectId={projectId} />
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <SidebarContent projectId={projectId} onClose={() => setMobileOpen(false)} />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* TopBar */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: BRAND.textPrimary, mr: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
            {activeProject && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: BRAND.textMuted, display: { xs: 'none', sm: 'block' } }}>
                  {activeProject.name}
                </Typography>
                <Chip
                  icon={<Circle sx={{ fontSize: '8px !important' }} />}
                  label={activeProject.status === 'at-risk' ? 'At Risk' : 'Active'}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: activeProject.status === 'at-risk'
                      ? alpha(BRAND.red, 0.15)
                      : alpha(BRAND.green, 0.15),
                    color: activeProject.status === 'at-risk' ? BRAND.red : BRAND.green,
                    borderColor: activeProject.status === 'at-risk'
                      ? alpha(BRAND.red, 0.3)
                      : alpha(BRAND.green, 0.3),
                    border: '1px solid',
                  }}
                />
              </Box>
            )}

            <Box sx={{ flex: 1 }} />

            <Tooltip title="Notifications">
              <IconButton sx={{ color: BRAND.textSecondary }}>
                <Badge badgeContent={3} color="error">
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <Avatar
                onClick={() => { logout(); navigate('/login'); }}
                sx={{
                  width: 32, height: 32, fontSize: '0.75rem', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.skyDark})`,
                  '&:hover': { boxShadow: `0 0 0 2px ${BRAND.amber}` },
                  transition: 'box-shadow 0.2s',
                }}
              />
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
          bgcolor: BRAND.navy,
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
