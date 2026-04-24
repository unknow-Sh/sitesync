import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveDashboard from './pages/LiveDashboard';
import LabourTracker from './pages/LabourTracker';
import MaterialLog from './pages/MaterialLog';
import Milestones from './pages/Milestones';
import BudgetTracker from './pages/BudgetTracker';
import RiskEngine from './pages/RiskEngine';
import Subcontractors from './pages/Subcontractors';
import DocumentVault from './pages/DocumentVault';
import EquipmentTracker from './pages/EquipmentTracker';
import ClientReport from './pages/ClientReport';

gsap.registerPlugin(ScrollTrigger);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Project Modules */}
      <Route path="/projects/:projectId/dashboard" element={<ProtectedRoute><LiveDashboard /></ProtectedRoute>} />
      <Route path="/projects/:projectId/labour" element={<ProtectedRoute><LabourTracker /></ProtectedRoute>} />
      <Route path="/projects/:projectId/materials" element={<ProtectedRoute><MaterialLog /></ProtectedRoute>} />
      <Route path="/projects/:projectId/milestones" element={<ProtectedRoute><Milestones /></ProtectedRoute>} />
      <Route path="/projects/:projectId/budget" element={<ProtectedRoute><BudgetTracker /></ProtectedRoute>} />
      <Route path="/projects/:projectId/risk" element={<ProtectedRoute><RiskEngine /></ProtectedRoute>} />
      <Route path="/projects/:projectId/subcontractors" element={<ProtectedRoute><Subcontractors /></ProtectedRoute>} />
      <Route path="/projects/:projectId/documents" element={<ProtectedRoute><DocumentVault /></ProtectedRoute>} />
      <Route path="/projects/:projectId/equipment" element={<ProtectedRoute><EquipmentTracker /></ProtectedRoute>} />
      <Route path="/projects/:projectId/report" element={<ProtectedRoute><ClientReport /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
