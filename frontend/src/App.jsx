import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Loading from './components/common/Loading';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ReservationsPage from './pages/ReservationsPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import NotFoundPage from './pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Routes with Layout */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                />
                <Route
                  path="/restaurants/:slug"
                  element={
                    <Layout>
                      <RestaurantPage />
                    </Layout>
                  }
                />

                {/* Protected Routes with Layout */}
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/reservations"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <ReservationsPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <AddressesPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <Layout>
                      <ProtectedRoute>
                        <SupportPage />
                      </ProtectedRoute>
                    </Layout>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
