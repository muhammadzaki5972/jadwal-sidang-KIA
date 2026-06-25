import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Public Pages
import PublicCalendarPage from './pages/public/PublicCalendarPage';

// Admin Pages
import LoginPage from './pages/auth/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import PemohonPage from './pages/admin/PemohonPage';
import TermohonPage from './pages/admin/TermohonPage';
import JadwalPage from './pages/admin/JadwalPage';
import AgendaPage from './pages/admin/AgendaPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicCalendarPage />} />

        {/* Auth Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pemohon" element={<PemohonPage />} />
          <Route path="termohon" element={<TermohonPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="jadwal" element={<JadwalPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
