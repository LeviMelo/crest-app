// src/pages/project/EncounterPage.tsx
import React, { useState, useEffect } from 'react';
import { useSubmissionStore } from '@/stores/submissionStore';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import FormRendererV2 from '@/components/forms/FormRendererV2';
import { PiListChecksDuotone, PiArrowLeft, PiArrowRight, PiPaperPlaneTilt, PiCheck } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionStepper: React.FC<{
    onStepSelect: (index: number) => void;
}> = ({ onStepSelect }) => {
    const { formSequence, currentFormIndex } = useSubmissionStore();
    const steps = [
        { name: 'Patient Info', isComplete: currentFormIndex > -1 },
        ...formSequence.map((form, idx) => ({ name: form.name, isComplete: currentFormIndex > idx + 1 })),
        { name: 'Review & Submit', isComplete: false }, // Review step is never "complete" in this view
    ];
    const activeStep = currentFormIndex + 1;

    return (
        <div className="w-full py-4 px-6 bg-card border rounded-lg shadow-sm">
            <nav aria-label="Progress">
                <ol
                    role="list"
                    className="grid items-start"
                    style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
                >
                    {steps.map((step, stepIdx) => (
                        <li key={step.name} className="relative">
                            {/* Connector line: Drawn behind the circles, from the center of this step to the center of the next */}
                            {stepIdx < steps.length - 1 && (
                                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200" aria-hidden="true">
                                     {/* A second div for the 'completed' state highlight */}
                                    {stepIdx < activeStep && <div className="h-full w-full bg-primary" />}
                                </div>
                            )}

                            {/* Main step content: Circle and Label */}
                            <div className="flex flex-col items-center gap-2 text-center">
                                {/* Circle button */}
                                {stepIdx < activeStep ? ( // Completed
                                    <button
                                        onClick={() => onStepSelect(stepIdx - 1)}
                                        className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full hover:bg-primary-dark z-10"
                                    >
                                        <PiCheck className="w-5 h-5 text-white" />
                                    </button>
                                ) : stepIdx === activeStep ? ( // Current
                                    <button
                                        onClick={() => onStepSelect(stepIdx - 1)}
                                        className="relative w-8 h-8 flex items-center justify-center bg-background border-2 border-primary rounded-full z-10"
                                        aria-current="step"
                                    >
                                        <span className="h-2.5 w-2.5 bg-primary rounded-full" aria-hidden="true" />
                                    </button>
                                ) : ( // Upcoming
                                    <button
                                        onClick={() => onStepSelect(stepIdx - 1)}
                                        className="group relative w-8 h-8 flex items-center justify-center bg-background border-2 border-gray-300 rounded-full hover:border-gray-400 z-10"
                                    >
                                        <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" aria-hidden="true" />
                                    </button>
                                )}

                                {/* Label */}
                                <span className={cn(
                                    "text-xs",
                                    stepIdx === activeStep ? "text-primary font-semibold" : "text-muted-foreground"
                                )}>{step.name}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

const EncounterPage: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    
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
    
    const projectExists = projectForms.some(f => f.projectId === projectId);
    
    if (projectForms.length === 0 && !projectExists) { // Initial load state
        return (
             <div className="space-y-6">
                <PageHeader
                    title="Loading Encounter..."
                    subtitle="Preparing data submission forms..."
                    icon={PiListChecksDuotone}
                />
            </div>
        )
    }
    
    const availableFormsForSubmission = React.useMemo(() => {
        return projectForms.filter(f => f.projectId === projectId);
    }, [projectForms, projectId]);

    const currentForm = (currentFormIndex >= 0 && currentFormIndex < formSequence.length)
        ? formSequence[currentFormIndex]
        : null;

    useEffect(() => {
        if (isEncounterActive) {
            if (currentForm) {
                setCurrentStepFormData(allFormsData[currentForm.id] || {});
            } else {
                 // Handles patient info and review steps
                setCurrentStepFormData({});
            }
        }
    }, [currentForm, currentFormIndex, isEncounterActive, allFormsData]);

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

    const handleStepSelect = (index: number) => {
        if (currentForm) {
            saveCurrentForm(currentForm.id, currentStepFormData);
        }
        setCurrentFormIndex(index);
    };
    
    const handleSaveAndExit = () => {
        if (currentForm) {
            saveCurrentForm(currentForm.id, currentStepFormData);
        }
        navigate(`/project/${projectId}/submissions`);
    }

    const handleSubmitAndExit = () => {
        if (currentForm) {
            saveCurrentForm(currentForm.id, currentStepFormData);
        }
        alert('Submitting all data to the backend (see console).');
        console.log({
            patientData,
            allFormsData
        });
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
        if (!currentForm) return null;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{currentForm.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormRendererV2
                        form={currentForm}
                        formData={currentStepFormData}
                        onFormDataChange={setCurrentStepFormData}
                    />
                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => handleStepSelect(currentFormIndex - 1)} disabled={currentFormIndex === 0}>
                        <PiArrowLeft className="mr-2" /> Previous
                    </Button>
                    <Button onClick={() => handleStepSelect(currentFormIndex + 1)}>
                        {currentFormIndex === formSequence.length - 1 ? 'Go to Review' : 'Next Form'} <PiArrowRight className="ml-2" />
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
                    <div key={formDef.id}>
                        <h3 className="font-semibold mb-2">{formDef.name}</h3>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{JSON.stringify(allFormsData[formDef.id] || { message: "No data entered for this form." }, null, 2)}</pre>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => handleStepSelect(currentFormIndex - 1)}><PiArrowLeft className="mr-2" /> Back to Edit</Button>
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
        return null;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Submission"
                subtitle="Collect and submit clinical research data for your active project."
                icon={PiListChecksDuotone}
            >
                 {isEncounterActive && (
                    <Button variant="outline" onClick={handleSaveAndExit}>
                        <PiArrowLeft className="mr-2" />
                        Save & Exit
                    </Button>
                )}
            </PageHeader>
            
            {isEncounterActive && <SubmissionStepper onStepSelect={handleStepSelect} />}
            {renderContent()}
            <DraftStatusBar />
        </div>
    );
};

export default EncounterPage;