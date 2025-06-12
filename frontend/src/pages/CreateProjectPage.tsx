// src/pages/CreateProjectPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { useProjectStore } from '@/stores/projectStore';
import useAuthStore from '@/stores/authStore';
import { PiPlus, PiArrowLeft } from 'react-icons/pi';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState('');
  const addProject = useProjectStore(state => state.addProject);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const user = useAuthStore(state => state.user);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }
    setError('');

    const newProject = {
      id: `proj_${new Date().getTime()}`,
      name,
      description,
      goals,
      members: [{ userId: user.id, roles: ['ProjectLead', 'Researcher'] }],
    };
    
    addProject(newProject);
    setActiveProject(newProject.id);
    navigate(`/project/${newProject.id}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="self-start">
        <PiArrowLeft className="mr-2" />
        Back
      </Button>
      <PageHeader
        title="Create New Project"
        subtitle="Define the scope and goals of your new research initiative."
        icon={PiPlus}
      />
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <InputField
              id="projectName"
              label="Project Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., ERAS Protocol for Pediatric Thoracic Surgery"
              required
            />
            <TextareaField
              id="projectDescription"
              label="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of the project's main purpose and scope."
              rows={4}
            />
            <TextareaField
              id="projectGoals"
              label="Project Goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="List the primary objectives and aims of this research project."
              rows={4}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">
              <PiPlus className="mr-2" />
              Create Project
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateProjectPage;