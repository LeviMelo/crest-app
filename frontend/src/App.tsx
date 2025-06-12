// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// Layout Components
import TopBar from '@/components/layout/TopBar'; 
import SidebarLayout from '@/components/layout/SidebarLayout';

// Page Components
import DashboardPage from '@/pages/DashboardPage';
import CreateProjectPage from '@/pages/CreateProjectPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import DataSubmissionPage from '@/pages/DataSubmissionPage';
import FormBuilderPage from '@/pages/FormBuilderPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pt-[var(--header-height)]">
        <Routes>
          {/* Routes WITHOUT the main sidebar */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          
          {/* Routes WITH the main sidebar (wrapped in the SidebarLayout) */}
          <Route element={<SidebarLayout />}>
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/project/:projectId/submission" element={<DataSubmissionPage />} />
            <Route path="/project/:projectId/builder" element={<FormBuilderPage />} />
            {/* Future project-specific routes can be added here */}
          </Route>

          {/* Standalone Settings Page */}
          <Route path="/settings" element={<SettingsPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;