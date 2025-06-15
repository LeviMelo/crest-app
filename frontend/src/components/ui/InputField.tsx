// src/components/ui/InputField.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, InputProps } from "@/components/ui/Input"

export interface InputFieldProps extends InputProps {
  label: string;
  id: string;
  subtitle?: string;
  containerClassName?: string;
  addon?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, subtitle, containerClassName, addon, ...props }, ref) => {
    return (
      <div className={cn("grid w-full items-center gap-1.5", containerClassName)}>
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
          {props.required && (
            <div className="text-xs font-semibold uppercase bg-destructive/10 text-destructive rounded-full px-2 py-0.5">
              Required
            </div>
          )}
        </div>
        {subtitle && (
          <p className={cn("text-xs text-muted-foreground", label && "-mt-1")}>{subtitle}</p>
        )}
        <div className="relative">
          <Input id={id} ref={ref} className={cn(addon ? "pr-12" : "", props.className)} {...props} />
          {addon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-muted-foreground sm:text-sm">{addon}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { InputField }