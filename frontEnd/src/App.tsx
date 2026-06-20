/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './features/navigation/components/Sidebar';
import { BottomNavBar } from './features/navigation/components/BottomNavBar';
import { MainContent } from './features/dashboard/components/MainContent';

export default function App() {
  const [activeId, setActiveId] = useState('people');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div id="app-root-shell" dir="rtl" className="flex h-screen w-screen overflow-hidden bg-neutral-50/50 text-neutral-800 font-sans antialiased">
      {/* Feature-based Sidebar - Red & White Theme */}
      <Sidebar 
        activeId={activeId} 
        onActiveIdChange={setActiveId} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Workspace Area */}
      <MainContent activeId={activeId} />

      {/* Responsive Bottom Navigation Bar */}
      <BottomNavBar activeId={activeId} onActiveIdChange={setActiveId} />
    </div>
  );
}

