import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '@/stores/projectStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setActiveProject, activeProjectDetails } = useProjectStore();

  useEffect(() => {
    if (projectId && (!activeProjectDetails || activeProjectDetails.id !== projectId)) {
      setActiveProject(projectId);
    }
  }, [projectId, activeProjectDetails, setActiveProject]);

  if (!activeProjectDetails) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  const { name, description, members } = activeProjectDetails;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        <p className="text-muted-foreground mt-1 text-lg">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.userId} className="text-sm">{member.userId} - ({member.roles.join(', ')})</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailsPage;