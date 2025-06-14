import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox';
import { useSubmissionStore } from '@/stores/submissionStore';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartEncounter: () => void;
}

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ isOpen, onClose, onStartEncounter }) => {
  const { patientData, updatePatientData } = useSubmissionStore();

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    updatePatientData({ [id]: type === 'checkbox' ? checked : value });
  };

  const canStart = patientData?.initials && patientData?.gender && patientData?.dob && patientData.projectConsent;

  const handleStartClick = () => {
    if (canStart) {
      onStartEncounter();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Encounter</DialogTitle>
          <DialogDescription>
            Enter the patient's information below to begin data collection.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Patient Initials" id="initials" type="text" value={patientData?.initials || ''} onChange={handleFieldChange} required />
            <InputField label="Gender" id="gender" type="text" value={patientData?.gender || ''} onChange={handleFieldChange} required />
            <InputField label="Date of Birth" id="dob" type="date" value={patientData?.dob || ''} onChange={handleFieldChange} required />
          </div>
          <div className="flex items-start space-x-3 pt-4 border-t">
            <Checkbox id="projectConsent" checked={patientData?.projectConsent || false} onChange={handleFieldChange} className="mt-1" />
            <label htmlFor="projectConsent" className="text-sm text-muted-foreground">
              I confirm that project-specific consent has been obtained from the patient or their legal guardian.
              <span className="text-destructive"> *</span>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleStartClick} disabled={!canStart}>
            Start Data Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistrationModal; 