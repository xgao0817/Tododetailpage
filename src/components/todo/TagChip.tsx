import React from 'react';
import { X } from 'lucide-react';

interface TagChipProps {
  tag: string;
  onRemove: () => void;
}

export function TagChip({ tag, onRemove }: TagChipProps) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs group transition-all duration-150 hover:bg-gray-50"
      style={{
        border: '1px solid #2E3A47',
        color: '#2E3A47',
      }}
    >
      <span>{tag}</span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded-full p-0.5"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
