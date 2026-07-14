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

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <div id="app-root-shell" dir="rtl" className="flex h-screen w-screen overflow-hidden bg-neutral-50/50 text-neutral-800 font-sans antialiased">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />

        <Routes>
          <Route element={<MainContent />}>
            <Route path="/" element={<Navigate to="/people" replace />} />
            <Route path="/dashboard" element={<MainPage />} />
            <Route path="/people" element={<PeopleManagement />} />
            <Route path="/exports" element={<ExportsManagement />} />
            <Route path="/imports" element={<ImportsManagement />} />
            <Route path="/reports" element={<ReportsManagement />} />
            <Route path="*" element={<Navigate to="/people" replace />} />
          </Route>
        </Routes>

        <BottomNavBar />
      </div>
    </Router>
  );
}

