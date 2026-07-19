/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './features/navigation/components/Sidebar';
import { BottomNavBar } from './features/navigation/components/BottomNavBar';
import { MainContent } from './features/dashboard/components/MainContent';
import { MainPage } from './features/mainpage/components/MainPage';
import { PeopleManagement } from './features/personal/components/PeopleManagement';
import { ExportsManagement } from './features/export/components/ExportsManagement';
import { ImportsManagement } from './features/import/components/ImportsManagement';
import { ReportsManagement } from './features/report/components/ReportsManagement';
import { ProfilePage } from './features/profile/components/ProfilePage';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { LoginPage } from './features/auth/components/LoginPage';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div id="app-root-shell" dir="rtl" className="flex h-screen w-screen overflow-hidden bg-neutral-50/50 text-neutral-800 font-sans antialiased">
      {isAuthenticated && (
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      )}

      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainContent />}>
            <Route path="/" element={<Navigate to="/people" replace />} />
            <Route path="/dashboard" element={<MainPage />} />
            <Route path="/people" element={<PeopleManagement />} />
            <Route path="/exports" element={<ExportsManagement />} />
            <Route path="/imports" element={<ImportsManagement />} />
            <Route path="/reports" element={<ReportsManagement />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/people" replace />} />
          </Route>
        </Route>
      </Routes>

      {isAuthenticated && <BottomNavBar />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

