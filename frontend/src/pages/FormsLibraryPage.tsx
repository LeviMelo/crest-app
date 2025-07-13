// src/pages/FormsLibraryPage.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PiBookOpenTextDuotone, PiEyeDuotone, PiDownloadDuotone, PiCopyDuotone } from 'react-icons/pi';
import { getAllFormTemplates } from '@/data/forms';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import JsonEditor from '@/components/form-builder/JsonEditor';

const FormsLibraryPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const templates = getAllFormTemplates();

  const handlePreviewTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setIsPreviewOpen(true);
  };

  const handleCopyTemplate = (template: any) => {
    const templateJson = JSON.stringify(template, null, 2);
    navigator.clipboard.writeText(templateJson);
    // You could add a toast notification here
  };

  const handleDownloadTemplate = (template: any) => {
    const templateJson = JSON.stringify(template, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedTemplateData = templates.find(t => t.key === selectedTemplate);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Forms Library"
        subtitle="Browse and manage form templates for medical data collection"
        icon={PiBookOpenTextDuotone}
        gradient="accent"
      >
        <div className="mb-4">
          <p className="text-muted-foreground text-lg">
            Explore our collection of pre-built medical form templates designed for clinical research.
          </p>
        </div>
      </PageHeader>
      
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <PiBookOpenTextDuotone className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No forms available</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The forms library is currently empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{template.fields.length} fields</span>
                    <span>{template.layout.sections.length} sections</span>
                    <span>v{template.version}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sections:</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.layout.sections.slice(0, 3).map((section) => (
                        <span 
                          key={section.id}
                          className="text-xs bg-muted px-2 py-1 rounded"
                          style={{ backgroundColor: `${section.styling.color}20` }}
                        >
                          {section.title}
                        </span>
                      ))}
                      {template.layout.sections.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{template.layout.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreviewTemplate(template.key)}
                    >
                      <PiEyeDuotone className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCopyTemplate(template)}
                    >
                      <PiCopyDuotone className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadTemplate(template)}
                    >
                      <PiDownloadDuotone className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplateData ? `Template: ${selectedTemplateData.name}` : 'Template Preview'}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplateData ? `Description: ${selectedTemplateData.description}` : 'Preview a form template to see its structure and JSON.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplateData && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplateData.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Form Structure</h3>
                <div className="space-y-3">
                  {selectedTemplateData.layout.sections.map((section) => (
                    <Card key={section.id}>
                      <CardHeader className="pb-3">
                        <CardTitle 
                          className="text-base"
                          style={{ color: section.styling.color }}
                        >
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {section.fields.map((fieldId) => {
                            const field = selectedTemplateData.fields.find(f => f.id === fieldId);
                            return field ? (
                              <div key={fieldId} className="flex items-center justify-between text-sm">
                                <span className="font-medium">{field.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-muted px-2 py-1 rounded">
                                    {field.type}
                                  </span>
                                  {field.required && (
                                    <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                                      Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">JSON Structure</h3>
                <div className="h-96">
                  <JsonEditor
                    jsonString={JSON.stringify(selectedTemplateData, null, 2)}
                    onJsonChange={() => {}} // Read-only
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormsLibraryPage;