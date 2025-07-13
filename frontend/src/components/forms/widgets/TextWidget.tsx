// src/components/forms/widgets/TextWidget.tsx
import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';

interface TextWidgetProps {
  label: string;
  value: string | undefined;
  onChange: (newValue: string | undefined) => void;
  options?: {
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
  };
  required?: boolean;
}

const TextWidget: React.FC<TextWidgetProps> = ({ 
  label, 
  value, 
  onChange, 
  options = {}, 
  required = false 
}) => {
  const { placeholder, multiline, rows } = options;

  if (multiline) {
    return (
      <TextareaField
        id={`input-${label}`}
        label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows || 4}
        required={required}
      />
    );
  }

  return (
    <InputField
      id={`input-${label}`}
      label={label}
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default TextWidget; 