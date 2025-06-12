// src/components/project/InfoWidget.tsx
import React from 'react';
import { IconType } from 'react-icons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface InfoWidgetProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
  className?: string;
}

const InfoWidget: React.FC<InfoWidgetProps> = ({ title, icon: Icon, children, className }) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default InfoWidget;