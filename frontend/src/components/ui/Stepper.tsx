// src/components/ui/Stepper.tsx
import React from 'react';
import { Button } from './Button';
import { PiPlus, PiMinus } from 'react-icons/pi';

interface StepperProps {
  value: number;
  onValueChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Stepper: React.FC<StepperProps> = ({ value, onValueChange, min = 0, max = 100, step = 1 }) => {
  const handleDecrement = () => {
    onValueChange(Math.max(min, value - step));
  };
  const handleIncrement = () => {
    onValueChange(Math.min(max, value + step));
  };

  return (
    <div className="flex items-center">
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-r-none" onClick={handleDecrement} disabled={value <= min}>
        <PiMinus />
      </Button>
      <span className="w-12 border-y text-center text-md font-semibold flex items-center justify-center h-9">{value}</span>
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-l-none" onClick={handleIncrement} disabled={value >= max}>
        <PiPlus />
      </Button>
    </div>
  );
};

export default Stepper;