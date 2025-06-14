// src/pages/ProjectsListPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import useAuthStore from '@/stores/authStore';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { PiListMagnifyingGlassDuotone, PiPlusCircleDuotone } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types';

const ProjectsListPage: React.FC = () => {
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="My Projects"
        subtitle="Select a project to enter its workspace or create a new one."
        icon={PiListMagnifyingGlassDuotone}
        gradient="secondary"
      >
        <Button onClick={() => navigate('/create-project')}>
          <PiPlusCircleDuotone className="mr-2 h-5 w-5" />
          Create New Project
        </Button>
      </PageHeader>
      
      {isLoading && <p className="text-muted-foreground">Loading projects...</p>}
      
      {!isLoading && userProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-muted-foreground">You are not a member of any projects yet.</p>
      )}
    </div>
  );
};

export default ProjectsListPage;