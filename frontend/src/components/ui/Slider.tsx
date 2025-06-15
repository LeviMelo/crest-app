// src/components/ui/Slider.tsx
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { min = 0, max = 100, value = [0] } = props;
  const currentValue = value[0];
  const isBipolar = min < 0 && max > 0;

  // This function calculates the correct 'left' and 'right' CSS properties 
  // for the slider's range to ensure it always fills from the '0' point.
  const getRangeStyle = (): React.CSSProperties => {
    // For a standard unipolar slider (e.g., 0-100), no special styles are needed.
    // The range will automatically fill from the start.
    if (!isBipolar) {
      return {};
    }

    // For a bipolar slider (e.g., -100 to 100), we calculate positions as percentages.
    const totalRange = max - min;
    if (totalRange <= 0) return {}; // Avoid division by zero

    // Find the position of '0' on the track.
    const zeroPositionPercent = (-min / totalRange) * 100;
    // Find the position of the current value on the track.
    const valuePositionPercent = ((currentValue - min) / totalRange) * 100;

    // If the value is positive, the range fills from '0' to the current value.
    if (currentValue >= 0) {
      return {
        left: `${zeroPositionPercent}%`,
        right: `${100 - valuePositionPercent}%`,
      };
    } 
    // If the value is negative, the range fills from the current value to '0'.
    else {
      return {
        left: `${valuePositionPercent}%`,
        right: `${100 - zeroPositionPercent}%`,
      };
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range 
          className={cn(
            "absolute h-full",
            currentValue < 0 ? "bg-destructive" : "bg-primary"
          )} 
          style={getRangeStyle()} 
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }