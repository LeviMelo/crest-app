// src/components/forms/widgets/BooleanWidget.tsx
import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';

interface BooleanWidgetProps {
  label: string;
  value: boolean | undefined;
  onChange: (newValue: boolean | undefined) => void;
  options?: {
    displayAs?: 'checkbox' | 'switch';
  };
  required?: boolean;
}

const BooleanWidget: React.FC<BooleanWidgetProps> = ({ 
  label, 
  value, 
  onChange, 
  options = {}, 
  required = false 
}) => {
  const { displayAs = 'checkbox' } = options;
  const id = `input-${label}`;

  if (displayAs === 'switch') {
    return (
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <label htmlFor={id} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        </div>
        <Switch
          id={id}
          checked={value || false}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id={id}
        checked={value || false}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <div className="grid gap-1.5">
        <label htmlFor={id} className="font-medium leading-none">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      </div>
    </div>
  );
};

export default BooleanWidget; 