// src/config/formBuilder.config.ts
import { PiTextT, PiNumberCircleOne, PiToggleLeft, PiListDashes, PiListNumbers } from 'react-icons/pi';

export type FieldPrimitiveType = 'text' | 'number' | 'boolean' | 'singleChoice' | 'multipleChoice' | 'date';

export interface FieldPrimitive {
  type: FieldPrimitiveType;
  label: string;
  icon: React.ComponentType<any>;
  defaultSchema: any;
  defaultUiSchema: any;
}

export const FORM_BUILDER_PRIMITIVES: FieldPrimitive[] = [
  {
    type: 'text',
    label: 'Text',
    icon: PiTextT,
    defaultSchema: {
      type: 'string',
      title: 'Untitled Text Field',
    },
    defaultUiSchema: {
      'ui:widget': 'TextWidget',
      'ui:options': {
        placeholder: 'Enter text...',
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
    },
    defaultUiSchema: {
      'ui:widget': 'NumberWidget',
      'ui:options': {
        unit: '',
        enabledInputs: ['inputBox'],
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
    },
    defaultUiSchema: {
      'ui:widget': 'BooleanWidget',
      'ui:options': {
        displayAs: 'checkbox', // or 'toggle'
        trueLabel: 'Yes',
        falseLabel: 'No',
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
      enum: ['option1', 'option2'],
      enumNames: ['Option 1', 'Option 2'],
    },
    defaultUiSchema: {
      'ui:widget': 'ChoiceWidget',
      'ui:options': {
        displayAs: 'radio', // or 'dropdown'
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
        displayAs: 'checkboxGroup',
      },
    },
  },
];