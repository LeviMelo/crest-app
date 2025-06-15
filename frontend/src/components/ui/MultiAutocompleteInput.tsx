import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { PiCheck, PiX, PiPlusCircleDuotone, PiCaretDown } from 'react-icons/pi';
import { cn } from '@/lib/utils';

// This is a completely new, more robust component for handling multiple selections with custom additions.
// It will be used for the 'autocomplete' variant of the Text field and the 'textFallback' of Choice fields.

interface MultiAutocompleteInputProps {
  options: { value: string; label: string }[];
  value: {
    selected: string[];
    custom: string[];
  };
  onChange: (value: { selected: string[]; custom: string[] }) => void;
  placeholder?: string;
  color?: string; // For styling the tags
}

export const MultiAutocompleteInput: React.FC<MultiAutocompleteInputProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select or create...',
  color = '#3b82f6', // Default to blue
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure value is always in the correct format
  const safeValue = {
    selected: Array.isArray(value?.selected) ? value.selected : [],
    custom: Array.isArray(value?.custom) ? value.custom : [],
  };

  const selectedValuesSet = new Set(safeValue.selected);

  // Filter options based on input
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedValuesSet.has(option.value)
  );

  // Check if we can create a custom value
  const canCreateCustom = inputValue.trim() && 
    !safeValue.custom.includes(inputValue.trim()) &&
    !options.some(opt => opt.label.toLowerCase() === inputValue.trim().toLowerCase());

  const allDropdownItems = [
    ...filteredOptions.map(opt => ({ type: 'option' as const, ...opt })),
    ...(canCreateCustom ? [{ type: 'create' as const, value: inputValue.trim(), label: `Create "${inputValue.trim()}"` }] : [])
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue('');
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectOption = (optionValue: string) => {
    const newSelected = new Set(selectedValuesSet);
    if (newSelected.has(optionValue)) {
      newSelected.delete(optionValue);
    } else {
      newSelected.add(optionValue);
    }
    onChange({ ...safeValue, selected: Array.from(newSelected) });
  };
  
  const handleRemoveCustom = (customValue: string) => {
    onChange({ ...safeValue, custom: safeValue.custom.filter(v => v !== customValue) });
  };
  
  const addCustomValue = (customValue: string) => {
    if (customValue && !safeValue.custom.includes(customValue) && !options.some(opt => opt.label.toLowerCase() === customValue.toLowerCase())) {
      onChange({ ...safeValue, custom: [...safeValue.custom, customValue] });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, allDropdownItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < allDropdownItems.length) {
          const item = allDropdownItems[focusedIndex];
          if (item.type === 'option') {
            handleSelectOption(item.value);
          } else if (item.type === 'create') {
            addCustomValue(inputValue.trim());
          }
          setInputValue('');
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setInputValue('');
        setFocusedIndex(-1);
        break;
      case 'Backspace':
        if (inputValue === '') {
          e.preventDefault();
          if (safeValue.custom.length > 0) {
            handleRemoveCustom(safeValue.custom[safeValue.custom.length - 1]);
          } else if (safeValue.selected.length > 0) {
            const lastSelected = safeValue.selected[safeValue.selected.length - 1];
            handleSelectOption(lastSelected);
          }
        }
        break;
    }
  };

  const selectedOptions = options.filter(opt => selectedValuesSet.has(opt.value));
  const displayedItems = [
    ...selectedOptions.map(opt => ({ type: 'selected' as const, ...opt })),
    ...safeValue.custom.map(val => ({ type: 'custom' as const, value: val, label: val }))
  ];

  const getTagStyle = (itemType: 'selected' | 'custom'): React.CSSProperties => {
    if (color.startsWith('#') && itemType === 'selected') {
      return { backgroundColor: `${color}1a`, borderColor: color, color: color };
    }
    return {};
  }
  
  const getTagClassName = (itemType: 'selected' | 'custom'): string => {
    if (itemType === 'custom') return 'bg-secondary text-secondary-foreground border-secondary';
    // Base classes for tags
    return 'border';
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="group w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-1.5 p-2 min-h-[40px] items-center">
          {displayedItems.map((item) => (
            <div
              key={`${item.type}-${item.value}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                getTagClassName(item.type)
              )}
              style={getTagStyle(item.type)}
            >
              {item.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.type === 'selected') {
                    handleSelectOption(item.value);
                  } else {
                    handleRemoveCustom(item.value);
                  }
                }}
                className="rounded-full hover:bg-black/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <PiX className="h-3 w-3" />
                <span className="sr-only">Remove {item.label}</span>
              </button>
            </div>
          ))}
          <div className="flex-1 flex items-center min-w-[120px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!isOpen) setIsOpen(true);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={displayedItems.length === 0 ? placeholder : ''}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <PiCaretDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card/95 backdrop-blur-xl border rounded-md shadow-lg max-h-60 overflow-auto">
          {allDropdownItems.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              {inputValue ? 'No options found' : 'Start typing to search...'}
            </div>
          ) : (
            <div className="p-1">
              {allDropdownItems.map((item, index) => (
                <div
                  key={`${item.type}-${item.value}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer transition-colors",
                    index === focusedIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => {
                    if (item.type === 'option') {
                      handleSelectOption(item.value);
                    } else if (item.type === 'create') {
                      addCustomValue(inputValue.trim());
                    }
                    setInputValue('');
                    setFocusedIndex(-1);
                  }}
                >
                  {item.type === 'option' ? (
                    <>
                      <PiCheck className={cn("h-4 w-4", selectedValuesSet.has(item.value) ? "opacity-100" : "opacity-0")} />
                      {item.label}
                    </>
                  ) : (
                    <>
                      <PiPlusCircleDuotone className="h-4 w-4" />
                      {item.label}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 