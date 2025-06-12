// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import useAuthStore from '@/stores/authStore';
import ProjectCard from '@/components/dashboard/ProjectCard';
import DashboardGreetingCard from '@/components/dashboard/DashboardGreetingCard';
import { Button } from '@/components/ui/Button';
import { PiUsersDuotone } from 'react-icons/pi';
import { Project } from '@/types';

const DashboardPage: React.FC = () => {
  const { availableProjects, fetchAvailableProjects, isLoading } = useProjectStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableProjects();
    }
  }, [isAuthenticated, fetchAvailableProjects]);
  
  const userProjects = user
    ? availableProjects.filter((p: Project) => p.members.some((m) => m.userId === user.id))
    : [];

  const handleCreateNewProject = () => navigate('/create-project');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <DashboardGreetingCard onCreateNewProject={handleCreateNewProject} />

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">My Projects</h2>
        {isLoading && userProjects.length === 0 && (
            <p className="text-muted-foreground">Loading projects...</p>
        )}
        {!isLoading && userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-16 bg-card border-2 border-dashed rounded-xl">
              <PiUsersDuotone className="text-5xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No Projects Yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Get started by creating your first research project.</p>
              <Button onClick={handleCreateNewProject} size="lg" variant="gradient">Create a Project</Button>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default DashboardPage;