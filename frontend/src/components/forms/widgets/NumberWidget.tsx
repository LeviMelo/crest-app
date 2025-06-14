// src/components/forms/widgets/NumberWidget.tsx
import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { Slider } from '@/components/ui/Slider';
import Stepper from '@/components/ui/Stepper';

interface NumberWidgetProps {
  label: string;
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;
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
    const num = e.target.valueAsNumber;
    if (!isNaN(num)) {
      onChange(num);
    } else if (e.target.value === '') {
      onChange(undefined); // Allow clearing the input
    }
  };

  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {enabledInputs.includes('inputBox') && (
            <InputField
              id={`input-${label}`}
              type="number"
              label=""
              containerClassName='w-full sm:w-40'
              value={value || ''}
              onChange={handleInputChange}
              min={minimum}
              max={maximum}
              addon={unit}
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

      {enabledInputs.includes('slider') && (
        <Slider
          value={[value || minimum || 0]}
          onValueChange={handleSliderChange}
          min={minimum}
          max={maximum}
          step={1}
          className='pt-2'
        />
      )}
    </div>
  );
};

export default NumberWidget;