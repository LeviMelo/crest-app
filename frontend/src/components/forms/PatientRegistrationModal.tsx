import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Checkbox } from '@/components/ui/Checkbox';
import { PatientInputData } from '@/types';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartEncounter: (patientData: PatientInputData) => void;
}

const initialPatientState: PatientInputData = {
    initials: '',
    gender: '',
    dob: '',
    projectConsent: false,
};

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ isOpen, onClose, onStartEncounter }) => {
  const [patientData, setPatientData] = useState<PatientInputData>(initialPatientState);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setPatientData(prev => ({...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  // This allows checking the box with the spacebar when it's focused
  const handleCheckboxKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setPatientData(prev => ({...prev, projectConsent: !prev.projectConsent }));
    }
  };

  const canStart = patientData.initials && patientData.gender && patientData.dob && patientData.projectConsent;

  const handleStartClick = () => {
    if (canStart) {
      onStartEncounter(patientData);
      setPatientData(initialPatientState); // Reset for next time
      onClose();
    }
  };
  
  const handleClose = () => {
      setPatientData(initialPatientState); // Also reset on close
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Encounter</DialogTitle>
          <DialogDescription>
            Enter the patient's information below to begin data collection.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Patient Initials" id="initials" type="text" value={patientData.initials} onChange={handleFieldChange} required />
            <InputField label="Gender" id="gender" type="text" value={patientData.gender} onChange={handleFieldChange} required />
            <InputField label="Date of Birth" id="dob" type="date" value={patientData.dob} onChange={handleFieldChange} required />
          </div>
          <div className="flex items-start space-x-3 pt-4 border-t">
            <Checkbox id="projectConsent" checked={patientData.projectConsent} onChange={handleFieldChange} className="mt-1" />
            <label 
              htmlFor="projectConsent" 
              className="text-sm text-muted-foreground"
              tabIndex={0} // Make the label focusable
              onKeyDown={handleCheckboxKeyDown}
              role="checkbox"
              aria-checked={patientData.projectConsent}
            >
              I confirm that project-specific consent has been obtained from the patient or their legal guardian.
              <span className="text-destructive"> *</span>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleStartClick} disabled={!canStart}>
            Start Data Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistrationModal; 