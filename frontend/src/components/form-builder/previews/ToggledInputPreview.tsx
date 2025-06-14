import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { InputField } from '@/components/ui/InputField';
import { cn } from '@/lib/utils';

interface ToggledInputPreviewProps {
    fieldId: string;
    fieldSchema: any;
}

const ToggledInputPreview: React.FC<ToggledInputPreviewProps> = ({ fieldId, fieldSchema }) => {
    return (
        <div className="flex items-center gap-2 pointer-events-none p-2 opacity-70">
            <Checkbox id={`preview-toggle-${fieldId}`} defaultChecked readOnly disabled />
            <div className="flex-grow">
                <InputField
                    id={`preview-input-${fieldId}`}
                    type={fieldSchema.type === 'string' ? 'text' : 'number'}
                    label={fieldSchema.title}
                    containerClassName='gap-0'
                    className='h-8'
                    value={fieldSchema.type === 'number' ? '123' : '...'}
                    disabled
                />
            </div>
        </div>
    );
};

export default ToggledInputPreview; 