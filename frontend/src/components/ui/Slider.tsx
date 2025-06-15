// src/components/ui/Slider.tsx
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { min = 0, max = 100, value = [0] } = props;
  const isBipolar = min < 0 && max > 0;
  const currentValue = value[0];

  const getRangeStyle = (): React.CSSProperties => {
    if (!isBipolar) {
      return {}; // Default behavior for unipolar sliders
    }

    const totalRange = max - min;
    const zeroPosition = (-min / totalRange) * 100;
    const valuePosition = ((currentValue - min) / totalRange) * 100;

    if (currentValue >= 0) {
      return {
        left: `${zeroPosition}%`,
        right: `${100 - valuePosition}%`,
      };
    } else { // currentValue < 0
      return {
        left: `${valuePosition}%`,
        right: `${100 - zeroPosition}%`,
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