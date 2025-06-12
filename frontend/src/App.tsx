// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// Layout Components
import TopBar from '@/components/layout/TopBar';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Page Components
import DashboardPage from '@/pages/DashboardPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pt-[var(--header-height,64px)]">
        <Routes>
          {/* Routes WITHOUT the main sidebar */}
          <Route path="/" element={<DashboardPage />} />
          
          {/* Routes WITH the main sidebar */}
          <Route element={<SidebarLayout />}>
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* All other context-aware routes will go here */}
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;