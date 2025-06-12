// src/components/ui/InputField.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface InputFieldProps extends InputProps {
    label: string;
    id: string;
    containerClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, id, required, containerClassName, className, ...props }, ref) => {
        return (
            <div className={cn("grid w-full items-center gap-1.5", containerClassName)}>
                <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
                <Input id={id} ref={ref} required={required} className={className} {...props} />
            </div>
        )
    }
)
InputField.displayName = "InputField"

export { InputField, Input };