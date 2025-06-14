// src/pages/FormsLibraryPage.tsx
import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PiArchiveDuotone } from 'react-icons/pi';

const FormsLibraryPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Forms Library"
        subtitle="Browse, manage, and import reusable form templates across your projects."
        icon={PiArchiveDuotone}
        gradient="accent"
      />
      <div className="text-center py-16 bg-card border-2 border-dashed rounded-xl">
        <h3 className="text-xl font-semibold">Feature In Development</h3>
        <p className="text-muted-foreground mt-2">This area will allow you to manage a global library of forms.</p>
      </div>
    </div>
  );
};

export default FormsLibraryPage;