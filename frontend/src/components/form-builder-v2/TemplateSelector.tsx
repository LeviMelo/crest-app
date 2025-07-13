import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/Dialog';
import { PiBookOpenTextDuotone, PiPlus, PiEyeDuotone } from 'react-icons/pi';
import { getAllFormTemplates } from '@/data/forms';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';

const TemplateSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { createNewForm, clearErrors } = useFormBuilderStoreV2();

  const templates = getAllFormTemplates();

  const handleCreateFromTemplate = (templateKey: string) => {
    const template = templates.find(t => t.key === templateKey);
    if (template) {
      // Clear any existing errors first
      clearErrors();
      // Create a new form based on the template
      createNewForm('proj_crest_001', template);
      setIsOpen(false);
    }
  };

  const handlePreviewTemplate = (templateKey: string) => {
    setSelectedTemplate(selectedTemplate === templateKey ? null : templateKey);
  };

  const selectedTemplateData = templates.find(t => t.key === selectedTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PiBookOpenTextDuotone className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">From Template</span>
          <span className="sm:hidden">Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Form Template</DialogTitle>
          <DialogDescription>
            Select a pre-built form template to quickly create a new form with predefined fields and structure.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template List */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Available Templates
            </h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <Card 
                  key={template.key} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.key ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {template.fields.length} fields • {template.layout.sections.length} sections
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePreviewTemplate(template.key)}
                      >
                        <PiEyeDuotone className="w-4 h-4 mr-1" />
                        {selectedTemplate === template.key ? 'Hide' : 'Preview'}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleCreateFromTemplate(template.key)}
                      >
                        <PiPlus className="w-4 h-4 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Template Preview
            </h3>
            {selectedTemplateData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedTemplateData.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplateData.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Sections:</h4>
                    <div className="space-y-2">
                      {selectedTemplateData.layout.sections.map((section) => (
                        <div key={section.id} className="border rounded-lg p-3">
                          <h5 className="font-medium text-sm" style={{ color: section.styling.color }}>
                            {section.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {section.fields.length} fields
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {section.fields.slice(0, 3).map((fieldId) => {
                              const field = selectedTemplateData.fields.find(f => f.id === fieldId);
                              return field ? (
                                <span 
                                  key={fieldId}
                                  className="text-xs bg-muted px-2 py-1 rounded"
                                >
                                  {field.label}
                                </span>
                              ) : null;
                            })}
                            {section.fields.length > 3 && (
                              <span className="text-xs text-muted-foreground px-2 py-1">
                                +{section.fields.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleCreateFromTemplate(selectedTemplateData.key)}
                      className="w-full"
                    >
                      <PiPlus className="w-4 h-4 mr-2" />
                      Create Form from "{selectedTemplateData.name}"
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <PiBookOpenTextDuotone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a template to preview its structure
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector; 