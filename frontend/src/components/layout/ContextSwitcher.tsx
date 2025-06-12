// src/components/layout/ContextSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiCaretUpDownDuotone, PiGauge, PiCheck } from 'react-icons/pi';
import useProjectStore from '../../stores/projectStore';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

const ContextSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { availableProjects, activeProjectId, activeProjectDetails, setActiveProject } = useProjectStore();
  const switcherRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string | null) => {
    if (id) {
      setActiveProject(id);
      navigate(`/project/${id}`);
    } else {
      // 'Global Dashboard' selected
      setActiveProject(''); // Or a dedicated clearActiveProject()
      navigate('/');
    }
    setIsOpen(false);
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
          <ul className="max-h-60 overflow-auto p-1" role="listbox">
            {/* Global Dashboard Option */}
            <li
              className={cn("flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                !activeProjectId && "bg-accent"
              )}
              onClick={() => handleSelect(null)}
              role="option"
              aria-selected={!activeProjectId}
            >
              <PiGauge className="mr-2 h-4 w-4" />
              Global Dashboard
              {!activeProjectId && <PiCheck className="ml-auto h-4 w-4" />}
            </li>

            {/* Project Options */}
            {availableProjects.map((project) => (
              <li
                key={project.id}
                className={cn("flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                  project.id === activeProjectId && "bg-accent"
                )}
                onClick={() => handleSelect(project.id)}
                role="option"
                aria-selected={project.id === activeProjectId}
              >
                {project.name}
                {project.id === activeProjectId && <PiCheck className="ml-auto h-4 w-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextSwitcher;