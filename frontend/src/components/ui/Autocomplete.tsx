"use client"

import * as React from "react"
import { PiCheck, PiCaretUpDownDuotone } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Input } from "./Input"

interface AutocompleteProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
}

export function Autocomplete({ options, value, onChange, placeholder, searchPlaceholder, notFoundText }: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find(option => option.value.toLowerCase() === currentValue.toLowerCase());
    const finalValue = selectedOption ? selectedOption.value : currentValue;
    onChange(finalValue);
    setInputValue(selectedOption ? selectedOption.label : finalValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = e.target.value;
    setInputValue(textValue);
    onChange(textValue); 
    if(textValue.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
            <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full"
                onClick={() => { if(inputValue) setOpen(true) }}
            />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>{notFoundText || "No results found."}</CommandEmpty>
            <CommandGroup>
              {options
                .filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                .map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 