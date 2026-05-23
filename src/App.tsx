import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { telemetryService } from './services/telemetryService';
import GlobalLoader from './components/shared/GlobalLoader';
import RouteLoader from './components/shared/RouteLoader';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import { analyticsEngine } from './services/analyticsEngine';

// Lazy Load Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const AssetsPage = lazy(() => import('./pages/AssetsPage'));
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const IncidentsPage = lazy(() => import('./pages/IncidentsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CCTVPage = lazy(() => import('./pages/CCTVPage'));
const WorkforcePage = lazy(() => import('./pages/WorkforcePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DispatchDashboardPage = lazy(() => import('./pages/DispatchDashboardPage'));

// New Dashboard Hubs
const FacilityDashboard = lazy(() => import('./pages/dashboards/FacilityDashboard'));
const FleetDashboard = lazy(() => import('./pages/dashboards/FleetDashboard'));
const CCTVDashboard = lazy(() => import('./pages/dashboards/CCTVDashboard'));
const DriverDashboard = lazy(() => import('./pages/dashboards/DriverDashboard'));
const CitizenDashboard = lazy(() => import('./pages/dashboards/CitizenDashboard'));

import { useAuthStore } from './store/authStore';

const DashboardRedirect = () => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'SUPER_ADMIN': return <Navigate to="/admin-dashboard" replace />;
    case 'FACILITY_MANAGER': return <Navigate to="/facility-dashboard" replace />;
    case 'FLEET_MANAGER': return <Navigate to="/fleet-dashboard" replace />;
    case 'DISPATCH_OPERATOR': return <Navigate to="/dispatch-dashboard" replace />;
    case 'FLEET_SUPERVISOR': return <Navigate to="/dispatch-dashboard" replace />;
    case 'CCTV_OPERATOR': return <Navigate to="/cctv-dashboard" replace />;
    case 'DRIVER': return <Navigate to="/driver-dashboard" replace />;
    case 'CITIZEN': return <Navigate to="/citizen-dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

export default function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      telemetryService.connect();
      analyticsEngine.start();
    } else {
      telemetryService.disconnect();
      analyticsEngine.stop();
    }
    
    return () => {
      telemetryService.disconnect();
      analyticsEngine.stop();
    };
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <GlobalLoader />}
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardRedirect />} />
          </Route>

          {/* SUPER_ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/admin-dashboard" element={<RootLayout><DashboardPage /></RootLayout>} />
            <Route path="/fleet" element={<RootLayout><RoutesPage /></RootLayout>} />
            <Route path="/bins" element={<RootLayout><AssetsPage /></RootLayout>} />
            <Route path="/facilities" element={<RootLayout><FacilitiesPage /></RootLayout>} />
            <Route path="/incidents" element={<RootLayout><IncidentsPage /></RootLayout>} />
            <Route path="/analytics" element={<RootLayout><AnalyticsPage /></RootLayout>} />
            <Route path="/simulation" element={<RootLayout><SimulationPage /></RootLayout>} />
            <Route path="/reports" element={<RootLayout><ReportsPage /></RootLayout>} />
            <Route path="/cctv-wall" element={<RootLayout><CCTVPage /></RootLayout>} />
            <Route path="/workforce" element={<RootLayout><WorkforcePage /></RootLayout>} />
            <Route path="/admin" element={<RootLayout><AdminPage /></RootLayout>} />
          </Route>

          {/* FACILITY_MANAGER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['FACILITY_MANAGER', 'SUPER_ADMIN']} />}>
            <Route path="/facility-dashboard" element={<RootLayout><FacilityDashboard /></RootLayout>} />
            <Route path="/facility-incidents" element={<RootLayout><IncidentsPage /></RootLayout>} />
            <Route path="/facility-workforce" element={<RootLayout><WorkforcePage /></RootLayout>} />
            <Route path="/facility-analytics" element={<RootLayout><AnalyticsPage /></RootLayout>} />
          </Route>

          {/* FLEET_MANAGER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SUPER_ADMIN', 'DISPATCH_OPERATOR', 'FLEET_SUPERVISOR']} />}>
            <Route path="/fleet-dashboard" element={<RootLayout><FleetDashboard /></RootLayout>} />
            <Route path="/dispatch-dashboard" element={<DispatchDashboardPage />} />
            <Route path="/fleet-routes" element={<RootLayout><RoutesPage /></RootLayout>} />
            <Route path="/fleet-analytics" element={<RootLayout><AnalyticsPage /></RootLayout>} />
          </Route>

          {/* CCTV_OPERATOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['CCTV_OPERATOR', 'SUPER_ADMIN']} />}>
            <Route path="/cctv-dashboard" element={<RootLayout><CCTVDashboard /></RootLayout>} />
          </Route>
          
          {/* DRIVER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['DRIVER', 'SUPER_ADMIN']} />}>
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
          </Route>

          {/* CITIZEN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['CITIZEN', 'SUPER_ADMIN']} />}>
            <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          </Route>

          <Route path="*" element={<DashboardRedirect />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
