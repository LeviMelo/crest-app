import React from 'react';
import { useParams } from 'react-router-dom';
import ContextSwitcher from './ContextSwitcher';
import NavMenu from './NavMenu';
import useAuthStore from '@/stores/authStore';
import { PiGaugeDuotone, PiGearDuotone, PiHouseDuotone, PiListChecksDuotone, PiSquaresFourDuotone, PiUsersDuotone } from 'react-icons/pi';

const Sidebar: React.FC = () => {
  const { projectId } = useParams();
  const { activeProjectRoles } = useAuthStore();

  const projectNavItems = [
    { id: 'overview', path: `/project/${projectId}`, label: 'Overview', icon: PiHouseDuotone },
    { id: 'submission', path: `/project/${projectId}/submission`, label: 'Data Submission', icon: PiListChecksDuotone, roles: ['Researcher', 'DataEntry'] },
    { id: 'builder', path: `/project/${projectId}/builder`, label: 'Form Builder', icon: PiSquaresFourDuotone, roles: ['ProjectLead', 'FormDesigner'] },
    { id: 'roles', path: `/project/${projectId}/roles`, label: 'Role Editor', icon: PiUsersDuotone, roles: ['ProjectLead'] },
  ];

  const globalNavItems = [
    { id: 'dashboard', path: `/`, label: 'Dashboard', icon: PiGaugeDuotone },
    { id: 'settings', path: '/settings', label: 'Settings', icon: PiGearDuotone },
  ];
  
  const navItems = projectId
    ? projectNavItems.filter(item => !item.roles || item.roles.some(role => activeProjectRoles.includes(role)))
    : globalNavItems;

  return (
    <aside className="fixed top-[var(--header-height)] left-0 z-30 w-64 h-screen border-r border-border bg-card transition-transform -translate-x-full lg:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ContextSwitcher />
        <NavMenu items={navItems} />
      </div>
    </aside>
  );
};

export default Sidebar;