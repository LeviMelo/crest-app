// src/pages/DataSubmissionPage.tsx
import React, { useState, useEffect } from 'react';
import { useSubmissionStore, FormDefinition } from '@/stores/submissionStore';
import { useFormBuilderStore } from '@/stores/formBuilderStore'; // To get a form to render
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import DraftStatusBar from '@/components/forms/DraftStatusBar';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { PiListChecksDuotone } from 'react-icons/pi';

const DataSubmissionPage: React.FC = () => {
    const { patientData, updatePatientData, isEncounterActive, startNewEncounter, formData, setFormData, completeAndClearEncounter } = useSubmissionStore();
    
    // In a real app, you'd fetch this. We'll use the form from the builder store as a demo.
    const { schema, uiSchema, fieldOrder } = useFormBuilderStore();
    const MOCK_FORM_SEQUENCE: FormDefinition[] = [{ 
        key: 'built_form', 
        name: schema.title, 
        version: '1.0',
        // In a real app, these paths would point to a backend resource
        schemaPath: 'from_builder', 
        uiSchemaPath: 'from_builder' 
    }];

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
    
    const renderFormSequence = () => (
        <Card>
            <CardHeader><CardTitle>{schema.title}</CardTitle></CardHeader>
            <CardContent>
                <DynamicFormRenderer
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onFormDataChange={setFormData}
                    fieldOrder={fieldOrder}
                />
            </CardContent>
            <CardFooter>
                <Button onClick={completeAndClearEncounter} variant="destructive" className="mr-auto">Cancel</Button>
                <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>Submit</Button>
            </CardFooter>
        </Card>
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