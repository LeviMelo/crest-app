import React, { useState, useRef, useEffect } from 'react';
import { PiCheck, PiX } from 'react-icons/pi';
import { Button } from './Button';
import { Input } from './Input';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command';
import { cn } from '@/lib/utils';

interface MultiAutocompleteProps {
  options: { value: string; label: string }[];
  value: {
    selected: string[];
    custom: string[];
  };
  onChange: (value: { selected: string[]; custom:string[] }) => void;
  placeholder?: string;
  color?: string;
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

export const MultiAutocompleteInput: React.FC<MultiAutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select or create...',
  color = 'primary',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = new Set(value.selected);

  const handleUnselect = (optionValue: string) => {
    onChange({ ...value, selected: value.selected.filter(v => v !== optionValue) });
  };
  
  const handleRemoveCustom = (customValue: string) => {
    onChange({ ...value, custom: value.custom.filter(v => v !== customValue) });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (!value.custom.includes(inputValue) && !options.some(opt => opt.label === inputValue)) {
        onChange({ ...value, custom: [...value.custom, inputValue] });
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue) {
      if (value.custom.length > 0) {
        handleRemoveCustom(value.custom[value.custom.length - 1]);
      } else if (value.selected.length > 0) {
        handleUnselect(value.selected[value.selected.length - 1]);
      }
    }
  };

  const selectedOptions = options.filter(opt => selectedValues.has(opt.value));
  const displayedItems = [
    ...selectedOptions.map(opt => ({ type: 'selected' as const, ...opt })),
    ...value.custom.map(val => ({ type: 'custom' as const, value: val, label: val }))
  ];

  const getTagStyle = (itemType: 'selected' | 'custom'): React.CSSProperties => {
    if (color.startsWith('#') && itemType === 'selected') {
        return { backgroundColor: `${color}33` };
    }
    return {};
  }
  
  const getTagClassName = (itemType: 'selected' | 'custom'): string => {
    if (itemType === 'custom') return 'bg-secondary text-secondary-foreground';
    
    if (color.startsWith('#')) return '';

    return TAG_COLOR_MAP[color] || TAG_COLOR_MAP.primary;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="group w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1.5 p-2">
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
          <PopoverTrigger asChild>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={displayedItems.length > 0 ? '' : placeholder}
              className="flex-1 bg-transparent border-none shadow-none h-auto p-0 focus-visible:ring-0"
              onFocus={() => setIsOpen(true)}
            />
          </PopoverTrigger>
        </div>
      </div>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            ref={inputRef}
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
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
                        onChange({ ...value, selected: [...value.selected, option.value] });
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