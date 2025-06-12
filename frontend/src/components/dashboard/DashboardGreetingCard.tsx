// src/components/dashboard/DashboardGreetingCard.tsx
import React from 'react';
import { PiPlusCircleDuotone } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/stores/authStore';

interface DashboardGreetingCardProps {
  onCreateNewProject: () => void;
}
const DashboardGreetingCard: React.FC<DashboardGreetingCardProps> = ({ onCreateNewProject }) => {
  const { user } = useAuthStore();

  return (
    <section className="relative p-6 sm:p-8 rounded-xl shadow-sm border bg-card overflow-hidden">
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animation-delay-2000 animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{user?.name || 'User'}</span>!
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            This is your launchpad. Manage projects, track progress, and stay updated.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            size="lg"
            onClick={onCreateNewProject}
            className="shadow-lg"
          >
            <PiPlusCircleDuotone className="w-5 h-5 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DashboardGreetingCard;