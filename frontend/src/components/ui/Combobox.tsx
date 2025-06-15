"use client"

import * as React from "react"
import { PiCheck, PiCaretUpDownDuotone } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
}

export function Combobox({ options, value, onChange, placeholder, searchPlaceholder, notFoundText }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder || "Select option..."}
          <PiCaretUpDownDuotone className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              const list = e.currentTarget.querySelector("[cmdk-list]");
              if (list?.children.length === 1) {
                (list.children[0] as HTMLElement).click();
                e.preventDefault();
              }
            }
          }}
        >
          <CommandInput placeholder={searchPlaceholder || "Search..."} />
          <CommandEmpty>{notFoundText || "No option found."}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <PiCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 