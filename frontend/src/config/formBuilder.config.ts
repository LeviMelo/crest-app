// src/config/formBuilder.config.ts
import { PiTextT, PiNumberCircleOne, PiToggleLeft, PiListDashes, PiListNumbers, PiColumnsDuotone, PiPaintBrushBroadDuotone } from 'react-icons/pi';

export type FieldPrimitiveType = 'text' | 'number' | 'boolean' | 'singleChoice' | 'multipleChoice' | 'date' | 'section';
export type FieldColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';

export const FIELD_COLORS: { name: FieldColor, className: string }[] = [
    { name: 'primary', className: 'border-primary/50 bg-primary/5 text-primary' },
    { name: 'secondary', className: 'border-slate-500/50 bg-slate-500/5 text-slate-600 dark:text-slate-300' },
    { name: 'accent', className: 'border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
    { name: 'success', className: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' },
    { name: 'warning', className: 'border-orange-500/50 bg-orange-500/5 text-orange-600 dark:text-orange-400' },
    { name: 'danger', className: 'border-red-500/50 bg-red-500/5 text-red-600 dark:text-red-400' },
];

export interface FieldPrimitive {
  type: FieldPrimitiveType;
  label: string;
  icon: React.ComponentType<any>;
  defaultSchema: any;
  defaultUiSchema: any;
}

export const FORM_BUILDER_PRIMITIVES: FieldPrimitive[] = [
  {
    type: 'section',
    label: 'Section',
    icon: PiColumnsDuotone,
    defaultSchema: {
      type: 'object',
      title: 'Untitled Section',
      description: '',
      properties: {},
    },
    defaultUiSchema: {
      'ui:widget': 'SectionWidget',
      'ui:order': [],
      'ui:options': {
        columns: 1,
        color: 'secondary',
      },
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: PiTextT,
    defaultSchema: {
      type: 'string',
      title: 'Untitled Text Field',
      description: '',
    },
    defaultUiSchema: {
      'ui:widget': 'TextWidget',
      'ui:options': {
        placeholder: 'Enter text...',
        color: 'primary',
      },
    },
  },
  {
    type: 'number',
    label: 'Number',
    icon: PiNumberCircleOne,
    defaultSchema: {
      type: 'number',
      title: 'Untitled Number Field',
      description: '',
    },
    defaultUiSchema: {
      'ui:widget': 'NumberWidget',
      'ui:options': {
        unit: '',
        enabledInputs: ['inputBox'],
        color: 'primary',
      },
    },
  },
  {
    type: 'boolean',
    label: 'Boolean',
    icon: PiToggleLeft,
    defaultSchema: {
      type: 'boolean',
      title: 'Untitled Boolean Field',
      description: '',
    },
    defaultUiSchema: {
      'ui:widget': 'BooleanWidget',
      'ui:options': {
        displayAs: 'checkbox', // or 'toggle'
        trueLabel: 'Yes',
        falseLabel: 'No',
        color: 'primary',
      },
    },
  },
    {
    type: 'singleChoice',
    label: 'Single Choice',
    icon: PiListNumbers,
    defaultSchema: {
      type: 'string',
      title: 'Untitled Single Choice',
      description: '',
      enum: ['option1', 'option2'],
      enumNames: ['Option 1', 'Option 2'],
    },
    defaultUiSchema: {
      'ui:widget': 'ChoiceWidget',
      'ui:options': {
        displayAs: 'radio', // or 'dropdown'
        color: 'primary',
      },
    },
  },
    {
    type: 'multipleChoice',
    label: 'Multiple Choice',
    icon: PiListDashes,
    defaultSchema: {
      type: 'array',
      title: 'Untitled Multiple Choice',
      description: '',
      items: {
        type: 'string',
        enum: ['option1', 'option2'],
        enumNames: ['Option 1', 'Option 2'],
      },
      uniqueItems: true,
    },
    defaultUiSchema: {
      'ui:widget': 'ChoiceWidget',
      'ui:options': {
        displayAs: 'button-group',
        color: 'primary',
      },
    },
  },
];