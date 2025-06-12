// src/pages/DataSubmissionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSubmissionStore, FormDefinition } from '@/stores/submissionStore';
import { useFormBuilderStore } from '@/stores/formBuilderStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { PiListChecksDuotone, PiArrowLeft, PiArrowRight, PiPaperPlaneTilt } from 'react-icons/pi';
import { cn } from '@/lib/utils';

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


const DataSubmissionPage: React.FC = () => {
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

    // In a real app, form schemas would be fetched based on the formSequence definition.
    // For this demo, we'll use the single form available from the builder store.
    const { schema, uiSchema, fieldOrder } = useFormBuilderStore();
    const MOCK_FORM_SEQUENCE: FormDefinition[] = [{ 
        key: 'form_from_builder', 
        name: schema.title, 
        version: '1.0',
        schemaPath: 'builder',
        uiSchemaPath: 'builder',
    }];

    // Local state for the form data of the *current* step
    const [currentStepFormData, setCurrentStepFormData] = useState({});

    useEffect(() => {
        if (isEncounterActive && currentFormIndex >= 0) {
            const currentFormKey = formSequence[currentFormIndex]?.key;
            if (currentFormKey) {
                setCurrentStepFormData(allFormsData[currentFormKey] || {});
            }
        }
    }, [currentFormIndex, isEncounterActive, allFormsData, formSequence]);

    const handleStart = () => {
        if (patientData?.initials && patientData?.gender && patientData?.dob && patientData.projectConsent) {
            startNewEncounter(patientData, MOCK_FORM_SEQUENCE);
        } else {
            alert("Please fill all required patient fields and provide consent.");
        }
    };
    
    const handlePatientFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        updatePatientData({ [id]: type === 'checkbox' ? checked : value });
    };

    const handleNavigate = (direction: 'next' | 'previous') => {
        if (currentFormIndex >= 0 && currentFormIndex < formSequence.length) {
            const currentFormKey = formSequence[currentFormIndex].key;
            saveCurrentForm(currentFormKey, currentStepFormData);
        }
        setCurrentFormIndex(currentFormIndex + (direction === 'next' ? 1 : -1));
    };

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
        if (currentFormIndex < 0 || currentFormIndex >= formSequence.length) return null;
        
        const currentFormDef = formSequence[currentFormIndex];
        return (
            <Card>
                <CardHeader><CardTitle>{currentFormDef.name}</CardTitle></CardHeader>
                <CardContent>
                    <DynamicFormRenderer
                        schema={schema} // Using builder schema for demo
                        uiSchema={uiSchema} // Using builder uiSchema for demo
                        formData={currentStepFormData}
                        onFormDataChange={setCurrentStepFormData}
                        fieldOrder={fieldOrder}
                    />
                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => handleNavigate('previous')}><PiArrowLeft className="mr-2" /> Previous</Button>
                    <Button onClick={() => handleNavigate('next')}>Next <PiArrowRight className="ml-2" /></Button>
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
                <Button onClick={() => {
                    alert('Submitting all data to the backend (see console).');
                    console.log({ patientData, allFormsData });
                    completeAndClearEncounter();
                }}>
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

export default DataSubmissionPage;