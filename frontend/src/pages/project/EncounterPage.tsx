// src/pages/project/EncounterPage.tsx
import React, { useState, useEffect } from 'react';
import { useSubmissionStore } from '@/stores/submissionStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import FormRendererV2 from '@/components/forms/FormRendererV2';
import { PiListChecksDuotone, PiArrowLeft, PiArrowRight, PiPaperPlaneTilt, PiCheck } from 'react-icons/pi';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useEncounterStore } from '@/stores/encounterStore';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox';
import { PatientInputData } from '@/types';

// A new component to render the patient info form within the encounter
const PatientInfoEditor: React.FC = () => {
    const { patientData, updatePatientData } = useSubmissionStore(state => ({
        patientData: state.patientData,
        updatePatientData: (newData: Partial<PatientInputData>) => {
            const currentData = useSubmissionStore.getState().patientData;
            useSubmissionStore.setState({ patientData: { ...currentData!, ...newData } });
        }
    }));

    if (!patientData) return null;

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        updatePatientData({ [id]: type === 'checkbox' ? checked : value });
    };

    return (
        <Card>
            <CardHeader><CardTitle>Patient Identification & Consent</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <InputField label="Patient Initials" id="initials" type="text" value={patientData.initials || ''} onChange={handleFieldChange} required />
                     <InputField label="Gender" id="gender" type="text" value={patientData.gender || ''} onChange={handleFieldChange} required />
                     <InputField label="Date of Birth" id="dob" type="date" value={patientData.dob || ''} onChange={handleFieldChange} required />
                 </div>
                 <div className="flex items-start space-x-3 pt-4 border-t">
                    <Checkbox id="projectConsent" checked={patientData.projectConsent} onChange={handleFieldChange} className="mt-1" />
                    <label htmlFor="projectConsent" className="text-sm text-muted-foreground">
                        I confirm that project-specific consent has been obtained from the patient or their legal guardian.
                        <span className="text-destructive"> *</span>
                    </label>
                 </div>
            </CardContent>
        </Card>
    );
};


