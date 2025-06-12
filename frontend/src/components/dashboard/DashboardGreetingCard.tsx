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
    <section className="relative p-8 rounded-xl shadow-lg border bg-card overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-brand-blue/30 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-brand-purple/30 to-transparent rounded-full filter blur-3xl opacity-50 animation-delay-2000 animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, <span className="text-gradient-primary">{user?.name || 'User'}</span>!
          </h1>
          <p className="mt-2 text-muted-foreground text-lg max-w-xl">
            This is your launchpad. Manage projects, track progress, and drive your research forward.
          </p>
        </div>
        <div className="shrink-0 mt-4 md:mt-0">
          <Button
            size="lg"
            onClick={onCreateNewProject}
            variant="gradient"
            className="animate-pulse-glow"
          >
            <PiPlusCircleDuotone className="w-6 h-6 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DashboardGreetingCard;