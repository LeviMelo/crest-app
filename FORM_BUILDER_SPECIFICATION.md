# CREST Form Builder - Complete Specification

## Executive Summary

The CREST Form Builder is a critical component that allows researchers to create dynamic, multi-step data collection forms for clinical research projects. The current implementation is fundamentally broken and requires a complete rebuild from the ground up.

## Current Problems (Why It's Broken)

### 1. **State Management Issues**
- Infinite render loops causing browser crashes
- Improper use of Zustand selectors
- State mutations not properly handled by Immer
- Memory leaks from uncontrolled re-renders

### 2. **Data Structure Problems**
- Overly complex nested schema structure
- Inconsistent field identification system
- Parent-child relationships poorly implemented
- JSON schema validation missing

### 3. **UI/UX Failures**
- Drag and drop completely non-functional
- Field selection and editing broken
- Inspector panel doesn't sync with canvas
- Mobile responsiveness inadequate

### 4. **Core Functionality Missing**
- Cannot create new forms from scratch
- Cannot save/load forms reliably
- Field properties don't persist
- Form preview doesn't work

## Requirements Specification

### 1. **Core User Stories**

#### As a Researcher, I want to:
- Create a new blank form with a title and description
- Add different types of fields (text, number, choice, etc.) to my form
- Arrange fields in sections and columns
- Configure field properties (labels, validation, styling)
- Preview how the form will look to data collectors
- Save my form and load it later for editing
- Export the form for use in data collection

#### As a Data Collector, I want to:
- Fill out forms that are easy to understand and navigate
- See clear labels and help text for each field
- Have validation that prevents errors
- Save my progress as I work

### 2. **Functional Requirements**

#### Form Creation
- **FR-001**: User can create a new blank form
- **FR-002**: User can set form title and description
- **FR-003**: User can add fields from a toolbox
- **FR-004**: User can delete fields
- **FR-005**: User can reorder fields via drag-and-drop

#### Field Types
- **FR-006**: Text input fields with placeholder text
- **FR-007**: Number input fields with units and validation
- **FR-008**: Boolean fields (checkbox/toggle)
- **FR-009**: Single choice fields (radio/dropdown)
- **FR-010**: Multiple choice fields (checkboxes)
- **FR-011**: Section containers for grouping fields

#### Field Configuration
- **FR-012**: User can edit field labels and descriptions
- **FR-013**: User can set field validation rules
- **FR-014**: User can configure field styling/colors
- **FR-015**: User can set field-specific options (units, choices, etc.)

#### Form Management
- **FR-016**: User can save forms to the project
- **FR-017**: User can load existing forms for editing
- **FR-018**: User can duplicate forms
- **FR-019**: User can delete forms

#### Preview and Testing
- **FR-020**: User can preview the form as it will appear to data collectors
- **FR-021**: User can test form functionality before deployment

### 3. **Technical Requirements**

#### Performance
- **TR-001**: Form builder must load in under 2 seconds
- **TR-002**: Adding/removing fields must be instantaneous
- **TR-003**: No memory leaks or infinite render loops
- **TR-004**: Smooth drag-and-drop with 60fps

#### Data Integrity
- **TR-005**: All form changes must be automatically saved as drafts
- **TR-006**: Form data must be validated before saving
- **TR-007**: Corrupted forms must be recoverable
- **TR-008**: Form versioning for change tracking

#### Compatibility
- **TR-009**: Works on desktop (Chrome, Firefox, Safari, Edge)
- **TR-010**: Responsive design for tablets
- **TR-011**: Touch-friendly interface for mobile devices
- **TR-012**: Keyboard navigation support

## Technical Architecture

### 1. **Data Model Redesign**

#### Simplified Form Structure
```typescript
interface Form {
  id: string;
  projectId: string;
  name: string;
  description: string;
  version: string;
  fields: Field[];
  layout: LayoutConfig;
  createdAt: Date;
  updatedAt: Date;
}

interface Field {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required: boolean;
  validation?: ValidationRule[];
  options: FieldOptions;
  styling: FieldStyling;
}

interface LayoutConfig {
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  fields: string[]; // Field IDs
  columns: number;
  styling: SectionStyling;
}
```

#### Field Types
```typescript
type FieldType = 
  | 'text'
  | 'number' 
  | 'boolean'
  | 'single-choice'
  | 'multiple-choice'
  | 'date'
  | 'section';
```

### 2. **State Management Redesign**

#### Store Structure
```typescript
interface FormBuilderState {
  // Current form being edited
  currentForm: Form | null;
  
  // UI state
  selectedFieldId: string | null;
  draggedFieldId: string | null;
  previewMode: boolean;
  
  // Available forms in project
  projectForms: Form[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  
  // Error handling
  errors: FormBuilderError[];
}
```

#### Actions (Simplified)
```typescript
interface FormBuilderActions {
  // Form management
  createNewForm: (projectId: string) => void;
  loadForm: (formId: string) => void;
  saveForm: () => Promise<void>;
  deleteForm: (formId: string) => void;
  
  // Field operations
  addField: (type: FieldType, sectionId?: string) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  moveField: (fieldId: string, targetSectionId: string, index: number) => void;
  
  // Section operations
  addSection: () => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  
  // UI operations
  selectField: (fieldId: string | null) => void;
  togglePreview: () => void;
}
```

### 3. **Component Architecture**

#### Main Components
```
FormBuilderPage
├── FormBuilderHeader (title, save, preview buttons)
├── FormBuilderToolbar (add field buttons)
├── FormBuilderCanvas (main editing area)
│   ├── SectionComponent (for each section)
│   │   └── FieldComponent (for each field)
│   └── DropZone (for adding fields)
├── FormBuilderInspector (field properties panel)
└── FormBuilderPreview (preview modal)
```

