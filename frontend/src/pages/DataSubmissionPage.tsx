// src/pages/DataSubmissionPage.tsx
import React from 'react';
import { useSubmissionStore } from '@/stores/submissionStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import { PiListChecksDuotone } from 'react-icons/pi';

const DataSubmissionPage: React.FC = () => {
    const { patientData, updatePatientData, isEncounterActive, startNewEncounter } = useSubmissionStore();

    const handleStart = () => {
        if (patientData?.initials && patientData?.gender && patientData?.dob && patientData.projectConsent) {
            // In a real app, form sequence would come from project config
            startNewEncounter(patientData, [/* MOCK_FORM_SEQUENCE */]);
        } else {
            alert("Please fill all required patient fields and provide consent.");
        }
    };
    
    const handlePatientFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        updatePatientData({ [id]: type === 'checkbox' ? checked : value });
    };

    // This is the initial patient identification step
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
    
    // This will render the multi-step form sequence
    const renderFormSequence = () => (
        <div className="text-center py-12 bg-card border rounded-lg">
            <h3 className="text-lg font-semibold">Form Sequence In Progress</h3>
            <p className="text-muted-foreground mt-1">The dynamic form renderer will display the current form here.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Submission"
                subtitle="Collect and submit clinical research data for your active project."
                icon={PiListChecksDuotone}
            />
            
            {isEncounterActive ? renderFormSequence() : renderPatientInput()}

            <DraftStatusBar />
        </div>
    );
};

export default DataSubmissionPage;