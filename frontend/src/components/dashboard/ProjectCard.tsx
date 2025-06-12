import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PiArrowRight } from 'react-icons/pi';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">Members: {project.members.length}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate(`/project/${project.id}`)} className="w-full">
          View Project <PiArrowRight className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;