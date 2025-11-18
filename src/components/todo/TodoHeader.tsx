import React from 'react';
import { Plus, X, Search } from 'lucide-react';

interface TodoHeaderProps {
  completedTasks: number;
  onAddTodo: () => string;
  onClearCompleted: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TodoHeader({ 
  completedTasks, 
  onAddTodo, 
  onClearCompleted,
  searchQuery,
  onSearchChange
}: TodoHeaderProps) {
  return (
    <div className="mb-8">
      {/* Title and Actions Row */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ color: '#2B4C5E', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          To-Dos
        </h1>
        
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-80"
            style={{
              backgroundColor: 'white',
              border: searchQuery ? '2px solid #7BAFA3' : '1px solid rgba(197, 223, 239, 0.6)',
              boxShadow: searchQuery ? '0 4px 16px rgba(123, 175, 163, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Search 
              className="w-4.5 h-4.5 flex-shrink-0" 
              style={{ color: searchQuery ? '#7BAFA3' : '#9CA3AF' }} 
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2B4C5E' }}
            />
          </div>

          {completedTasks > 0 && (
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'rgba(123, 175, 163, 0.08)',
                color: '#5E8B7E',
                border: '1px solid rgba(123, 175, 163, 0.2)',
                fontWeight: 500,
              }}
            >
              <X className="w-4 h-4" />
              <span>Clear Done</span>
            </button>
          )}
          
          <button
            onClick={onAddTodo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7BAFA3 0%, #9BC9BE 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(123, 175, 163, 0.3)',
              fontWeight: 500,
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New To-Do</span>
          </button>
        </div>
      </div>
    </div>
  );
}