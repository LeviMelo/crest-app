import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import ToolboxV2 from '@/components/form-builder-v2/ToolboxV2';
import CanvasV2 from '@/components/form-builder-v2/CanvasV2';
import InspectorV2 from '@/components/form-builder-v2/InspectorV2';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStoreV2, Form } from '@/stores/formBuilderStore.v2';
import { PiSquaresFourDuotone, PiFloppyDiskDuotone, PiPlus, PiWrench, PiEye, PiCode } from 'react-icons/pi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { InputField } from '@/components/ui/InputField';
import { TextareaField } from '@/components/ui/TextareaField';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import JsonEditor from '@/components/form-builder/JsonEditor';

type MobileTab = 'toolbox' | 'canvas' | 'inspector';

const ProjectFormBuilderPageV2: React.FC = () => {
  const { 
    currentForm, 
    projectForms, 
    createNewForm, 
    loadForm, 
    saveForm, 
    updateFormMetadata, 
    isSaving,
    errors 
  } = useFormBuilderStoreV2();
  
  const [activeTab, setActiveTab] = useState<MobileTab>('canvas');
  const [isFormSettingsOpen, setIsFormSettingsOpen] = useState(false);
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeFormId && projectForms.length > 0) {
      setActiveFormId(projectForms[0].id);
    }
  }, [projectForms, activeFormId]);

  useEffect(() => {
    if (activeFormId && (!currentForm || currentForm.id !== activeFormId)) {
      loadForm(activeFormId);
    }
  }, [activeFormId, loadForm, currentForm]);

  const handleCreateNew = () => {
    createNewForm('proj_crest_001');
    const newFormId = useFormBuilderStoreV2.getState().currentForm?.id;
    if(newFormId) setActiveFormId(newFormId);
  };

  const handleSave = async () => {
    try {
      await saveForm();
    } catch (error) {
      console.error('Failed to save form:', error);
    }
  };

  const handleFormSelect = (formId: string) => {
    setActiveFormId(formId);
  };

  const tabs = [
    { id: 'toolbox' as MobileTab, label: 'Tools', shortLabel: 'Tools', icon: PiWrench },
    { id: 'canvas' as MobileTab, label: 'Canvas', shortLabel: 'Canvas', icon: PiEye },
    { id: 'inspector' as MobileTab, label: 'Inspector', shortLabel: 'Edit', icon: PiSquaresFourDuotone },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-col min-h-0">
      <PageHeader
        title="Form Builder V2"
        subtitle="Design and configure your dynamic data collection forms for this project."
        icon={PiSquaresFourDuotone}
      >
        <div className="mb-4">
          <p className="text-muted-foreground text-lg">
            <span className="hidden sm:inline">Design and configure your dynamic data collection forms for this project.</span>
            <span className="sm:hidden">Design your forms</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFormSettingsOpen(!isFormSettingsOpen)}
            size="sm"
            className="hidden sm:flex"
          >
            <span className="hidden lg:inline">Form Settings</span>
            <span className="lg:hidden">Settings</span>
          </Button>
          <Button onClick={handleCreateNew} variant="outline" size="sm">
            <PiPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">New Form</span>
          </Button>
          <Button variant="outline" onClick={() => setIsJsonEditorOpen(!isJsonEditorOpen)} disabled={!currentForm}>
              <PiCode className="mr-2" />
              {isJsonEditorOpen ? 'Hide' : 'View'} JSON
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !currentForm}
            variant="gradient"
            size="sm"
          >
            <PiFloppyDiskDuotone className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Form'}</span>
            <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
          </Button>
        </div>
      </PageHeader>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-destructive mb-2">
            <span className="hidden sm:inline">Form Builder Errors</span>
            <span className="sm:hidden">Errors</span>
          </h4>
          <ul className="text-sm text-destructive space-y-1">
            {errors.map((error) => (
              <li key={error.id}>• {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Settings Card (Collapsible) */}
      {isFormSettingsOpen && currentForm && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              <span className="hidden sm:inline">Form Settings</span>
              <span className="sm:hidden">Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                id="form-name"
                label="Form Name"
                value={currentForm.name}
                onChange={(e) => updateFormMetadata({ name: e.target.value })}
              />
              <div className="lg:col-span-2">
                <TextareaField
                  id="form-description"
                  label="Description"
                  value={currentForm.description}
                  onChange={(e) => updateFormMetadata({ description: e.target.value })}
                  rows={2}
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
                "flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-md text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.shortLabel}</span>
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
        <div className="grid grid-cols-12 gap-4 xl:gap-6 flex-grow min-h-0">
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

      {/* JSON Editor Drawer */}
      <div className={cn(
        "mt-6 transition-all duration-500 ease-in-out overflow-hidden",
        isJsonEditorOpen ? "max-h-[1000px] opacity-100 py-4" : "max-h-0 opacity-0"
      )}>
        <JsonEditor
          title="Current Form"
          jsonString={currentForm ? JSON.stringify(currentForm, null, 2) : "{}"}
          onJsonChange={() => {}} // Read-only, so no-op
          readOnly
        />
      </div>
    </div>
  );
};

export default ProjectFormBuilderPageV2; 