#### Component Responsibilities
- **FormBuilderPage**: Overall layout and state management
- **FormBuilderCanvas**: Drag-and-drop functionality and field rendering
- **FieldComponent**: Individual field rendering and selection
- **FormBuilderInspector**: Field property editing
- **FormBuilderPreview**: Form preview and testing

### 4. **Drag and Drop Implementation**

#### Requirements
- Use `@dnd-kit/core` for drag and drop
- Support dragging from toolbox to canvas
- Support reordering fields within sections
- Support moving fields between sections
- Visual feedback during drag operations

#### Implementation Strategy
```typescript
// Drag sources
const DRAG_TYPES = {
  NEW_FIELD: 'new-field',
  EXISTING_FIELD: 'existing-field'
} as const;

// Drop targets
const DROP_TARGETS = {
  SECTION: 'section',
  FIELD_POSITION: 'field-position'
} as const;
```

## Implementation Plan

### Phase 1: Foundation (Week 1)
1. **Data Model Implementation**
   - Create new TypeScript interfaces
   - Implement form validation functions
   - Create mock data for testing

2. **State Management Rebuild**
   - Implement new Zustand store
   - Add proper error handling
   - Implement auto-save functionality

3. **Basic UI Structure**
   - Create main layout components
   - Implement responsive design
   - Add basic styling

### Phase 2: Core Functionality (Week 2)
1. **Field Management**
   - Implement add/remove field operations
   - Create field property editing
   - Add field validation

2. **Section Management**
   - Implement section creation/deletion
   - Add section configuration
   - Implement column layouts

3. **Form Operations**
   - Implement save/load functionality
   - Add form duplication
   - Implement form deletion

### Phase 3: Advanced Features (Week 3)
1. **Drag and Drop**
   - Implement toolbox to canvas dragging
   - Add field reordering
   - Add visual feedback

2. **Preview System**
   - Create form preview modal
   - Implement form testing
   - Add validation preview

3. **Polish and Testing**
   - Performance optimization
   - Bug fixes
   - User testing

## Testing Strategy

### Unit Tests
- Form data model validation
- State management actions
- Individual component functionality

### Integration Tests
- Form creation workflow
- Field editing workflow
- Save/load operations

### End-to-End Tests
- Complete form building process
- Form preview and testing
- Cross-browser compatibility

### Performance Tests
- Load time measurements
- Memory usage monitoring
- Drag-and-drop performance

## Success Criteria

### Functional Success
- [ ] User can create a new form in under 30 seconds
- [ ] User can add all field types without errors
- [ ] User can configure field properties reliably
- [ ] User can save and reload forms without data loss
- [ ] Drag and drop works smoothly on all supported devices

### Technical Success
- [ ] No console errors during normal operation
- [ ] No memory leaks after extended use
- [ ] Form builder loads in under 2 seconds
- [ ] All automated tests pass
- [ ] Code coverage above 80%

### User Experience Success
- [ ] Users can complete form building tasks without training
- [ ] Interface is intuitive and responsive
- [ ] Error messages are clear and actionable
- [ ] Mobile interface is fully functional

## Risk Mitigation

### Technical Risks
- **Risk**: Complex drag-and-drop implementation
  - **Mitigation**: Start with simple implementation, iterate
- **Risk**: State management complexity
  - **Mitigation**: Use proven patterns, extensive testing
- **Risk**: Performance issues
  - **Mitigation**: Regular performance monitoring, optimization

### User Experience Risks
- **Risk**: Interface too complex
  - **Mitigation**: User testing, iterative design
- **Risk**: Mobile usability issues
  - **Mitigation**: Mobile-first design approach
- **Risk**: Data loss during editing
  - **Mitigation**: Auto-save, version control

## Conclusion

The current form builder is fundamentally broken and requires a complete rebuild. This specification provides a clear roadmap for creating a robust, user-friendly form builder that meets the needs of clinical researchers. The key to success will be:

1. **Simplified data model** that's easy to understand and maintain
2. **Robust state management** that prevents the current infinite loop issues
3. **Incremental implementation** with thorough testing at each phase
4. **User-centered design** that prioritizes usability over complexity

This rebuild should be treated as a new project, not a continuation of the existing broken implementation.

## Implementation Status

**Status: PHASE 1 IN PROGRESS**

### ✅ Completed
- **New Data Model**: Simplified field and section structure implemented
- **Core Store**: New Zustand store with proper state management (`formBuilderStore.v2.ts`)
- **Basic Components**: 
  - ToolboxV2: Clean field type selection
  - CanvasV2: Visual form builder with sections and fields
  - InspectorV2: Property editor for fields and sections
- **New Page**: ProjectFormBuilderPageV2 with mobile-responsive layout
- **Route**: Accessible at `/project/:projectId/builder-v2`

### 🚧 Current Phase 1 Tasks
- [ ] Add drag-and-drop functionality
- [ ] Implement form validation
- [ ] Add undo/redo functionality
- [ ] Create form preview mode
- [ ] Add form templates

### 📋 Next Phases
- **Phase 2**: Advanced features (conditional logic, validation rules)
- **Phase 3**: Aesthetic customization system
- **Phase 4**: Performance optimization and testing

### 🔗 Testing the New Builder
To test the new form builder:
1. Navigate to any project
2. Go to `/project/{projectId}/builder-v2`
3. The new simplified interface should load
4. Try adding fields, sections, and editing properties 