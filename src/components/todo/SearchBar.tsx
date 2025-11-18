import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div 
      className="mb-6 flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200"
      style={{
        border: '1px solid #DADEE1',
        boxShadow: searchQuery ? '0 2px 12px rgba(165, 201, 242, 0.15)' : 'inset 0 1px 3px rgba(0,0,0,0.04)',
        borderColor: searchQuery ? '#A5C9F2' : '#DADEE1',
      }}
    >
      <Search 
        className="w-5 h-5 flex-shrink-0" 
        style={{ color: searchQuery ? '#5E94CE' : '#9CA3AF' }} 
      />
      <input
        type="text"
        placeholder="Search tasks, tags, or descriptions…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: '#2E3A47' }}
      />
    </div>
  );
}
