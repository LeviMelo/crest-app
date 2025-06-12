// src/pages/ProjectDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '@/stores/projectStore';
import InfoWidget from '@/components/project/InfoWidget';
import { PageHeader } from '@/components/ui/PageHeader';
import { PiUsersDuotone, PiFlagDuotone, PiHourglassSimpleDuotone, PiChartBarDuotone, PiFileTextDuotone } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setActiveProject, activeProjectDetails, isLoading } = useProjectStore();

  useEffect(() => {
    if (projectId && (!activeProjectDetails || activeProjectDetails.id !== projectId)) {
      setActiveProject(projectId);
    }
  }, [projectId, activeProjectDetails, setActiveProject]);
  
  if (isLoading && !activeProjectDetails) {
    return <div className="text-center"><p className="text-muted-foreground">Loading project details...</p></div>;
  }
  
  if (!activeProjectDetails) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold text-destructive">Project Not Found</h1>
        <p className="text-muted-foreground mt-2">Could not load details for project ID '{projectId}'.</p>
        <Button variant="outline" onClick={() => navigate('/')} className="mt-6">Back to Dashboard</Button>
      </div>
    );
  }

  const { name, description, members, goals } = activeProjectDetails;

  return (
    <div className="space-y-6">
      <PageHeader
        title={name}
        subtitle={description}
        icon={PiFileTextDuotone}
        gradient="secondary"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InfoWidget title="Data Status" icon={PiChartBarDuotone}>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">Total Submissions (Mock)</p>
        </InfoWidget>
        <InfoWidget title="Team Members" icon={PiUsersDuotone}>
           <div className="text-2xl font-bold">{members.length}</div>
           <p className="text-xs text-muted-foreground">Active Collaborators</p>
        </InfoWidget>
        <InfoWidget title="Project Phase" icon={PiHourglassSimpleDuotone}>
            <div className="text-2xl font-bold">Data Collection</div>
           <p className="text-xs text-muted-foreground">Current Status (Mock)</p>
        </InfoWidget>
         <InfoWidget title="Goals" icon={PiFlagDuotone}>
            <div className="text-2xl font-bold">3</div>
           <p className="text-xs text-muted-foreground">Primary Objectives (Mock)</p>
        </InfoWidget>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <InfoWidget title="Project Goals" icon={PiFlagDuotone}>
             <p className="text-sm text-foreground whitespace-pre-wrap">{goals || 'No goals specified for this project.'}</p>
           </InfoWidget>
        </div>
        <div className="lg:col-span-1">
          <InfoWidget title="Team Members" icon={PiUsersDuotone}>
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.userId} className="flex items-center">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.userId)}&background=random&size=32&color=fff&font-size=0.40&bold=true`} alt={member.userId} className="w-8 h-8 rounded-full mr-3"/>
                  <div>
                    <p className="text-sm font-medium">{member.userId}</p>
                    <p className="text-xs text-muted-foreground">{member.roles.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoWidget>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;