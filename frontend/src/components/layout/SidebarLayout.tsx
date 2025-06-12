import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const SidebarLayout: React.FC = () => {
  return (
    <div className="relative flex">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;