import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Properties from './pages/Properties/Properties';
import PropertyForm from './pages/Properties/PropertyForm';
import ViewProperty from './pages/Properties/ViewProperty';
import PropertyTypes from './pages/Properties/PropertyTypes';
import Users from './pages/Users/Users';
import AddUser from './pages/Users/AddUser';
import ViewUser from './pages/Users/ViewUser';
import EditUser from './pages/Users/EditUser';
import UsersByType from './pages/Users/UsersByType';
import Promotions from './pages/Promotions/Promotions';
import PromotionForm from './pages/Promotions/PromotionForm';
import PromotionDetail from './pages/Promotions/PromotionDetail';
import PromoCodes from './pages/Promotions/PromoCodes';
import PromotionAnalytics from './pages/Promotions/PromotionAnalytics';
import Transactions from './pages/Transactions/Transactions';
import Inquiries from './pages/Inquiries/Inquiries';
import InquiryDetail from './pages/Inquiries/InquiryDetail';
import Payments from './pages/Payments/Payments';
import Reports from './pages/Reports/Reports';
import SalesReport from './pages/Reports/SalesReport';
import UserReport from './pages/Reports/UserReport';
import PropertyReport from './pages/Reports/PropertyReport';
import Settings from './pages/Settings/Settings';
import Roles from './pages/Roles/Roles';
import RoleForm from './pages/Roles/RoleForm';
import RoleDetail from './pages/Roles/RoleDetail';
import AffiliateApplications from './pages/Referrals/AffiliateApplications';
import ApplicationDetail from './pages/Referrals/ApplicationDetail';
import ActiveAffiliates from './pages/Referrals/ActiveAffiliates';
import CommissionRules from './pages/Referrals/CommissionRules';
import PayoutManagement from './pages/Referrals/PayoutManagement';
import ReferralReports from './pages/Referrals/ReferralReports';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Profile/ChangePassword';
import ActivityLogs from './pages/Profile/ActivityLogs';
import Login from './pages/Auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './App.css';

// Theme Handler Component
const ThemeHandler = () => {
  const { updateTheme } = useTheme();
  
  React.useEffect(() => {
    window.updateTheme = updateTheme;
    return () => {
      delete window.updateTheme;
    };
  }, [updateTheme]);
  
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public Route Component (for login page)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#ff4b4b',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <ThemeHandler />
                  <NavigationProvider>
                    <Layout>
                      <Routes>
                      {/* Dashboard */}
                      <Route path="/admin" element={<Dashboard />} />
                      <Route path="/admin/dashboard" element={<Dashboard />} />
                      
                      {/* Properties */}
                      <Route path="/admin/properties" element={<Properties />} />
                      <Route path="/admin/properties/add" element={<PropertyForm />} />
                      <Route path="/admin/properties/view/:id" element={<ViewProperty />} />
                      <Route path="/admin/properties/edit/:id" element={<PropertyForm />} />
                      <Route path="/admin/properties/types" element={<PropertyTypes />} />
                      
                      {/* Users */}
                      <Route path="/admin/users" element={<Users />} />
                      <Route path="/admin/users/add" element={<AddUser />} />
                      <Route path="/admin/users/view/:id" element={<ViewUser />} />
                      <Route path="/admin/users/edit/:id" element={<EditUser />} />
                      <Route path="/admin/users/:type" element={<UsersByType />} />
                      
                      {/* Promotions */}
                      <Route path="/admin/promotions" element={<Promotions />} />
                      <Route path="/admin/promotions/add" element={<PromotionForm />} />
                      <Route path="/admin/promotions/edit/:id" element={<PromotionForm />} />
                      <Route path="/admin/promotions/view/:id" element={<PromotionDetail />} />
                      <Route path="/admin/promotions/codes" element={<PromoCodes />} />
                      <Route path="/admin/promotions/analytics" element={<PromotionAnalytics />} />
                      
                      {/* Transactions */}
                      <Route path="/admin/transactions" element={<Transactions />} />
                      
                      {/* Inquiries */}
                      <Route path="/admin/inquiries" element={<Inquiries />} />
                      <Route path="/admin/inquiries/:id" element={<InquiryDetail />} />
                      
                      {/* Payments */}
                      <Route path="/admin/payments" element={<Payments />} />
                      
                      {/* Reports */}
                      <Route path="/admin/reports" element={<Reports />} />
                      <Route path="/admin/reports/sales" element={<SalesReport />} />
                      <Route path="/admin/reports/users" element={<UserReport />} />
                      <Route path="/admin/reports/properties" element={<PropertyReport />} />
                      
                      {/* Roles */}
                      <Route path="/admin/roles" element={<Roles />} />
                      <Route path="/admin/roles/create" element={<RoleForm />} />
                      <Route path="/admin/roles/edit/:id" element={<RoleForm />} />
                      <Route path="/admin/roles/:id" element={<RoleDetail />} />
                      
                      {/* Referral Management */}
                      <Route path="/admin/referrals/applications" element={<AffiliateApplications />} />
                      <Route path="/admin/referrals/applications/:id" element={<ApplicationDetail />} />
                      <Route path="/admin/referrals/affiliates" element={<ActiveAffiliates />} />
                      <Route path="/admin/referrals/commission" element={<CommissionRules />} />
                      <Route path="/admin/referrals/payouts" element={<PayoutManagement />} />
                      <Route path="/admin/referrals/reports" element={<ReferralReports />} />
                      
                      {/* Settings */}
                      <Route path="/admin/settings" element={<Settings />} />
                      
                      {/* Profile */}
                      <Route path="/admin/profile" element={<Profile />} />
                      <Route path="/admin/profile/edit" element={<EditProfile />} />
                      <Route path="/admin/profile/change-password" element={<ChangePassword />} />
                      <Route path="/admin/profile/activity" element={<ActivityLogs />} />
                      
                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/admin" />} />
                    </Routes>
                  </Layout>
                  </NavigationProvider>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;