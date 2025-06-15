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
import { AnimatePresence, motion } from 'framer-motion';

type MobileTab = 'canvas' | 'inspector';

const ProjectFormBuilderPageV2: React.FC = () => {
  const { 
    currentForm, 
    projectForms, 
    createNewForm, 
    loadForm, 
    saveForm, 
    updateFormMetadata, 
    isSaving,
    errors,
    setRawForm
  } = useFormBuilderStoreV2();
  
  const [activeTab, setActiveTab] = useState<MobileTab>('canvas');
  const [isFormSettingsOpen, setIsFormSettingsOpen] = useState(false);
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [jsonString, setJsonString] = useState("");

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

  useEffect(() => {
    if (currentForm) {
      setJsonString(JSON.stringify(currentForm, null, 2));
    }
  }, [currentForm]);

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

  const handleApplyJson = () => {
    if (setRawForm(jsonString)) {
      // Optionally close editor on successful apply
      // setIsJsonEditorOpen(false);
    }
  };
  
  const handleResetJson = () => {
    if (currentForm) {
      setJsonString(JSON.stringify(currentForm, null, 2));
    }
  };

  const tabs = [
    { id: 'canvas' as MobileTab, label: 'Canvas', shortLabel: 'Canvas', icon: PiEye },
    { id: 'inspector' as MobileTab, label: 'Inspector', shortLabel: 'Edit', icon: PiSquaresFourDuotone },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader
        title="Form Builder V2"
        subtitle={currentForm ? currentForm.name : 'Design and configure your dynamic data collection forms for this project.'}
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

      {/* Main builder content */}
      <div className="flex-grow flex flex-col min-h-0 relative">
        
        {/* Top Fixed Toolbox (Desktop) */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 z-20">
           <ToolboxV2 />
        </div>

        {/* Mobile: Use tabs as before */}
        <div className="lg:hidden p-4">
            {/* ... mobile tab switching logic ... */}
        </div>

        {/* Main Content: Canvas + Inspector (Desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 flex-grow min-h-0 items-start px-6 pb-6">
            <div className="col-span-8 xl:col-span-9 h-full min-h-0 overflow-y-auto pt-[90px]"> {/* pt to offset toolbox */}
                <CanvasV2 />
            </div>
            <div className="col-span-4 xl:col-span-3 h-full overflow-y-auto">
                 <div className="sticky top-0 pt-[90px]"> {/* pt to offset toolbox */}
                     <InspectorV2 />
                 </div>
            </div>
        </div>
      </div>

      {/* JSON Editor remains at the bottom */}
      <AnimatePresence>
        {isJsonEditorOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Live JSON Editor</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleResetJson}>Reset</Button>
                  <Button size="sm" onClick={handleApplyJson}>Apply JSON</Button>
                </div>
              </div>
              <div className="h-96">
                <JsonEditor
                  jsonString={jsonString}
                  onJsonChange={setJsonString}
                  readOnly={false}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectFormBuilderPageV2; 