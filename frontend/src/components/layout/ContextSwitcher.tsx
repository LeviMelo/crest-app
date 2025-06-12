// src/components/layout/ContextSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiCaretUpDownDuotone, PiGaugeDuotone, PiCheck, PiPlus } from 'react-icons/pi';
import { useProjectStore } from '@/stores/projectStore';
import useAuthStore from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const ContextSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { availableProjects, activeProjectId, activeProjectDetails, setActiveProject } = useProjectStore();
  const { user } = useAuthStore();
  const switcherRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string | null) => {
    setIsOpen(false);
    if (id) {
      setActiveProject(id);
      navigate(`/project/${id}`);
    } else {
      setActiveProject(""); // Clear the active project
      navigate('/');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentContextName = activeProjectDetails?.name || "Global Dashboard";
  const userProjects = user ? availableProjects.filter(p => p.members.some(m => m.userId === user.id)) : [];

  return (
    <div className="relative mb-4" ref={switcherRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{currentContextName}</span>
        <PiCaretUpDownDuotone className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg">
          <ul className="max-h-60 overflow-y-auto p-1" role="listbox">
            {/* Global Dashboard Option */}
            <li
              className={cn("flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", !activeProjectId && "bg-accent")}
              onClick={() => handleSelect(null)}
              role="option"
              aria-selected={!activeProjectId}
            >
              <PiGaugeDuotone className="mr-2 h-4 w-4" />
              Global Dashboard
              {!activeProjectId && <PiCheck className="ml-auto h-4 w-4" />}
            </li>

            {/* Project Options */}
            <div className="my-1 h-px bg-border" />
            <h4 className="px-2 text-xs font-semibold text-muted-foreground">Projects</h4>
            {userProjects.map((project) => (
              <li
                key={project.id}
                className={cn("flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent", project.id === activeProjectId && "bg-accent")}
                onClick={() => handleSelect(project.id)}
                role="option"
                aria-selected={project.id === activeProjectId}
              >
                {project.name}
                {project.id === activeProjectId && <PiCheck className="ml-auto h-4 w-4" />}
              </li>
            ))}
             <div className="my-1 h-px bg-border" />
             {/* Create New Project - Placeholder Action */}
             <li className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-accent">
                <PiPlus className="mr-2 h-4 w-4"/>
                Create Project
             </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextSwitcher;