// src/components/layout/Sidebar.tsx
import React, { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import ContextSwitcher from '@/components/layout/ContextSwitcher';
import NavMenu, { NavItem } from '@/components/layout/NavMenu';
import useAuthStore from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
//prettier-ignore
import { PiHouseDuotone, PiListChecksDuotone, PiSquaresFourDuotone, PiUsersThreeDuotone, PiGearSixDuotone, PiChartBarDuotone, PiX } from 'react-icons/pi';

const Sidebar: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { user, activeProjectRoles, setProjectRoles } = useAuthStore();
    const { activeProjectDetails, setActiveProject } = useProjectStore();
    const { isSidebarOpen, setSidebarOpen } = useUiStore();

    useEffect(() => {
        // Ensure the active project in the store matches the URL param
        if (projectId && (!activeProjectDetails || activeProjectDetails.id !== projectId)) {
            setActiveProject(projectId);
        }
    }, [projectId, activeProjectDetails, setActiveProject]);

    useEffect(() => {
        if (user && activeProjectDetails) {
            const memberInfo = activeProjectDetails.members.find(m => m.userId === user.id);
            setProjectRoles(memberInfo ? memberInfo.roles : []);
        } else {
            setProjectRoles([]);
        }
    }, [activeProjectDetails, user, setProjectRoles]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSidebarOpen && window.innerWidth < 1024) {
                const sidebar = document.getElementById('mobile-sidebar');
                if (sidebar && !sidebar.contains(event.target as Node)) {
                    setSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, setSidebarOpen]);

    const projectNavItems: NavItem[] = [
        { id: 'overview', path: `/project/${projectId}/overview`, label: 'Overview', icon: PiHouseDuotone },
        { id: 'submissions', path: `/project/${projectId}/submissions`, label: 'Data Submissions', icon: PiListChecksDuotone, roles: ['DataEntry', 'Researcher', 'ProjectLead'] },
        { id: 'builder', path: `/project/${projectId}/builder`, label: 'Form Builder', icon: PiSquaresFourDuotone, roles: ['FormDesigner', 'ProjectLead'] },
        { id: 'members', path: `/project/${projectId}/members`, label: 'Members & Roles', icon: PiUsersThreeDuotone, roles: ['ProjectLead'] },
        { id: 'reports', path: `/project/${projectId}/reports`, label: 'Data & Reports', icon: PiChartBarDuotone, roles: ['Researcher', 'ProjectLead'] },
        { id: 'settings', path: `/project/${projectId}/settings`, label: 'Project Settings', icon: PiGearSixDuotone, roles: ['ProjectLead'] },
    ];

    const visibleNavItems = projectNavItems.filter(item =>
        !item.roles || item.roles.some(role => activeProjectRoles.includes(role))
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                id="mobile-sidebar"
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r transition-transform duration-300 ease-in-out",
                    "pt-[var(--header-height)]",
                    // Mobile: slide in from left, Desktop: always visible
                    "w-64 lg:w-64",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent lg:hidden z-10"
                    aria-label="Close sidebar"
                >
                    <PiX className="h-5 w-5" />
                </button>

                <div className="h-full overflow-y-auto scrollbar-hide">
                    <div className="px-3 py-4">
                        <ContextSwitcher />
                        <NavMenu items={visibleNavItems} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;