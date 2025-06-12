// src/components/layout/SidebarLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

const SidebarLayout: React.FC = () => {
  return (
    <div className="relative flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64"> {/* This padding must match the sidebar width */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;