// src/components/forms/DraftStatusBar.tsx
import React from 'react';
import { useSubmissionStore } from '@/stores/submissionStore';
import { PiCheckCircleDuotone } from 'react-icons/pi';

const DraftStatusBar: React.FC = () => {
  const { lastUpdateTimestamp, isEncounterActive } = useSubmissionStore();

  if (!isEncounterActive || !lastUpdateTimestamp) {
    return null;
  }

  const lastSavedTime = new Date(lastUpdateTimestamp).toLocaleTimeString();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center text-sm">
        <PiCheckCircleDuotone className="w-5 h-5 mr-2 text-green-500" />
        <span className="text-muted-foreground">Draft automatically saved at {lastSavedTime}</span>
      </div>
    </div>
  );
};

export default DraftStatusBar;