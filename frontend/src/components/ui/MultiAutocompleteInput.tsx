import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { PiCheck, PiX } from 'react-icons/pi';
import { Button } from './Button';
import { Input } from './Input';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command';
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

const TAG_COLOR_MAP: { [key: string]: string } = {
  primary: 'bg-primary/20 text-primary-foreground',
  secondary: 'bg-slate-500/20 text-slate-800 dark:text-slate-200',
  accent: 'bg-amber-500/20 text-amber-800 dark:text-amber-200',
  success: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200',
  warning: 'bg-orange-500/20 text-orange-800 dark:text-orange-200',
  danger: 'bg-red-500/20 text-red-800 dark:text-red-200',
  blue: 'bg-blue-500/20 text-blue-800 dark:text-blue-200',
  indigo: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200',
  purple: 'bg-purple-500/20 text-purple-800 dark:text-purple-200',
  pink: 'bg-pink-500/20 text-pink-800 dark:text-pink-200',
  teal: 'bg-teal-500/20 text-teal-800 dark:text-teal-200',
  cyan: 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-200',
};

export const MultiAutocompleteInput: React.FC<MultiAutocompleteInputProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select or create...',
  color = 'primary',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Ensure value is always in the correct format
  const safeValue = {
    selected: Array.isArray(value?.selected) ? value.selected : [],
    custom: Array.isArray(value?.custom) ? value.custom : [],
  };

  const selectedValues = new Set(safeValue.selected);

  const handleUnselect = (optionValue: string) => {
    onChange({ ...safeValue, selected: safeValue.selected.filter(v => v !== optionValue) });
  };
  
  const handleRemoveCustom = (customValue: string) => {
    onChange({ ...safeValue, custom: safeValue.custom.filter(v => v !== customValue) });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newCustomValue = inputValue.trim();
      if (!safeValue.custom.includes(newCustomValue) && !options.some(opt => opt.label.toLowerCase() === newCustomValue.toLowerCase())) {
        onChange({ ...safeValue, custom: [...safeValue.custom, newCustomValue] });
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue) {
      if (safeValue.custom.length > 0) {
        handleRemoveCustom(safeValue.custom[safeValue.custom.length - 1]);
      } else if (safeValue.selected.length > 0) {
        handleUnselect(safeValue.selected[safeValue.selected.length - 1]);
      }
    }
  };

  const selectedOptions = options.filter(opt => selectedValues.has(opt.value));
  const displayedItems = [
    ...selectedOptions.map(opt => ({ type: 'selected' as const, ...opt })),
    ...safeValue.custom.map(val => ({ type: 'custom' as const, value: val, label: val }))
  ];

  const getTagStyle = (itemType: 'selected' | 'custom'): React.CSSProperties => {
    if (color.startsWith('#') && itemType === 'selected') {
      return { backgroundColor: `${color}33`, color: color };
    }
    return {};
  }
  
  const getTagClassName = (itemType: 'selected' | 'custom'): string => {
    if (itemType === 'custom') return 'bg-secondary text-secondary-foreground';
    if (color.startsWith('#')) return 'border border-current';
    return TAG_COLOR_MAP[color] || TAG_COLOR_MAP.primary;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="group w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1.5 p-2 items-center">
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
                  onClick={() => item.type === 'selected' ? handleUnselect(item.value) : handleRemoveCustom(item.value)}
                  className="rounded-full hover:bg-black/10 p-0.5"
                >
                  <PiX className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Remove {item.label}</span>
                </button>
              </div>
            ))}
            <Command>
              <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyDown}
                placeholder={displayedItems.length > 0 ? '' : placeholder}
                className="flex-1 bg-transparent border-none shadow-none h-auto p-0 focus-visible:ring-0 min-w-[120px]"
                onFocus={() => setIsOpen(true)}
              />
            </Command>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>
                {inputValue.trim() ? `Press Enter to add "${inputValue.trim()}"` : 'No results found.'}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        handleUnselect(option.value);
                      } else {
                        onChange({ ...safeValue, selected: [...safeValue.selected, option.value] });
                      }
                      setInputValue('');
                    }}
                    className="cursor-pointer"
                  >
                     <PiCheck className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 