import React from 'react';
import { PiX } from 'react-icons/pi';
import { cn } from '@/lib/utils';

interface SelectedItemTagsProps {
  items: { value: string; label: string }[];
  noItemsText?: string;
}

const SelectedItemTags: React.FC<SelectedItemTagsProps> = ({ items, noItemsText = "No items selected." }) => {
  if (items.length === 0) {
    return <div className="text-xs text-muted-foreground p-2">{noItemsText}</div>;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[40px] pointer-events-none opacity-70">
      {items.map((item) => (
        <div
          key={item.value}
          className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
        >
          <span>{item.label}</span>
          <PiX className="w-3 h-3" />
        </div>
      ))}
    </div>
  );
};

export default SelectedItemTags; 