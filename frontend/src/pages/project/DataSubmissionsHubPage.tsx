// src/pages/project/DataSubmissionsHubPage.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PiListChecksDuotone, PiPlusCircleDuotone } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom'; // + Import hooks
import PatientRegistrationModal from '@/components/forms/PatientRegistrationModal';
import { useSubmissionStore } from '@/stores/submissionStore';
import { mockProjectForms, SavedForm } from '@/data/mockForms';
import { FormDefinition } from '@/stores/submissionStore';

const DataSubmissionsHubPage: React.FC = () => {
    const navigate = useNavigate(); // + Get navigation function
    const { projectId } = useParams(); // + Get projectId from URL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { startNewEncounter, patientData } = useSubmissionStore();

    // In the future, this will fetch a list of encounters from a store
    const mockEncounters = [
        { id: 'enc-001', patient: 'JS / M / 2017-02-04', status: 'In Progress', step: 'Intraoperative', updated: '5m ago' },
        { id: 'enc-002', patient: 'AB / F / 2018-05-10', status: 'Completed', step: 'N/A', updated: '2h ago' },
        { id: 'enc-003', patient: 'CD / M / 2016-11-22', status: 'Flagged for Review', step: 'Post-Op', updated: '1d ago' },
    ];

    const handleStartNew = () => {
        setIsModalOpen(true);
    };
    
    const handleStartEncounter = () => {
        if (patientData) {
             const projectForms = mockProjectForms.filter(f => f.projectId === projectId);
             const formSequence: FormDefinition[] = projectForms.map((f: SavedForm) => ({
                key: f.id,
                name: f.name,
                version: '1.0', // placeholder
                schema: f.schema,
                uiSchema: f.uiSchema
             }));
            startNewEncounter(patientData, formSequence);
            navigate(`/project/${projectId}/submissions/new`);
        }
    };

    const handleResume = (encounterId: string) => {
        // + Navigate to the specific encounter page
        navigate(`/project/${projectId}/submissions/${encounterId}`);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Submissions"
                subtitle="Manage ongoing patient encounters or start a new data submission."
                icon={PiListChecksDuotone}
            >
                <Button onClick={handleStartNew}>
                    <PiPlusCircleDuotone className="mr-2 h-5 w-5" />
                    Start New Encounter
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Submission Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Current Step</th>
                                    <th className="px-6 py-3">Last Updated</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockEncounters.map(enc => (
                                    <tr key={enc.id} className="border-b">
                                        <td className="px-6 py-4 font-medium">{enc.patient}</td>
                                        <td className="px-6 py-4">{enc.status}</td>
                                        <td className="px-6 py-4">{enc.step}</td>
                                        <td className="px-6 py-4">{enc.updated}</td>
                                        <td className="px-6 py-4 text-right">
                                            {/* + Add onClick handler */}
                                            <Button variant="outline" size="sm" onClick={() => handleResume(enc.id)}>
                                                {enc.status === 'In Progress' ? 'Resume' : 'View'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Showing {mockEncounters.length} encounters.</p>
                </CardFooter>
            </Card>

            <PatientRegistrationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStartEncounter={handleStartEncounter}
            />
        </div>
    );
};

export default DataSubmissionsHubPage;