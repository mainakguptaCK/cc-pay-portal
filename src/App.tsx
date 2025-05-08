import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CreditCardProvider } from './context/CreditCardContext';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/Dashboard';
import CardManagement from './pages/customer/CardManagement';
import Transactions from './pages/customer/Transactions';
import Payments from './pages/customer/Payments';
import Rewards from './pages/customer/Rewards';
import Statements from './pages/customer/Statements';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PortalNotices from './pages/admin/PortalNotices';
import CreditDecisions from './pages/admin/CreditDecisions';
import FeesManagement from './pages/admin/FeesManagement';
import AuthGuard from './components/shared/AuthGuard';
import RoleBasedRedirect from './context/RoleBasedRedirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CreditCardProvider>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<RoleBasedRedirect />} />

                <Route path="/login" element={<Login />} />

                {/* Customer Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AuthGuard>
                      <CustomerDashboard />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/cards" 
                  element={
                    <AuthGuard>
                      <CardManagement />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <AuthGuard>
                      <Transactions />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/payment" 
                  element={
                    <AuthGuard>
                      <Payments />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/rewards" 
                  element={
                    <AuthGuard>
                      <Rewards />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/statements" 
                  element={
                    <AuthGuard>
                      <Statements />
                    </AuthGuard>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AuthGuard requireAdmin>
                      <AdminDashboard />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AuthGuard requireAdmin>
                      <UserManagement />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/admin/notices" 
                  element={
                    <AuthGuard requireAdmin>
                      <PortalNotices />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/admin/decisions" 
                  element={
                    <AuthGuard requireAdmin>
                      <CreditDecisions />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/admin/fees" 
                  element={
                    <AuthGuard requireAdmin>
                      <FeesManagement />
                    </AuthGuard>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CreditCardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;