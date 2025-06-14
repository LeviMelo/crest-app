// src/components/dashboard/ProjectCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types';
import { useProjectStore } from '@/stores/projectStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PiArrowRight, PiUsersDuotone } from 'react-icons/pi';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const setActiveProject = useProjectStore(state => state.setActiveProject);

  const handleProjectClick = () => {
    setActiveProject(project.id);
    navigate(`/project/${project.id}/overview`);
  };

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription className="line-clamp-3 min-h-[60px]">{project.description}</CardDescription>
      </CardHeader>
      
      {/* This content area is now a flexible spacer that will grow */}
      <CardContent className="flex-grow" />

      {/* 
        THE FIX: 
        1. mt-auto pushes this entire footer to the bottom of the card.
        2. flex, items-center, and justify-between align the members count and the button.
      */}
      <CardFooter className="mt-auto flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center">
            <PiUsersDuotone className="mr-2"/>
            {project.members.length} Members
        </p>
        <Button onClick={handleProjectClick} variant="secondary" className="group">
          View Project
          <PiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;