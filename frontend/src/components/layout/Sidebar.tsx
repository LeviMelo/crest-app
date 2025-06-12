// src/components/layout/Sidebar.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContextSwitcher from '@/components/layout/ContextSwitcher';
import NavMenu, { NavItem } from '@/components/layout/NavMenu';
import useAuthStore from '@/stores/authStore';
import useProjectStore from '@/stores/projectStore';
import { PiGaugeDuotone, PiGearDuotone, PiHouseDuotone, PiListChecksDuotone, PiSquaresFourDuotone, PiUsersDuotone, PiMagnifyingGlassDuotone, PiBellDuotone } from 'react-icons/pi';

const Sidebar: React.FC = () => {
  const { projectId } = useParams();
  const { user, activeProjectRoles, setProjectRoles } = useAuthStore();
  const { activeProjectDetails } = useProjectStore();

  // This effect synchronizes the user's roles for the currently active project into the authStore.
  useEffect(() => {
    if (user && activeProjectDetails) {
      const memberInfo = activeProjectDetails.members.find(m => m.userId === user.id);
      setProjectRoles(memberInfo ? memberInfo.roles : []);
    } else {
      setProjectRoles([]);
    }
  }, [activeProjectDetails, user, setProjectRoles]);


  const getNavItems = (): NavItem[] => {
    if (projectId) {
      // Base project navigation structure
      const projectNavStructure: NavItem[] = [
        { id: 'overview', path: `/project/${projectId}`, label: 'Project Overview', icon: PiHouseDuotone },
        {
          id: 'data-collection', label: 'Data Collection', isHeader: true, children: [
            { id: 'submission', path: `/project/${projectId}/submission`, label: 'New Submission', icon: PiListChecksDuotone, roles: ['Researcher', 'DataEntry', 'ProjectLead'] },
            { id: 'search', path: `/project/${projectId}/search`, label: 'Search Patient', icon: PiMagnifyingGlassDuotone, roles: ['Researcher', 'ProjectLead'] },
          ]
        },
        {
          id: 'project-setup', label: 'Project Setup', isHeader: true, children: [
            { id: 'builder', path: `/project/${projectId}/builder`, label: 'Form Builder', icon: PiSquaresFourDuotone, roles: ['ProjectLead', 'FormDesigner'] },
            { id: 'roles', path: `/project/${projectId}/roles`, label: 'Role Editor', icon: PiUsersDuotone, roles: ['ProjectLead'] },
            { id: 'notifications', path: `/project/${projectId}/notifications`, label: 'Notifications', icon: PiBellDuotone, roles: ['ProjectLead'] },
          ]
        },
      ];

      // Recursively filter the navigation items based on the user's roles
      const filterByRole = (items: NavItem[]): NavItem[] => {
        return items.reduce((acc: NavItem[], item) => {
          const hasRole = !item.roles || item.roles.some(role => activeProjectRoles.includes(role));
          
          if (hasRole) {
            if (item.children) {
              const filteredChildren = filterByRole(item.children);
              // Only include headers if they have visible children
              if (filteredChildren.length > 0) {
                acc.push({ ...item, children: filteredChildren });
              }
            } else {
              acc.push(item);
            }
          }
          return acc;
        }, []);
      };

      return filterByRole(projectNavStructure);

    } else {
      // Global Context Navigation (Dashboard, Settings)
      return [
        { id: 'dashboard', path: `/`, label: 'Dashboard', icon: PiGaugeDuotone },
        { id: 'settings', path: '/settings', label: 'Settings', icon: PiGearDuotone },
      ];
    }
  };

  return (
    <aside className="fixed top-[var(--header-height)] left-0 z-30 w-64 h-screen border-r border-border bg-card transition-transform -translate-x-full lg:translate-x-0">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ContextSwitcher />
        <NavMenu items={getNavItems()} />
      </div>
    </aside>
  );
};

export default Sidebar;