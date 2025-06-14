import React from 'react';
import QuickSelectButtons from './QuickSelectButtons';
import SelectedItemTags from './SelectedItemTags';
import { InputField } from '@/components/ui/InputField';

interface AutocompletePreviewProps {
    fieldSchema: any;
    uiOptions: any;
}

const AutocompletePreview: React.FC<AutocompletePreviewProps> = ({ fieldSchema, uiOptions }) => {
    const allOptions = (fieldSchema.items.enum || []).map((val: string, i: number) => ({
        value: val,
        label: fieldSchema.items.enumNames?.[i] || val,
    }));
    
    const quickOptions = allOptions.filter((opt: { value: string }) => 
        (uiOptions.quickOptions || []).includes(opt.value)
    );
    
    // Show the first quick option as selected for a realistic preview
    const selectedItems = quickOptions.length > 0 ? [quickOptions[0]] : [];
    
    return (
        <div className="space-y-3 pointer-events-none opacity-70">
            <h3 className="text-sm font-medium">{fieldSchema.title}</h3>
            <div className='p-3 border rounded-md space-y-3 bg-background/50'>
                {quickOptions.length > 0 && (
                    <div>
                        <label className='block text-xs font-medium text-muted-foreground mb-1'>Comuns:</label>
                        <QuickSelectButtons options={quickOptions} selectedValues={selectedItems.map(i => i.value)} />
                    </div>
                )}
                <InputField
                    id={`preview-ac-${fieldSchema.title}`}
                    label="Buscar Outro:"
                    containerClassName='gap-1'
                    className='h-8'
                    placeholder="Digite para buscar..."
                    disabled
                />
                <div>
                    <label className='block text-xs font-medium text-muted-foreground mb-1'>Selecionados:</label>
                    <SelectedItemTags items={selectedItems} noItemsText="-" />
                </div>
            </div>
        </div>
    );
};

export default AutocompletePreview; 