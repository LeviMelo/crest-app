// src/components/layout/SidebarLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const SidebarLayout: React.FC = () => {
  const { isSidebarOpen } = useUiStore();

  return (
    <div className="relative flex">
      <Sidebar />
      <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          // On desktop, add padding when sidebar is open, remove it when closed
          isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;