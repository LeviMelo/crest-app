// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Components
import TopBar from '@/components/layout/TopBar';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Top-Level Pages
import DashboardPage from '@/pages/DashboardPage';
import ProjectsListPage from '@/pages/ProjectsListPage';      
import FormsLibraryPage from '@/pages/FormsLibraryPage';
import SettingsPage from '@/pages/SettingsPage';
import CreateProjectPage from '@/pages/CreateProjectPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Project Workspace Pages
import ProjectOverviewPage from '@/pages/project/ProjectOverviewPage';
import DataSubmissionsHubPage from '@/pages/project/DataSubmissionsHubPage';
import ProjectFormBuilderPage from '@/pages/project/ProjectFormBuilderPage';
import ProjectFormBuilderPageV2 from '@/pages/project/ProjectFormBuilderPageV2';
import MembersAndRolesPage from '@/pages/project/MembersAndRolesPage';
import EncounterPage from '@/pages/project/EncounterPage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pt-[var(--header-height)]">
        <Routes>
          {/* --- Global Routes (No Project Sidebar) --- */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/forms" element={<FormsLibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create-project" element={<CreateProjectPage />} />

          {/* --- Project Workspace (With Project Sidebar) --- */}
          <Route element={<SidebarLayout />}>
            <Route path="/project/:projectId/overview" element={<ProjectOverviewPage />} />
            <Route path="/project/:projectId/submissions" element={<DataSubmissionsHubPage />} />
            {/* + ADD ROUTE FOR A NEW ENCOUNTER */}
            <Route path="/project/:projectId/submissions/new" element={<EncounterPage />} />
            {/* + ADD ROUTE FOR AN EXISTING ENCOUNTER */}
            <Route path="/project/:projectId/submissions/:encounterId" element={<EncounterPage />} />
            <Route path="/project/:projectId/builder" element={<ProjectFormBuilderPage />} />
            <Route path="/project/:projectId/builder-v2" element={<ProjectFormBuilderPageV2 />} />
            <Route path="/project/:projectId/members" element={<MembersAndRolesPage />} />
            <Route path="/project/:projectId" element={<ProjectOverviewPage />} />
          </Route>

          {/* --- Catch-all Not Found Route --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;