// src/pages/FormBuilderPage.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import Toolbox from '@/components/form-builder/Toolbox';
import Canvas from '@/components/form-builder/Canvas';
import Inspector from '@/components/form-builder/Inspector';
import JsonEditor from '@/components/form-builder/JsonEditor';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { PiSquaresFourDuotone, PiCode } from 'react-icons/pi';

type ViewMode = 'visual' | 'json';

const FormBuilderPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('visual');
  const { schema, uiSchema, setRawSchema, setRawUiSchema } = useFormBuilderStore();

  const handleSchemaChange = (value: string) => setRawSchema(value);
  const handleUiSchemaChange = (value: string) => setRawUiSchema(value);

  const visualView = (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
      <div className="lg:col-span-3 xl:col-span-2 h-full overflow-y-auto"><Toolbox /></div>
      <div className="lg:col-span-6 xl:col-span-7 h-full overflow-y-auto"><Canvas /></div>
      <div className="lg:col-span-3 xl:col-span-3 h-full overflow-y-auto"><Inspector /></div>
    </div>
  );

  const jsonView = (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
      <JsonEditor title="Schema" jsonString={JSON.stringify(schema, null, 2)} onJsonChange={handleSchemaChange} />
      <JsonEditor title="UI Schema" jsonString={JSON.stringify(uiSchema, null, 2)} onJsonChange={handleUiSchemaChange} />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,64px)-3rem)] space-y-4">
      <PageHeader
        title="Form Builder"
        subtitle="Design research forms with a live preview."
        icon={PiSquaresFourDuotone}
        gradient="accent"
        className="flex-shrink-0 mb-0"
      >
        <Button variant="outline" onClick={() => setViewMode(viewMode === 'visual' ? 'json' : 'visual')}>
          <PiCode className="mr-2" />
          {viewMode === 'visual' ? 'JSON Mode' : 'Visual Mode'}
        </Button>
      </PageHeader>
      
      {viewMode === 'visual' ? visualView : jsonView}
    </div>
  );
};

export default FormBuilderPage;