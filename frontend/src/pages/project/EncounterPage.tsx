// src/pages/project/EncounterPage.tsx
// This file contains the complete, working logic from the original DataSubmissionPage.

import React, { useState, useEffect } from 'react';
import { useSubmissionStore } from '@/stores/submissionStore';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { PiListChecksDuotone, PiArrowLeft, PiArrowRight, PiPaperPlaneTilt } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { convertFormsToSubmissionFormat, FormDefinition } from '@/data/forms/formConverter';

// This component will be used for the Stepper UI
const SubmissionStepper: React.FC = () => {
    const { currentFormIndex, formSequence } = useSubmissionStore();
    const steps = [
        { key: 'patient', label: 'Patient Info' },
        ...formSequence.map(f => ({ key: f.key, label: f.name })),
        { key: 'review', label: 'Review & Submit' }
    ];
    const activeIndex = currentFormIndex + 1;

    return (
        <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <ol className="flex items-center w-full">
                {steps.map((step, index) => {
                    const isCompleted = index < activeIndex;
                    const isCurrent = index === activeIndex;
                    return (
                        <li key={step.key} className={cn(
                            "flex w-full items-center",
                            isCompleted ? 'text-primary' : 'text-muted-foreground',
                            index < steps.length - 1 ? "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-border after:mx-4" : ""
                        )}>
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full text-sm shrink-0",
                                isCurrent ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-primary/20' : 'bg-muted'
                            )}>
                                {index + 1}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

// Renamed the component to EncounterPage
const EncounterPage: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { projectId } = useParams();
    
    const { 
        patientData, 
        updatePatientData, 
        isEncounterActive, 
        startNewEncounter,
        allFormsData,
        saveCurrentForm,
        completeAndClearEncounter,
        currentFormIndex,
        setCurrentFormIndex,
        formSequence,
    } = useSubmissionStore();

    const { projectForms } = useFormBuilderStoreV2();
    
    const [currentStepFormData, setCurrentStepFormData] = useState({});
    
    // Check if the project exists by seeing if we have any forms for this projectId
    const projectExists = projectForms.some(f => f.projectId === projectId);
    
    // Show loading state if forms haven't loaded yet
    if (projectForms.length === 0) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Loading..."
                    subtitle="Loading project data..."
                    icon={PiListChecksDuotone}
                />
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-muted-foreground">Loading project forms...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // Show error state if project doesn't exist after forms are loaded
    if (!projectExists) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Project Not Found"
                    subtitle="The requested project could not be found."
                    icon={PiListChecksDuotone}
                />
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-destructive text-xl mb-4">Project Not Found</div>
                        <p className="text-muted-foreground mb-6">
                            Could not load details for project ID '{projectId}'.
                        </p>
                        <Button onClick={() => navigate('/')}>
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    

    
    // The available forms are now the V2 project forms, converted for submission
    const availableFormsForSubmission: FormDefinition[] = React.useMemo(() => {
        const crestForms = projectForms.filter(f => f.projectId === projectId);
        
        if (crestForms.length === 0) {
            return [];
        }
        
        const converted = convertFormsToSubmissionFormat(crestForms);
        return converted;
    }, [projectForms, projectId]);

    // Get the current form definition, which includes the schema and uiSchema
    const currentFormDef = (currentFormIndex >= 0 && currentFormIndex < formSequence.length)
        ? formSequence[currentFormIndex]
        : null;

    useEffect(() => {
        if (isEncounterActive && currentFormDef) {
            setCurrentStepFormData(allFormsData[currentFormDef.key] || {});
        }
    }, [currentFormDef, isEncounterActive, allFormsData]);

    const handleStart = () => {
        if (patientData?.initials && patientData?.gender && patientData?.dob && patientData.projectConsent) {
            if (availableFormsForSubmission.length === 0) {
                alert("No forms available for this project. Please create forms in the Form Builder first.");
                return;
            }
            startNewEncounter(patientData, availableFormsForSubmission);
        } else {
            alert("Please fill all required patient fields and provide consent.");
        }
    };
    
    const handlePatientFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        updatePatientData({ [id]: type === 'checkbox' ? checked : value });
    };

    const handleNavigate = (direction: 'next' | 'previous') => {
        if (currentFormDef) {
            saveCurrentForm(currentFormDef.key, currentStepFormData);
        }
        setCurrentFormIndex(currentFormIndex + (direction === 'next' ? 1 : -1));
    };
    
    const handleSubmitAndExit = () => {
        // Save the final form state before submitting
        if (currentFormDef) {
            saveCurrentForm(currentFormDef.key, currentStepFormData);
        }
        alert('Submitting all data to the backend (see console).');
        completeAndClearEncounter();
        
        navigate(`/project/${projectId}/submissions`);
    }

    const renderPatientInput = () => (
        <Card>
            <CardHeader><CardTitle>Patient Identification & Consent</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Patient Initials" id="initials" type="text" value={patientData?.initials || ''} onChange={handlePatientFieldChange} required />
                    <InputField label="Gender" id="gender" type="text" value={patientData?.gender || ''} onChange={handlePatientFieldChange} required />
                    <InputField label="Date of Birth" id="dob" type="date" value={patientData?.dob || ''} onChange={handlePatientFieldChange} required />
                </div>
                <div className="flex items-start space-x-2 pt-4 border-t">
                    <input type="checkbox" id="projectConsent" checked={patientData?.projectConsent || false} onChange={handlePatientFieldChange} className="h-4 w-4 mt-1 accent-primary" />
                    <label htmlFor="projectConsent" className="text-sm text-muted-foreground">Confirm project-specific consent has been obtained. <span className="text-destructive">*</span></label>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleStart} className="ml-auto">Start Data Collection</Button>
            </CardFooter>
        </Card>
    );

    const renderFormStep = () => {
        if (!currentFormDef) return null;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{currentFormDef.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <DynamicFormRenderer
                        schema={currentFormDef.schema}
                        uiSchema={currentFormDef.uiSchema}
                        formData={currentStepFormData}
                        onFormDataChange={setCurrentStepFormData}
                    />
                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => handleNavigate('previous')} disabled={currentFormIndex === 0}>
                        <PiArrowLeft className="mr-2" /> Previous
                    </Button>
                    <Button onClick={() => handleNavigate('next')}>
                        {currentFormIndex === formSequence.length - 1 ? 'Review' : 'Next'} <PiArrowRight className="ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    const renderReviewStep = () => (
        <Card>
            <CardHeader><CardTitle>Review & Submit</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Patient Information</h3>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{JSON.stringify(patientData, null, 2)}</pre>
                </div>
                {formSequence.map(formDef => (
                    <div key={formDef.key}>
                        <h3 className="font-semibold mb-2">{formDef.name}</h3>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{JSON.stringify(allFormsData[formDef.key] || { message: "No data entered for this form." }, null, 2)}</pre>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => handleNavigate('previous')}><PiArrowLeft className="mr-2" /> Back to Edit</Button>
                <Button onClick={handleSubmitAndExit}>
                    <PiPaperPlaneTilt className="mr-2" /> Submit Encounter
                </Button>
            </CardFooter>
        </Card>
    );

    const renderContent = () => {
        if (!isEncounterActive) {
            return renderPatientInput();
        }
        if (currentFormIndex >= 0 && currentFormIndex < formSequence.length) {
            return renderFormStep();
        }
        if (currentFormIndex === formSequence.length) {
            return renderReviewStep();
        }
        return null; // Should not happen
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Submission"
                subtitle="Collect and submit clinical research data for your active project."
                icon={PiListChecksDuotone}
            />
            
            {isEncounterActive && <SubmissionStepper />}
            {renderContent()}
            <DraftStatusBar />
        </div>
    );
};

export default EncounterPage;