import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import type { Todo, SortOption, SortOrder } from '../../App';
import { TodoRow } from './TodoRow';

interface TodoTableNewProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
  searchQuery: string;
  sortBy: string;
  sortOrder: SortOrder;
  onToggleSort: (column: SortOption) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  onOpenSmartPost: (id: string) => void;
  onOpenReviewDrawer: (id: string) => void;
  onOpenTaskUnderstanding: (id: string, taskTitle: string) => void;
  onOpenLinkageDrawer: (type: 'moment' | 'project', title: string) => void;
}

export function TodoTableNew({
  todos,
  onUpdateTodo,
  onDeleteTodo,
  searchQuery,
  sortBy,
  sortOrder,
  onToggleSort,
  priorityFilter,
  onPriorityFilterChange,
  onOpenSmartPost,
  onOpenReviewDrawer,
  onOpenTaskUnderstanding,
  onOpenLinkageDrawer,
}: TodoTableNewProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTagInput, setNewTagInput] = useState<{ id: string; value: string } | null>(null);
  const [priorityDropdown, setPriorityDropdown] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const isOverdue = (dateString: string, completed: boolean) => {
    if (completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const startEdit = (id: string, field: string, currentValue: string) => {
    setEditingField({ id, field });
    setEditValue(currentValue);
  };

  const saveEdit = (id: string, field: string) => {
    if (editValue.trim() || field === 'task') {
      onUpdateTodo(id, { [field]: editValue });
    }
    setEditingField(null);
  };

  const addTag = (id: string) => {
    setNewTagInput({ id, value: '' });
  };

  const saveNewTag = (id: string, currentTags: string[]) => {
    if (newTagInput && newTagInput.value.trim()) {
      onUpdateTodo(id, { tags: [...currentTags, newTagInput.value.trim()] });
    }
    setNewTagInput(null);
  };

  const removeTag = (id: string, tags: string[], indexToRemove: number) => {
    onUpdateTodo(id, { tags: tags.filter((_, i) => i !== indexToRemove) });
  };

  const getSortIcon = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 inline ml-1" /> : <ArrowDown className="w-3 h-3 inline ml-1" />;
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(227, 242, 250, 0.6)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Table Header */}
      <div
        className="px-6 py-3 grid gap-4 items-center border-b"
        style={{
          gridTemplateColumns: 'auto 24px 1fr 140px 110px 200px 120px',
          background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <div style={{ width: '24px' }} />
        <div style={{ width: '24px' }} />
        
        <button
          onClick={() => onToggleSort('task')}
          className="text-left flex items-center"
          style={{ color: '#5B6B76', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          Task {getSortIcon('task')}
        </button>

        <button
          onClick={() => onToggleSort('dueDate')}
          className="text-left flex items-center"
          style={{ color: '#5B6B76', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          Due Date {getSortIcon('dueDate')}
        </button>

        <div className="relative">
          <button
            onClick={() => setPriorityDropdown(priorityDropdown ? null : 'priority')}
            className="text-left flex items-center gap-1"
            style={{ color: '#5B6B76', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Priority <ChevronDown className="w-3 h-3" />
          </button>
          
          {priorityDropdown === 'priority' && (
            <div
              className="absolute top-full left-0 mt-1 w-32 rounded-lg overflow-hidden z-50 shadow-xl"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(227, 242, 250, 0.8)',
              }}
            >
              <div className="p-1">
                {['All', 'High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      onPriorityFilterChange(priority);
                      setPriorityDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                    style={{
                      backgroundColor: priorityFilter === priority ? 'rgba(123, 175, 163, 0.12)' : 'transparent',
                      color: priorityFilter === priority ? '#3B7F73' : '#2E3A47',
                      fontWeight: priorityFilter === priority ? 500 : 400,
                    }}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ color: '#5B6B76', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Tags
        </div>

        <div style={{ color: '#5B6B76', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Smart Post
        </div>
      </div>

      {/* Table Body */}
      <div>
        {todos.map((todo, index) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            isLast={index === todos.length - 1}
            hoveredRow={hoveredRow}
            setHoveredRow={setHoveredRow}
            editingField={editingField}
            editValue={editValue}
            setEditValue={setEditValue}
            startEdit={startEdit}
            saveEdit={saveEdit}
            formatDate={formatDate}
            isOverdue={isOverdue}
            onUpdateTodo={onUpdateTodo}
            newTagInput={newTagInput}
            addTag={addTag}
            saveNewTag={saveNewTag}
            setNewTagInput={setNewTagInput}
            removeTag={removeTag}
            onOpenSmartPost={onOpenSmartPost}
            onOpenReviewDrawer={onOpenReviewDrawer}
            onOpenTaskUnderstanding={onOpenTaskUnderstanding}
            onOpenLinkageDrawer={onOpenLinkageDrawer}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </div>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p style={{ color: '#8B95A0', fontSize: '14px' }}>
            No tasks found. {priorityFilter !== 'All' && 'Try adjusting your filters.'}
          </p>
        </div>
      )}
    </div>
  );
}