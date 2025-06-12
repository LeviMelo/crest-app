// src/components/forms/widgets/NumberWidget.tsx
import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { Slider } from '@/components/ui/Slider';
import Stepper from '@/components/ui/Stepper';

interface NumberWidgetProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  options: {
    unit?: string;
    enabledInputs: ('inputBox' | 'slider' | 'stepper')[];
  };
  schema: {
    minimum?: number;
    maximum?: number;
  };
}

const NumberWidget: React.FC<NumberWidgetProps> = ({ label, value, onChange, options, schema }) => {
  const { unit, enabledInputs = ['inputBox'] } = options;
  const { minimum, maximum } = schema;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.valueAsNumber);
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      {enabledInputs.includes('inputBox') && (
        <div className="flex items-center gap-2">
          <InputField
            id={`input-${label}`}
            type="number"
            label=""
            value={value || ''}
            onChange={handleInputChange}
            min={minimum}
            max={maximum}
          />
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      )}
      {enabledInputs.includes('slider') && (
        <Slider
          value={[value || 0]}
          onValueChange={handleSliderChange}
          min={minimum}
          max={maximum}
          step={1}
        />
      )}
      {enabledInputs.includes('stepper') && (
        <Stepper
          value={value || 0}
          onValueChange={onChange}
          min={minimum}
          max={maximum}
        />
      )}
    </div>
  );
};

export default NumberWidget;