// src/pages/project/DataSubmissionsHubPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import InfoWidget from '@/components/project/InfoWidget';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
    PiListChecksDuotone, 
    PiPlusCircleDuotone, 
    PiHourglassSimpleDuotone, 
    PiCheckCircleDuotone, 
    PiWarningCircleDuotone,
    PiUserFocusDuotone
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

type EncounterStatus = 'In Progress' | 'Completed' | 'Flagged for Review';

interface MockEncounter {
    id: string;
    patientId: string;
    patientInfo: string; // e.g., 'JS / M / 2017-02-04'
    status: EncounterStatus;
    currentStep: number;
    totalSteps: number;
    currentStepName: string;
    updated: string;
    submittedBy: string; // userId
}

// More detailed mock data
const mockEncounters: MockEncounter[] = [
    { id: 'enc-001', patientId: 'p-xyz-123', patientInfo: 'JS / M / 2017-02-04', status: 'In Progress', currentStep: 2, totalSteps: 4, currentStepName: 'Intraoperatória', updated: '5m ago', submittedBy: 'userLead123' },
    { id: 'enc-002', patientId: 'p-abc-456', patientInfo: 'AB / F / 2018-05-10', status: 'Completed', currentStep: 4, totalSteps: 4, currentStepName: 'N/A', updated: '2h ago', submittedBy: 'user456' },
    { id: 'enc-003', patientId: 'p-def-789', patientInfo: 'CD / M / 2016-11-22', status: 'Flagged for Review', currentStep: 3, totalSteps: 4, currentStepName: 'Pós-operatório', updated: '1d ago', submittedBy: 'userLead123' },
    { id: 'enc-004', patientId: 'p-ghi-101', patientInfo: 'EF / F / 2019-01-15', status: 'In Progress', currentStep: 1, totalSteps: 4, currentStepName: 'Pré-Anestésica', updated: '3d ago', submittedBy: 'user456' },
];


const EncounterStatusBadge: React.FC<{ status: EncounterStatus }> = ({ status }) => {
    let variant: 'default' | 'secondary' | 'destructive';
    let textStyle: string;

    switch (status) {
        case 'Completed':
            variant = 'default';
            textStyle = 'text-primary-foreground';
            break;
        case 'Flagged for Review':
            variant = 'destructive';
            textStyle = 'text-destructive-foreground';
            break;
        case 'In Progress':
        default:
            variant = 'secondary';
            textStyle = 'text-secondary-foreground';
            break;
    }

    return <Badge variant={variant} className={cn('font-bold', textStyle)}>{status}</Badge>;
};


const DataSubmissionsHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuthStore();
    const { activeProjectDetails } = useProjectStore();
    
    // --- Role-based Logic ---
    const userRoles = activeProjectDetails?.members.find(m => m.userId === user?.id)?.roles || [];
    const primaryRole = userRoles.includes('ProjectLead') ? 'ProjectLead' 
                      : userRoles.includes('Researcher') ? 'Researcher' 
                      : userRoles.includes('DataEntry') ? 'DataEntry' 
                      : 'Unknown';
    
    // Mocking a "Blinded" role for demonstration
    const isBlinded = primaryRole === 'Researcher' && user?.id === 'blindedUser456';

    const getVisibleEncounters = () => {
        if (primaryRole === 'ProjectLead') {
            return mockEncounters;
        }
        if (isBlinded) {
            return mockEncounters; // Show all, but data will be masked
        }
        return mockEncounters.filter(enc => enc.submittedBy === user?.id);
    };

    const visibleEncounters = getVisibleEncounters();
    
    const summaryStats = {
        active: visibleEncounters.filter(e => e.status === 'In Progress').length,
        completed: visibleEncounters.filter(e => e.status === 'Completed').length,
        flagged: visibleEncounters.filter(e => e.status === 'Flagged for Review').length,
    };

    const handleStartNew = () => {
        navigate(`/project/${projectId}/submissions/new`);
    }
    
    const handleResume = (encounterId: string) => {
        navigate(`/project/${projectId}/submissions/${encounterId}`);
    }

    const renderPatientInfo = (encounter: MockEncounter) => {
        if (isBlinded) {
            return (
                <div>
                    <p className="font-medium">Patient #{encounter.patientId.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">[Anonymized]</p>
                </div>
            );
        }
        return (
            <div>
                <p className="font-medium">{encounter.patientInfo}</p>
                <p className="text-xs text-muted-foreground">ID: {encounter.id}</p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Data Submissions"
                subtitle="Manage ongoing patient encounters or start a new data submission."
                icon={PiListChecksDuotone}
            >
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                        <PiUserFocusDuotone className="w-5 h-5 text-primary"/>
                        <span>Viewing as: <strong className="text-foreground">{primaryRole}</strong></span>
                    </div>
                    <Button onClick={handleStartNew}>
                        <PiPlusCircleDuotone className="mr-2 h-5 w-5" />
                        Start New Encounter
                    </Button>
                </div>
            </PageHeader>
            
            {/* Summary Widgets */}
            <div className="grid gap-6 md:grid-cols-3">
                <InfoWidget title={primaryRole === 'ProjectLead' ? 'Active Encounters (All)' : 'My Active Encounters'} icon={PiHourglassSimpleDuotone}>
                    <div className="text-2xl font-bold">{summaryStats.active}</div>
                </InfoWidget>
                <InfoWidget title={primaryRole === 'ProjectLead' ? 'Completed Submissions (All)' : 'My Completed Submissions'} icon={PiCheckCircleDuotone}>
                    <div className="text-2xl font-bold">{summaryStats.completed}</div>
                </InfoWidget>
                <InfoWidget title="Flagged for Review" icon={PiWarningCircleDuotone}>
                    <div className="text-2xl font-bold">{summaryStats.flagged}</div>
                </InfoWidget>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submission Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Progress</th>
                                    {primaryRole === 'ProjectLead' && !isBlinded && <th className="px-6 py-3">Submitted By</th>}
                                    <th className="px-6 py-3">Last Updated</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleEncounters.map(enc => (
                                    <tr key={enc.id} className="border-b">
                                        <td className="px-6 py-4">{renderPatientInfo(enc)}</td>
                                        <td className="px-6 py-4"><EncounterStatusBadge status={enc.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-40 space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    Step {enc.currentStep} of {enc.totalSteps}: {enc.currentStepName}
                                                </p>
                                                <ProgressBar value={(enc.currentStep / enc.totalSteps) * 100} />
                                            </div>
                                        </td>
                                        {primaryRole === 'ProjectLead' && !isBlinded && <td className="px-6 py-4">{enc.submittedBy}</td>}
                                        <td className="px-6 py-4">{enc.updated}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleResume(enc.id)}>
                                                {enc.status === 'In Progress' ? 'Resume' : 'View'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {visibleEncounters.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <PiListChecksDuotone className="mx-auto h-12 w-12" />
                            <h3 className="mt-2 text-lg font-semibold">No submissions found.</h3>
                            <p className="mt-1 text-sm">Get started by creating a new encounter.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Showing {visibleEncounters.length} of {mockEncounters.length} total submissions.</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default DataSubmissionsHubPage;
