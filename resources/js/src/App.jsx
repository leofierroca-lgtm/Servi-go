import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Views
import LandingView from './views/LandingView';
import HomeView from './views/HomeView';
import ProviderProfileView from './views/ProviderProfileView';
import DeliveryProfileView from './views/DeliveryProfileView';
import ChatView from './views/ChatView';
import AdminDashboard from './views/AdminDashboard';
import AdminNegocios from './views/AdminNegocios';
import AdminUsuarios from './views/AdminUsuarios';
import AdminReportes from './views/AdminReportes';
import AdminAjustes from './views/AdminAjustes';
import RegisterBusinessView from './views/RegisterBusinessView';
import InteractiveMap from './components/InteractiveMap';
import AuthModal from './components/AuthModal';

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const role = useAuthStore((state) => state.role);
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected Route Component for Delivery
const DeliveryProtectedRoute = ({ children }) => {
  const role = useAuthStore((state) => state.role);
  if (role !== 'delivery') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected Route for non-delivery users
const ClientProtectedRoute = ({ children }) => {
  const role = useAuthStore((state) => state.role);
  if (role === 'delivery') {
    return <Navigate to="/delivery" replace />;
  }
  return children;
};

function App() {
  // 10-Minute Inactivity Auto-Lock Detector
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

    const handleUserActivity = () => {
      const { isAuthenticated, touchActivity, lockSession } = useAuthStore.getState();
      if (isAuthenticated) {
        touchActivity();
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (useAuthStore.getState().isAuthenticated) {
            lockSession();
          }
        }, INACTIVITY_LIMIT_MS);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));

    handleUserActivity();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* 
        El AuthModal se mantiene en la raíz (afuera de los layouts) 
        para que pueda sobreponerse sobre cualquier ruta si se dispara 
        el login manual o el autolock.
      */}
      <AuthModal />
      
      <Routes>
        {/* Rutas Públicas & Cliente (MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ClientProtectedRoute><HomeView /></ClientProtectedRoute>} />
          <Route path="/map" element={<ClientProtectedRoute><InteractiveMap /></ClientProtectedRoute>} />
          <Route path="/provider/:id" element={<ClientProtectedRoute><ProviderProfileView /></ClientProtectedRoute>} />
          <Route path="/register-business" element={<ClientProtectedRoute><RegisterBusinessView /></ClientProtectedRoute>} />
          <Route path="/chat" element={<ClientProtectedRoute><ChatView /></ClientProtectedRoute>} />
          <Route path="/delivery" element={<DeliveryProtectedRoute><DeliveryProfileView /></DeliveryProtectedRoute>} />
        </Route>

        {/* Rutas Exclusivas de Administración (AdminLayout) */}
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          {/* Al entrar a /admin, renderiza el Dashboard por defecto */}
          <Route index element={<AdminDashboard />} />
          <Route path="negocios" element={<AdminNegocios />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="ajustes" element={<AdminAjustes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