const SubmissionStepper: React.FC<{
    onStepSelect: (index: number) => void;
}> = ({ onStepSelect }) => {
    const { formSequence, currentFormIndex } = useSubmissionStore();
    
    if (!formSequence || formSequence.length === 0) return null;

    // STEPS: [Patient Info, ...Forms, Review & Submit]
    const steps = [
        { name: 'Patient Info' },
        ...formSequence.map(form => ({ name: form.name })),
        { name: 'Review & Submit' },
    ];
    const activeStep = currentFormIndex;

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
                            {stepIdx < steps.length - 1 && (
                                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200" aria-hidden="true">
                                    {stepIdx < activeStep && <div className="h-full w-full bg-primary" />}
                                </div>
                            )}
                            <div className="relative flex flex-col items-center gap-2 text-center">
                                <button
                                    onClick={() => onStepSelect(stepIdx)}
                                    className="relative w-8 h-8 flex items-center justify-center rounded-full z-10"
                                >
                                    {stepIdx < activeStep ? (
                                        <div className="bg-primary rounded-full w-full h-full flex items-center justify-center">
                                            <PiCheck className="w-5 h-5 text-white" />
                                        </div>
                                    ) : stepIdx === activeStep ? (
                                        <div className="relative flex items-center justify-center bg-background border-2 border-primary rounded-full w-full h-full" aria-current="step">
                                            <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="relative flex items-center justify-center bg-background border-2 border-gray-300 rounded-full w-full h-full group-hover:border-gray-400">
                                            <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                                        </div>
                                    )}
                                </button>
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
    const { projectId, encounterId } = useParams<{ projectId: string, encounterId: string }>();
    
    const submissionStore = useSubmissionStore();
    const encounterStore = useEncounterStore();
    const [currentStepFormData, setCurrentStepFormData] = useState<any>({});
    
    useEffect(() => {
        if (encounterId && encounterId !== submissionStore.activeEncounterId) {
            const encounterToLoad = encounterStore.getEncounterById(encounterId);
            if (encounterToLoad) {
                submissionStore.loadEncounter(encounterToLoad);
            } else {
                console.error("Encounter not found, redirecting...");
                navigate(`/project/${projectId}/submissions`);
            }
        }
    }, [encounterId, submissionStore.activeEncounterId, projectId, navigate, encounterStore, submissionStore.loadEncounter]);

    // The current form definition based on the index (0 is patient info)
    const currentFormIndexInSequence = submissionStore.currentFormIndex - 1;
    const currentForm = currentFormIndexInSequence >= 0 && currentFormIndexInSequence < submissionStore.formSequence.length
        ? submissionStore.formSequence[currentFormIndexInSequence]
        : null;

    useEffect(() => {
        if (submissionStore.isEncounterActive && currentForm) {
            setCurrentStepFormData(submissionStore.allFormsData[currentForm.id] || {});
        } else {
             // Reset for non-form steps like Patient Info or Review
            setCurrentStepFormData({});
        }
    }, [currentForm, submissionStore.isEncounterActive, submissionStore.allFormsData]);

    const persistCurrentStepData = () => {
        // Persist patient data if on that step
        if (submissionStore.currentFormIndex === 0 && submissionStore.activeEncounterId) {
             encounterStore.updateEncounter(submissionStore.activeEncounterId, {
                patientData: submissionStore.patientData,
            });
        }
        // Persist form data if on a form step
        else if (currentForm && submissionStore.activeEncounterId) {
            submissionStore.updateLocalFormState(currentForm.id, currentStepFormData);
            encounterStore.updateEncounter(submissionStore.activeEncounterId, {
                allFormsData: { ...submissionStore.allFormsData, [currentForm.id]: currentStepFormData }
            });
        }
    };
    
    const handleStepSelect = (index: number) => {
        persistCurrentStepData();
        submissionStore.setCurrentFormIndex(index);
    };
    
    const handleSaveAndExit = () => {
        persistCurrentStepData();
        submissionStore.unloadEncounter(); // This saves and clears the session store
        navigate(`/project/${projectId}/submissions`);
    };

    const handleSubmitAndExit = () => {
        persistCurrentStepData();
        
        if (submissionStore.activeEncounterId) {
            const finalIndex = submissionStore.formSequence.length + 1;
            encounterStore.updateEncounter(submissionStore.activeEncounterId, { status: 'Completed', currentFormIndex: finalIndex });
        }
        submissionStore.clearStore();
        navigate(`/project/${projectId}/submissions`);
    };

    const renderPatientInfoStep = () => (
        <Card>
            <CardHeader><CardTitle>Patient Identification & Consent</CardTitle></CardHeader>
            <CardContent>
                <PatientInfoEditor />
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={() => handleStepSelect(1)}>
                    Next <PiArrowRight className="ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );

    const renderFormStep = () => {
        if (!currentForm) return null;
        
        return (
            <Card>
                <CardHeader><CardTitle>{currentForm.name}</CardTitle></CardHeader>
                <CardContent>
                    <FormRendererV2 form={currentForm} formData={currentStepFormData} onFormDataChange={setCurrentStepFormData} />
                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => handleStepSelect(submissionStore.currentFormIndex - 1)}>
                        <PiArrowLeft className="mr-2" /> Previous
                    </Button>
                    <Button onClick={() => handleStepSelect(submissionStore.currentFormIndex + 1)}>
                        Next <PiArrowRight className="ml-2" />
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
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{JSON.stringify(submissionStore.patientData, null, 2)}</pre>
                </div>
                {submissionStore.formSequence.map(formDef => (
                    <div key={formDef.id}>
                        <h3 className="font-semibold mb-2">{formDef.name}</h3>
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">{JSON.stringify(submissionStore.allFormsData[formDef.id] || { message: "No data entered." }, null, 2)}</pre>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => handleStepSelect(submissionStore.currentFormIndex - 1)}><PiArrowLeft className="mr-2" /> Back to Edit</Button>
                <Button onClick={handleSubmitAndExit}><PiPaperPlaneTilt className="mr-2" /> Submit Encounter</Button>
            </CardFooter>
        </Card>
    );

    const renderContent = () => {
        if (!submissionStore.isEncounterActive) return <p className="text-center text-muted-foreground">Loading...</p>;
        
        const index = submissionStore.currentFormIndex;
        
        if (index === 0) return renderPatientInfoStep();
        if (index > 0 && index <= submissionStore.formSequence.length) return renderFormStep();
        if (index === submissionStore.formSequence.length + 1) return renderReviewStep();

        return <p className="text-center text-destructive">Invalid Step: {index}</p>;
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Data Submission" subtitle="Collect and submit clinical research data for your active project." icon={PiListChecksDuotone}>
                 {submissionStore.isEncounterActive && (
                    <Button variant="outline" onClick={handleSaveAndExit}><PiArrowLeft className="mr-2" /> Save & Exit</Button>
                )}
            </PageHeader>
            
            <div className="sticky top-[calc(var(--header-height)+1rem)] z-20 -mx-6 px-6">
                {submissionStore.isEncounterActive && <SubmissionStepper onStepSelect={handleStepSelect} />}
            </div>

            <div className="pt-4">
                {renderContent()}
            </div>
            
            <DraftStatusBar />
        </div>
    );
};

export default EncounterPage;