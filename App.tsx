
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Role } from './types';
import { ToastContainer } from 'react-toastify';

// Layouts & Pages
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import StoreFront from './pages/StoreFront';
import AdminDashboard from './pages/AdminDashboard';
import ClientOrders from './pages/ClientOrders';
import ClientProfile from './pages/ClientProfile';
import CakeStudio from './pages/CakeStudio';
import KitchenDisplay from './pages/KitchenDisplay';
import AdminInventory from './pages/AdminInventory';
import Logistics from './pages/Logistics';
import Login from './pages/Login';

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: Role[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-void">
        <div className="w-12 h-12 border-2 border-atelier-900 border-t-neon-green rounded-full animate-spin"></div>
        <p className="mt-8 text-[10px] font-mono text-atelier-500 uppercase tracking-[0.5em]">Decrypting_Access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Pro-fix: If not allowed here, send to their natural habitat instead of just /
    const fallback = 
      user.role === Role.ADMIN ? '/admin' : 
      user.role === Role.BAKER ? '/kds' : 
      user.role === Role.DRIVER ? '/logistics' : '/';
    
    // Only navigate if we aren't already there to prevent infinite loops
    if (location.pathname !== fallback) {
      return <Navigate to={fallback} replace />;
    }
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-void text-gray-200 font-sans selection:bg-neon-green selection:text-black">
      <div className="relative z-10">
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <main className="animate-fadeIn">{children}</main>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Default/Store Route */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[Role.CLIENT, Role.ADMIN]}>
          <AppLayout><StoreFront /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/studio" element={
        <ProtectedRoute allowedRoles={[Role.CLIENT, Role.ADMIN]}>
          <AppLayout><CakeStudio /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={[Role.CLIENT, Role.ADMIN]}>
          <AppLayout><ClientOrders /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={[Role.CLIENT, Role.ADMIN]}>
          <AppLayout><ClientProfile /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Admin Central */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={[Role.ADMIN]}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={[Role.ADMIN]}>
          <AppLayout><AdminInventory /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Baker/Production Central */}
      <Route path="/kds" element={
        <ProtectedRoute allowedRoles={[Role.ADMIN, Role.BAKER]}>
          <AppLayout><KitchenDisplay /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Logistics Central */}
      <Route path="/logistics" element={
        <ProtectedRoute allowedRoles={[Role.ADMIN, Role.DRIVER]}>
          <AppLayout><Logistics /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <AppContent />
          <ToastContainer 
            position="bottom-right" 
            autoClose={3000} 
            theme="dark"
            toastStyle={{ backgroundColor: '#171717', border: '1px solid #ffffff10', fontFamily: 'JetBrains Mono', fontSize: '10px' }}
          />
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}
