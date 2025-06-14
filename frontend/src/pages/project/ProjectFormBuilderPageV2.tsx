import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';
import ToolboxV2 from '@/components/form-builder-v2/ToolboxV2';
import CanvasV2 from '@/components/form-builder-v2/CanvasV2';
import InspectorV2 from '@/components/form-builder-v2/InspectorV2';
import { 
  PiSquaresFourDuotone, 
  PiFloppyDiskDuotone, 
  PiPlus, 
  PiEye,
  PiWrench,
  PiGearSix
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

type MobileTab = 'toolbox' | 'canvas' | 'inspector';

const ProjectFormBuilderPageV2: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState<MobileTab>('canvas');
  
  const { 
    currentForm, 
    projectForms, 
    isLoading, 
    isSaving, 
    errors,
    createNewForm, 
    loadForm, 
    saveForm,
    updateFormMetadata,
    clearErrors
  } = useFormBuilderStoreV2();

  // Initialize with a new form if none exists
  useEffect(() => {
    if (projectId && !currentForm && projectForms.length === 0) {
      createNewForm(projectId);
    }
  }, [projectId, currentForm, projectForms, createNewForm]);

  const handleCreateNew = () => {
    if (projectId) {
      createNewForm(projectId);
    }
  };

  const handleSave = async () => {
    await saveForm();
  };

  const tabs = [
    { id: 'toolbox' as MobileTab, label: 'Tools', icon: PiWrench },
    { id: 'canvas' as MobileTab, label: 'Canvas', icon: PiEye },
    { id: 'inspector' as MobileTab, label: 'Inspector', icon: PiGearSix },
  ];

  return (
    <div className="space-y-6 flex flex-col min-h-0">
      <PageHeader
        title="Form Builder V2"
        subtitle="Create and edit forms with the new simplified builder"
        icon={PiSquaresFourDuotone}
      >
        <div className="flex gap-2">
          <Button onClick={handleCreateNew} variant="outline">
            <PiPlus className="mr-2" />
            New Form
          </Button>
          <Button 
            onClick={handleSave} 
            variant="gradient"
            disabled={!currentForm || isSaving}
          >
            <PiFloppyDiskDuotone className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </PageHeader>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-destructive">Form Errors</h4>
            <Button size="sm" variant="ghost" onClick={clearErrors}>
              Clear
            </Button>
          </div>
          <ul className="mt-2 space-y-1">
            {errors.map((error) => (
              <li key={error.id} className="text-sm text-destructive">
                • {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Metadata Editor */}
      {currentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Form Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Form Name</label>
                <input
                  type="text"
                  value={currentForm.name}
                  onChange={(e) => updateFormMetadata({ name: e.target.value })}
                  className="mt-1 w-full p-2 border rounded"
                  placeholder="Enter form name..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  value={currentForm.description}
                  onChange={(e) => updateFormMetadata({ description: e.target.value })}
                  className="mt-1 w-full p-2 border rounded"
                  placeholder="Enter form description..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Tab Content */}
        <div className="min-h-[60vh]">
          {activeTab === 'toolbox' && <ToolboxV2 />}
          {activeTab === 'canvas' && <CanvasV2 />}
          {activeTab === 'inspector' && <InspectorV2 />}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col flex-grow min-h-0">
        <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">
          {/* Left Panel: Toolbox */}
          <div className="col-span-3 h-full min-h-0">
            <ToolboxV2 />
          </div>

          {/* Center Panel: Canvas */}
          <div className="col-span-6 h-full min-h-0">
            <CanvasV2 />
          </div>

          {/* Right Panel: Inspector */}
          <div className="col-span-3 h-full min-h-0">
            <InspectorV2 />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <p className="text-center">Loading form...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFormBuilderPageV2; 