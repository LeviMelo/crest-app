import React from 'react';
import { Button } from '@/components/ui/Button';

interface QuickSelectButtonsProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
}

const QuickSelectButtons: React.FC<QuickSelectButtonsProps> = ({ options, selectedValues }) => {
  return (
    <div className="flex flex-wrap gap-1 pointer-events-none opacity-70">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={selectedValues.includes(option.value) ? 'default' : 'outline'}
          className="text-xs h-7 px-2"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickSelectButtons; 