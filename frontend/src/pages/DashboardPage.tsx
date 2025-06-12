import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '@/stores/projectStore';
import useAuthStore from '@/stores/authStore';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { availableProjects, fetchAvailableProjects } = useProjectStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableProjects();
  }, [fetchAvailableProjects]);

  const userProjects = availableProjects.filter(p => p.members.some(m => m.userId === user?.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1">Here's a look at your projects.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">My Projects</h2>
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border rounded-lg">
            <h3 className="text-lg font-semibold">No Projects Yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Get started by creating a new research project.</p>
            <Button onClick={() => navigate('/create-project-placeholder')}>Create Project</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;