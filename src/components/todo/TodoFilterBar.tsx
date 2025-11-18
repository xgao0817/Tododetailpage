import React from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

interface TodoFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
}

export function TodoFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: TodoFilterBarProps) {
  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-4 transition-all duration-300 hover:shadow-lg"
      style={{
        border: '1px solid rgba(218, 222, 225, 0.5)',
        boxShadow: '0px 4px 16px rgba(120, 170, 170, 0.1)',
      }}
    >
      {/* Search */}
      <div className="flex-1 min-w-[240px] relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
          <Search 
            className="w-4 h-4" 
            style={{ color: searchQuery ? '#7BAFA3' : '#5B6B76' }} 
          />
        </div>
        <input
          type="text"
          placeholder="Search tasks, descriptions, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{ 
            color: '#2E3A47',
            backgroundColor: 'rgba(247, 250, 252, 0.8)',
            border: searchQuery ? '2px solid #A5C9F2' : '2px solid transparent',
          }}
        />
      </div>

      {/* Filter Label */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(123, 175, 163, 0.08)' }}>
        <Filter className="w-4 h-4" style={{ color: '#7BAFA3' }} />
        <span className="text-sm" style={{ color: '#5B6B76' }}>Filters:</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={['All', 'Not Started', 'In Progress', 'Done']}
        />
        
        <FilterDropdown
          label="Priority"
          value={priorityFilter}
          onChange={onPriorityFilterChange}
          options={['All', 'high', 'medium', 'low']}
        />
      </div>

      {/* Active Filters Count */}
      {(statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery) && (
        <div 
          className="px-3 py-2 rounded-full text-xs transition-all duration-200"
          style={{
            backgroundColor: 'rgba(123, 175, 163, 0.12)',
            color: '#3B7F73',
            border: '1px solid rgba(123, 175, 163, 0.2)'
          }}
        >
          {[statusFilter !== 'All', priorityFilter !== 'All', searchQuery !== ''].filter(Boolean).length} active
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: string[];
}) {
  const isActive = value !== 'All';
  
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 hover:shadow-md"
        style={{
          border: isActive ? '2px solid #A5C9F2' : '1px solid #DADEE1',
          color: isActive ? '#2E3A47' : '#5B6B76',
          backgroundColor: isActive ? 'rgba(165, 201, 242, 0.08)' : 'white',
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {label}: {option}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 group-hover:translate-y-[-40%]">
        <ChevronDown 
          className="w-4 h-4" 
          style={{ color: isActive ? '#5E94CE' : '#5B6B76' }}
        />
      </div>
    </div>
  );
}
