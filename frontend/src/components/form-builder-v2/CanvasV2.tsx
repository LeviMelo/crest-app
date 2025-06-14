import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormBuilderStoreV2 } from '@/stores/formBuilderStore.v2';
import { PiTrash, PiCopy, PiPlus } from 'react-icons/pi';
import { cn } from '@/lib/utils';

const FieldComponent: React.FC<{ fieldId: string }> = ({ fieldId }) => {
  const { getField, selectField, selectedFieldId, removeField, duplicateField } = useFormBuilderStoreV2();
  const field = getField(fieldId);

  if (!field) return null;

  const isSelected = selectedFieldId === fieldId;

  const getFieldIcon = () => {
    switch (field.type) {
      case 'text': return '📝';
      case 'number': return '🔢';
      case 'boolean': return '☑️';
      case 'single-choice': return '🔘';
      case 'multiple-choice': return '☑️';
      case 'date': return '📅';
      default: return '❓';
    }
  };

  const getFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <input 
            type="text" 
            placeholder={field.options.placeholder || 'Enter text...'} 
            className="w-full p-2 border rounded text-sm"
            disabled
          />
        );
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="0" 
              className="flex-1 p-2 border rounded text-sm"
              disabled
            />
            {field.options.unit && (
              <span className="text-sm text-muted-foreground">{field.options.unit}</span>
            )}
          </div>
        );
      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input type="checkbox" disabled />
            <span className="text-sm">{field.label}</span>
          </label>
        );
      case 'single-choice':
        return (
          <div className="space-y-2">
            {field.options.choices?.slice(0, 2).map((choice, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="radio" name={fieldId} disabled />
                <span className="text-sm">{choice.label}</span>
              </label>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {field.options.choices?.slice(0, 2).map((choice, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span className="text-sm">{choice.label}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return (
          <input 
            type="date" 
            className="w-full p-2 border rounded text-sm"
            disabled
          />
        );
      default:
        return <div className="p-2 text-sm text-muted-foreground">Unknown field type</div>;
    }
  };

  return (
    <div
      onClick={() => selectField(fieldId)}
      className={cn(
        "border-2 rounded-lg p-4 cursor-pointer transition-all",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFieldIcon()}</span>
          <div>
            <h4 className="font-medium text-sm">{field.label}</h4>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                duplicateField(fieldId);
              }}
            >
              <PiCopy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeField(fieldId);
              }}
            >
              <PiTrash className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="pointer-events-none opacity-70">
        {getFieldPreview()}
      </div>
    </div>
  );
};

const SectionComponent: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const { getSection, addField, selectField, selectedFieldId } = useFormBuilderStoreV2();
  const section = getSection(sectionId);

  if (!section) return null;

  const isSelected = selectedFieldId === sectionId;

  return (
    <div
      onClick={() => selectField(sectionId)}
      className={cn(
        "border-2 border-dashed rounded-lg p-4 transition-all",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{section.title}</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            addField('text', sectionId);
          }}
        >
          <PiPlus className="w-3 h-3 mr-1" />
          Add Field
        </Button>
      </div>
      
      <div className={cn(
        "grid gap-4",
        section.columns === 1 && "grid-cols-1",
        section.columns === 2 && "grid-cols-1 md:grid-cols-2",
        section.columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {section.fields.length > 0 ? (
          section.fields.map(fieldId => (
            <FieldComponent key={fieldId} fieldId={fieldId} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>No fields in this section</p>
            <p className="text-xs mt-1">Click "Add Field" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CanvasV2: React.FC = () => {
  const { currentForm, addSection } = useFormBuilderStoreV2();

  if (!currentForm) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Form Canvas</CardTitle>
          <CardDescription>No form loaded</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Create a new form or load an existing one to start building
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentForm.name}</CardTitle>
            <CardDescription>{currentForm.description}</CardDescription>
          </div>
          <Button onClick={addSection} variant="outline">
            <PiPlus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        <div className="space-y-6">
          {currentForm.layout.sections.length > 0 ? (
            currentForm.layout.sections.map(section => (
              <SectionComponent key={section.id} sectionId={section.id} />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                Your form is empty
              </p>
              <Button onClick={addSection}>
                <PiPlus className="w-4 h-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CanvasV2; 