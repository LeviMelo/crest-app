// src/pages/FormBuilderPage.tsx
import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PiSquaresFourDuotone } from 'react-icons/pi';

const Toolbox = () => (
  <Card className="h-full">
    <CardHeader><CardTitle>Toolbox</CardTitle></CardHeader>
    <CardContent><p className="text-muted-foreground text-sm">Draggable field widgets will appear here.</p></CardContent>
  </Card>
);

const Canvas = () => (
  <Card className="h-full">
    <CardHeader><CardTitle>Canvas (Live Preview)</CardTitle></CardHeader>
    <CardContent><p className="text-muted-foreground text-sm">The form preview will appear here.</p></CardContent>
  </Card>
);

const Inspector = () => (
  <Card className="h-full">
    <CardHeader><CardTitle>Inspector</CardTitle></CardHeader>
    <CardContent><p className="text-muted-foreground text-sm">Properties of the selected field will appear here.</p></CardContent>
  </Card>
);

const FormBuilderPage: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-4rem)] space-y-6">
      <PageHeader
        title="Form Builder"
        subtitle="Design research forms with a live preview."
        icon={PiSquaresFourDuotone}
        gradient="accent"
        className="flex-shrink-0"
      />
      
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <div className="lg:col-span-2 h-full overflow-y-auto">
          <Toolbox />
        </div>
        <div className="lg:col-span-6 h-full overflow-y-auto">
          <Canvas />
        </div>
        <div className="lg:col-span-4 h-full overflow-y-auto">
          <Inspector />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;