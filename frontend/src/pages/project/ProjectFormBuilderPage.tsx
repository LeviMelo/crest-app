// src/pages/project/ProjectFormBuilderPage.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import Toolbox from '@/components/form-builder/Toolbox';
import Canvas from '@/components/form-builder/Canvas';
import Inspector from '@/components/form-builder/Inspector';
import JsonEditor from '@/components/form-builder/JsonEditor';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { PiSquaresFourDuotone, PiFloppyDiskDuotone, PiPlus, PiWrench, PiCode, PiEye } from 'react-icons/pi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { mockProjectForms } from '@/data/mockForms'; // Import the mock forms

type MobileTab = 'toolbox' | 'canvas' | 'inspector';

const ProjectFormBuilderPage: React.FC = () => {
    const { schema, uiSchema, setRawSchema, setRawUiSchema, loadForm } = useFormBuilderStore();
    const [activeTab, setActiveTab] = useState<MobileTab>('canvas');
    const [activeFormId, setActiveFormId] = useState<string>(mockProjectForms[0]?.id || '');
    const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

    // Set the initial form on first load
    React.useEffect(() => {
        const initialForm = mockProjectForms.find(f => f.id === activeFormId);
        if (initialForm) {
            loadForm({ schema: initialForm.schema, uiSchema: initialForm.uiSchema });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once

    const handleFormSelect = (formId: string) => {
        const formToLoad = mockProjectForms.find(f => f.id === formId);
        if (formToLoad) {
            setActiveFormId(formId);
            loadForm({ schema: formToLoad.schema, uiSchema: formToLoad.uiSchema });
        }
    };
    
    const schemaString = JSON.stringify(schema, null, 2);
    const uiSchemaString = JSON.stringify(uiSchema, null, 2);

    const tabs = [
        { id: 'toolbox' as MobileTab, label: 'Tools', icon: PiWrench },
        { id: 'canvas' as MobileTab, label: 'Canvas', icon: PiEye },
        { id: 'inspector' as MobileTab, label: 'Inspector', icon: PiSquaresFourDuotone },
    ];
    
    const formsList = (
        <Card>
            <CardHeader>
                <CardTitle>Project Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {mockProjectForms.map(form => (
                     <div 
                        key={form.id}
                        onClick={() => handleFormSelect(form.id)}
                        className={cn(
                            "p-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors",
                            activeFormId === form.id 
                                ? "bg-accent border border-primary" 
                                : "hover:bg-accent"
                        )}
                     >
                        {form.name}
                    </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                    <PiPlus className="mr-2" />
                    Create New Form
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 flex flex-col min-h-0">
            <PageHeader
                title="Form Builder"
                subtitle="Design and configure your dynamic data collection forms for this project."
                icon={PiSquaresFourDuotone}
            >
                <Button variant="gradient">
                    <PiFloppyDiskDuotone className="mr-2" />
                    Save Form
                </Button>
                <Button variant="outline" onClick={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}>
                    <PiCode className="mr-2" />
                    {isCodeDrawerOpen ? 'Hide' : 'Show'} Code
                </Button>
            </PageHeader>

            {/* Mobile Tabs (shown on mobile and tablet) */}
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
                    {activeTab === 'toolbox' && (
                        <div className="space-y-4">
                            <Toolbox />
                            {formsList}
                        </div>
                    )}
                    {activeTab === 'canvas' && <Canvas />}
                    {activeTab === 'inspector' && <Inspector />}
                </div>
            </div>

            {/* Desktop Layout (hidden on mobile) */}
            <div className="hidden lg:flex flex-col flex-grow min-h-0">
                {/* Main Builder UI with Responsive Layout */}
                <div className="grid grid-cols-12 gap-6 flex-grow min-h-0">
                    {/* Left Panel: Forms List + Toolbox */}
                    <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
                        <div className="flex-shrink-0">
                            {formsList}
                        </div>
                        <div className="flex-grow min-h-0">
                            <Toolbox />
                        </div>
                    </div>

                    {/* Center Panel: Canvas */}
                    <div className="col-span-6 h-full min-h-0">
                        <Canvas />
                    </div>

                    {/* Right Panel: Inspector */}
                    <div className="col-span-3 h-full min-h-0">
                        <Inspector />
                    </div>
                </div>
            </div>

             {/* JSON Editors (Collapsible Drawer for all screen sizes) */}
             <div className={cn(
                "mt-6 transition-all duration-500 ease-in-out overflow-hidden",
                isCodeDrawerOpen ? "max-h-[1000px] opacity-100 py-4" : "max-h-0 opacity-0"
             )}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <JsonEditor title="Data Schema (schema.json)" jsonString={schemaString} onJsonChange={setRawSchema} />
                    <JsonEditor title="UI Schema (uiSchema.json)" jsonString={uiSchemaString} onJsonChange={setRawUiSchema} />
                </div>
            </div>
        </div>
    );
};

export default ProjectFormBuilderPage;