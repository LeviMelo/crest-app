// src/components/ui/PageHeader.tsx
import React from 'react';
import { IconType } from 'react-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pageHeaderVariants = cva(
  "relative overflow-hidden bg-card border-b shadow-md mb-6",
  {
    variants: {
      gradient: {
        primary: "[--gradient-from:theme(colors.blue.500)] [--gradient-to:theme(colors.indigo.600)]",
        secondary: "[--gradient-from:theme(colors.emerald.500)] [--gradient-to:theme(colors.cyan.500)]",
        accent: "[--gradient-from:theme(colors.orange.500)] [--gradient-to:theme(colors.pink.500)]",
      }
    },
    defaultVariants: {
      gradient: "primary",
    },
  }
);

const iconWrapperVariants = cva(
  "p-2 rounded-lg bg-background/80 shadow-md",
  {
    variants: {
      gradient: {
        primary: "text-blue-500 dark:text-blue-400",
        secondary: "text-emerald-500 dark:text-emerald-400",
        accent: "text-orange-500 dark:text-orange-400",
      }
    },
    defaultVariants: {
      gradient: "primary",
    },
  }
)

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pageHeaderVariants> {
  title: string;
  subtitle?: string;
  icon?: IconType;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, gradient, title, subtitle, icon: Icon, children, ...props }, ref) => {
    return (
      <div className={cn(pageHeaderVariants({ gradient, className }))} ref={ref} {...props}>
        <div className="absolute inset-0 opacity-10 dark:opacity-[0.07] bg-gradient-to-r from-[--gradient-from] to-[--gradient-to]"></div>
        
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {Icon && (
                  <div className={cn(iconWrapperVariants({ gradient }))}>
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {title}
                </h1>
              </div>
              {subtitle && (
                <p className="text-muted-foreground text-lg max-w-2xl pl-12 -mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            {children && (
              <div className="flex-shrink-0">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader };