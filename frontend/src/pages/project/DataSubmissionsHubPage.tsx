// src/pages/project/DataSubmissionsHubPage.tsx
import React, { useState } from 'react';
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
import { useEncounterStore, Encounter } from '@/stores/encounterStore';
import { useSubmissionStore } from '@/stores/submissionStore';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';
import { PatientInputData } from '@/types';
import PatientRegistrationModal from '@/components/forms/PatientRegistrationModal';

const EncounterStatusBadge: React.FC<{ status: Encounter['status'] }> = ({ status }) => {
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
    const { getEncountersByProject } = useEncounterStore();
    const { loadEncounter } = useSubmissionStore();
    const { projectForms } = useFormBuilderStoreV2();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // --- Role-based Logic ---
    const userRoles = activeProjectDetails?.members.find(m => m.userId === user?.id)?.roles || [];
    const primaryRole = userRoles.includes('ProjectLead') ? 'ProjectLead' 
                      : userRoles.includes('Researcher') ? 'Researcher' 
                      : userRoles.includes('DataEntry') ? 'DataEntry' 
                      : 'Unknown';
    
    const isBlinded = primaryRole === 'Researcher' && user?.id === 'blindedUser456';

    const getVisibleEncounters = () => {
        const projectEncounters = getEncountersByProject(projectId || '');
        if (primaryRole === 'ProjectLead' || isBlinded) {
            return projectEncounters;
        }
        // Data Entry and Researchers see only their own encounters
        return projectEncounters.filter(enc => enc.submittedById === user?.id);
    };

    const visibleEncounters = getVisibleEncounters();
    
    const summaryStats = {
        active: visibleEncounters.filter(e => e.status === 'In Progress').length,
        completed: visibleEncounters.filter(e => e.status === 'Completed').length,
        flagged: visibleEncounters.filter(e => e.status === 'Flagged for Review').length,
    };

    const handleStartNew = () => {
        setIsModalOpen(true);
    };

    const handleStartEncounter = (patientData: PatientInputData) => {
        if (!projectId || !user) return;

        const formsForProject = projectForms.filter(f => f.projectId === projectId);
        if (formsForProject.length === 0) {
            alert("This project has no forms. Please create them in the Form Builder.");
            return;
        }

        const newEncounter: Encounter = {
            id: `enc_${Date.now()}`,
            projectId,
            submittedById: user.id,
            patientData,
            status: 'In Progress',
            formSequence: formsForProject,
            currentFormIndex: 1, // START on the first form, not patient info
            allFormsData: {},
            lastUpdateTimestamp: Date.now(),
            createdAt: Date.now(),
        };

        useEncounterStore.getState().addEncounter(newEncounter);
        loadEncounter(newEncounter);
        navigate(`/project/${projectId}/submissions/${newEncounter.id}`);
    };
    
    const handleResume = (encounterId: string) => {
        const encounter = useEncounterStore.getState().getEncounterById(encounterId);
        if (encounter) {
            loadEncounter(encounter);
            navigate(`/project/${projectId}/submissions/${encounterId}`);
        }
    };

    const renderPatientInfo = (encounter: Encounter) => {
        if (isBlinded) {
            return (
                <div>
                    <p className="font-medium">Patient #{encounter.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">[Anonymized]</p>
                </div>
            );
        }
        if (!encounter.patientData) {
            return (
                 <div>
                    <p className="font-medium text-destructive">Patient Data Missing</p>
                    <p className="text-xs text-muted-foreground">ID: {encounter.id}</p>
                </div>
            )
        }
        return (
            <div>
                <p className="font-medium">{encounter.patientData.initials} / {encounter.patientData.gender} / {encounter.patientData.dob}</p>
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
                <InfoWidget title="Active Encounters" icon={PiHourglassSimpleDuotone}>
                    <div className="text-2xl font-bold">{summaryStats.active}</div>
                </InfoWidget>
                <InfoWidget title="Completed Submissions" icon={PiCheckCircleDuotone}>
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
                                    {primaryRole === 'ProjectLead' && !isBlinded && (
                                        <th className="px-6 py-3">Submitted By</th>
                                    )}
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Progress</th>
                                    <th className="px-6 py-3">Last Updated</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleEncounters.map(enc => (
                                    <tr key={enc.id} className="border-b">
                                        <td className="px-6 py-4">{renderPatientInfo(enc)}</td>
                                        {primaryRole === 'ProjectLead' && !isBlinded && (
                                            <td className="px-6 py-4 text-xs">{enc.submittedById}</td>
                                        )}
                                        <td className="px-6 py-4"><EncounterStatusBadge status={enc.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-40 space-y-1">
                                                {enc.status === 'Completed' ? (
                                                    <p className="text-xs text-muted-foreground">Completed</p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        Step {enc.currentFormIndex} of {enc.formSequence.length + 1}
                                                    </p>
                                                )}
                                                <ProgressBar 
                                                    value={
                                                        enc.status === 'Completed' 
                                                        ? 100 
                                                        : (enc.currentFormIndex / (enc.formSequence.length + 1)) * 100
                                                    } 
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{new Date(enc.lastUpdateTimestamp).toLocaleString()}</td>
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
                    <p className="text-xs text-muted-foreground">Showing {visibleEncounters.length} encounters.</p>
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
