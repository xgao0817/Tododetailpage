import React, { useState } from 'react';
import { Plus, X, Trash2, Upload, Edit3, Calendar, AlertCircle, ChevronDown, ArrowUp, ArrowDown, SlidersHorizontal, Repeat, Flame, GripVertical } from 'lucide-react';
import type { Todo, SortOption, SortOrder } from '../../App';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TodoTableProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  onDeleteTodo: (id: string) => void;
  searchQuery: string;
  sortBy: string;
  sortOrder: SortOrder;
  onToggleSort: (column: SortOption) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  onOpenUpload: (id: string) => void;
  onMoveTodo: (dragIndex: number, hoverIndex: number) => void;
}

export function TodoTable({ 
  todos, 
  onUpdateTodo, 
  onDeleteTodo, 
  searchQuery,
  sortBy,
  sortOrder,
  onToggleSort,
  priorityFilter,
  onPriorityFilterChange,
  onOpenUpload,
  onMoveTodo
}: TodoTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newTagInput, setNewTagInput] = useState<{ id: string; value: string } | null>(null);
  const [filterDropdown, setFilterDropdown] = useState<string | null>(null);

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
    if (editValue.trim() || field === 'task' || field === 'description') {
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

  const handleDelete = (id: string, taskName: string) => {
    if (window.confirm(`Delete "${taskName}"?`)) {
      onDeleteTodo(id);
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ 
          backgroundColor: 'rgba(123, 175, 163, 0.25)',
          color: '#2B4C5E',
          padding: '0 2px',
          borderRadius: '3px'
        }}>
          {part}
        </mark>
      ) : part
    );
  };

  const getSortIcon = (column: SortOption) => {
    if (sortBy !== column) {
      return null;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5" style={{ color: '#5E94CE' }} />
      : <ArrowDown className="w-3.5 h-3.5" style={{ color: '#5E94CE' }} />;
  };

  const uncompletedTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  const ColumnHeader = ({ 
    label, 
    sortKey, 
    filterKey 
  }: { 
    label: string; 
    sortKey?: SortOption; 
    filterKey?: 'priority';
  }) => {
    const hasFilter = filterKey && priorityFilter !== 'All';

    return (
      <div className="flex items-center gap-2 group">
        <span className="text-xs uppercase tracking-wide" style={{ color: '#5B6B76', fontWeight: 600 }}>
          {label}
        </span>
        
        <div className="flex items-center gap-1">
          {sortKey && (
            <button
              onClick={() => onToggleSort(sortKey)}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: sortBy === sortKey ? 'rgba(94, 148, 206, 0.12)' : 'transparent',
              }}
              title="Sort"
            >
              {getSortIcon(sortKey) || <ChevronDown className="w-3.5 h-3.5 opacity-40" style={{ color: '#5B6B76' }} />}
            </button>
          )}
          
          {filterKey && (
            <div className="relative">
              <button
                onClick={() => setFilterDropdown(filterDropdown === filterKey ? null : filterKey)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: hasFilter ? 'rgba(94, 148, 206, 0.12)' : 'transparent',
                }}
                title="Filter"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: hasFilter ? '#5E94CE' : '#9CA3AF' }} />
              </button>

              {filterDropdown === filterKey && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-xl"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(227, 242, 250, 0.8)',
                  }}
                >
                  <div className="p-2">
                    {['All', 'High', 'Medium', 'Low'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          onPriorityFilterChange(option);
                          setFilterDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: priorityFilter === option ? 'rgba(123, 175, 163, 0.12)' : 'transparent',
                          color: priorityFilter === option ? '#3B7F73' : '#2E3A47',
                          fontWeight: priorityFilter === option ? 500 : 400,
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(227, 242, 250, 0.6)',
        }}
      >
        {/* Table Header */}
        <div 
          className="sticky top-0 z-20 border-b px-6 py-4 grid gap-4 items-center"
          style={{ 
            background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
            borderColor: 'rgba(227, 242, 250, 0.8)',
            gridTemplateColumns: '40px 2.5fr 130px 110px 2fr 110px 40px'
          }}
        >
          <div></div>
          <ColumnHeader label="Task" sortKey="task" />
          <ColumnHeader label="Due Date" sortKey="dueDate" />
          <ColumnHeader label="Priority" sortKey="priority" filterKey="priority" />
          <ColumnHeader label="Tags" />
          <ColumnHeader label="Posts" />
          <div></div>
        </div>

        {/* Table Body */}
        <div>
          {uncompletedTodos.map((todo, index) => (
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
              onOpenUpload={onOpenUpload}
              handleDelete={handleDelete}
              highlightText={highlightText}
              onMoveTodo={onMoveTodo}
              index={index}
            />
          ))}

          {completedTodos.length > 0 && uncompletedTodos.length > 0 && (
            <div 
              className="px-6 py-3 flex items-center gap-3 border-t border-b"
              style={{ 
                backgroundColor: 'rgba(240, 250, 247, 0.4)',
                borderColor: 'rgba(227, 242, 250, 0.6)'
              }}
            >
              <div 
                className="flex-1 h-px" 
                style={{ background: 'linear-gradient(to right, transparent, rgba(123, 175, 163, 0.3))' }}
              />
              <span className="text-xs tracking-wider uppercase px-3 py-1 rounded-full" 
                style={{ 
                  color: '#7BAFA3', 
                  fontWeight: 600,
                  backgroundColor: 'rgba(123, 175, 163, 0.1)'
                }}
              >
                Completed ({completedTodos.length})
              </span>
              <div 
                className="flex-1 h-px" 
                style={{ background: 'linear-gradient(to right, rgba(123, 175, 163, 0.3), transparent)' }}
              />
            </div>
          )}

          {completedTodos.map((todo, index) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              isLast={index === completedTodos.length - 1}
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
              onOpenUpload={onOpenUpload}
              handleDelete={handleDelete}
              highlightText={highlightText}
              onMoveTodo={onMoveTodo}
              index={index}
            />
          ))}
        </div>

        {todos.length === 0 && (
          <div className="py-20 text-center">
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(123, 175, 163, 0.1)',
              }}
            >
              <Calendar className="w-7 h-7" style={{ color: '#7BAFA3' }} />
            </div>
            <p style={{ color: '#5B6B76', fontWeight: 500 }}>No tasks found</p>
            <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
              {searchQuery ? 'Try adjusting your search or filters' : 'Click "New To-Do" to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {filterDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setFilterDropdown(null)}
        />
      )}
    </DndProvider>
  );
}

interface TodoRowProps {
  todo: Todo;
  isLast: boolean;
  hoveredRow: string | null;
  setHoveredRow: (id: string | null) => void;
  editingField: { id: string; field: string } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  startEdit: (id: string, field: string, value: string) => void;
  saveEdit: (id: string, field: string) => void;
  formatDate: (date: string) => string;
  isOverdue: (date: string, completed: boolean) => boolean;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  newTagInput: { id: string; value: string } | null;
  addTag: (id: string) => void;
  saveNewTag: (id: string, tags: string[]) => void;
  setNewTagInput: (input: { id: string; value: string } | null) => void;
  removeTag: (id: string, tags: string[], index: number) => void;
  onOpenUpload: (id: string) => void;
  handleDelete: (id: string, taskName: string) => void;
  highlightText: (text: string) => React.ReactNode;
  onMoveTodo: (dragIndex: number, hoverIndex: number) => void;
  index: number;
}

function TodoRow({
  todo,
  isLast,
  hoveredRow,
  setHoveredRow,
  editingField,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  formatDate,
  isOverdue,
  onUpdateTodo,
  newTagInput,
  addTag,
  saveNewTag,
  setNewTagInput,
  removeTag,
  onOpenUpload,
  handleDelete,
  highlightText,
  onMoveTodo,
  index,
}: TodoRowProps) {
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const isNewEmptyTask = !todo.task && !todo.description;
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);

  const getRecurrenceLabel = (recurrence: string) => {
    switch (recurrence) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return null;
    }
  };

  const recurrenceLabel = getRecurrenceLabel(todo.recurrence);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TODO',
    item: { id: todo.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'TODO',
    hover(item: { id: string; index: number }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMoveTodo(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref) as any);

  return (
    <div
      ref={ref}
      className="px-6 py-4 grid gap-4 items-center transition-all duration-200 relative group"
      style={{
        backgroundColor: hoveredRow === todo.id ? 'rgba(227, 242, 250, 0.15)' : 'transparent',
        borderBottom: !isLast ? '1px solid rgba(227, 242, 250, 0.5)' : 'none',
        gridTemplateColumns: '40px 2.5fr 130px 110px 2fr 110px 40px',
        opacity: todo.completed ? 0.55 : opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseEnter={() => setHoveredRow(todo.id)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center">
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onUpdateTodo(todo.id, { completed: e.target.checked })}
            className="sr-only"
          />
          <div 
            className="w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center"
            style={{
              borderColor: todo.completed ? '#7BAFA3' : '#D1D5DB',
              backgroundColor: todo.completed ? '#7BAFA3' : 'white',
            }}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>
      </div>

      {/* Task */}
      <div>
        <div className="relative">
          {editingField?.id === todo.id && editingField?.field === 'task' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(todo.id, 'task')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(todo.id, 'task');
                if (e.key === 'Escape') { setEditValue(todo.task); setEditingField(null); }
              }}
              autoFocus
              placeholder="Task name"
              className="w-full px-3 py-1.5 rounded-lg outline-none transition-all duration-200"
              style={{
                border: '2px solid #7BAFA3',
                color: '#2E3A47',
                fontSize: '14px',
                fontWeight: 500,
              }}
            />
          ) : (
            <div
              onClick={() => !todo.completed && startEdit(todo.id, 'task', todo.task)}
              className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2"
              style={{ 
                color: '#2E3A47',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: todo.completed ? 'default' : 'pointer',
                backgroundColor: isNewEmptyTask ? 'rgba(123, 175, 163, 0.08)' : 'transparent'
              }}
            >
              {/* Recurrence & Streak - Compact horizontal layout */}
              {recurrenceLabel && (
                <div className="relative flex items-center gap-2">
                  {/* Recurrence Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!todo.completed) setShowRecurrenceDropdown(!showRecurrenceDropdown);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(94, 148, 206, 0.12)',
                      color: '#5E94CE',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: todo.completed ? 'default' : 'pointer',
                    }}
                  >
                    <Repeat className="w-3 h-3" />
                    <span>{recurrenceLabel}</span>
                  </button>

                  {/* Streak indicator - inline with badge */}
                  {todo.streak > 0 && (
                    <div 
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: todo.streak >= 10 ? 'rgba(249, 124, 124, 0.12)' : todo.streak >= 5 ? 'rgba(245, 199, 92, 0.12)' : 'rgba(168, 217, 203, 0.15)',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                      title={`${todo.streak} completion streak`}
                    >
                      <Flame 
                        className="w-3 h-3" 
                        style={{ 
                          color: todo.streak >= 10 ? '#F97C7C' : todo.streak >= 5 ? '#F5C75C' : '#7BAFA3',
                        }} 
                      />
                      <span 
                        style={{ 
                          color: todo.streak >= 10 ? '#F97C7C' : todo.streak >= 5 ? '#F5C75C' : '#7BAFA3',
                        }}
                      >
                        {todo.streak}
                      </span>
                    </div>
                  )}

                  {showRecurrenceDropdown && !todo.completed && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-32 rounded-lg overflow-hidden z-50 shadow-xl"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(227, 242, 250, 0.8)',
                      }}
                    >
                      <div className="p-1">
                        {['none', 'daily', 'weekly', 'monthly'].map((option) => (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateTodo(todo.id, { recurrence: option as any });
                              setShowRecurrenceDropdown(false);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded text-xs transition-colors"
                            style={{
                              backgroundColor: todo.recurrence === option ? 'rgba(123, 175, 163, 0.12)' : 'transparent',
                              color: todo.recurrence === option ? '#3B7F73' : '#2E3A47',
                              fontWeight: todo.recurrence === option ? 500 : 400,
                            }}
                          >
                            {option === 'none' ? 'No repeat' : option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <span className="flex-1">{todo.task || 'Click to add task'}</span>
              {!todo.completed && hoveredRow === todo.id && (
                <Edit3 className="w-3 h-3 opacity-40" style={{ color: '#7BAFA3' }} />
              )}
            </div>
          )}
        </div>
        
        <div className="relative mt-0.5">
          {editingField?.id === todo.id && editingField?.field === 'description' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(todo.id, 'description')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit(todo.id, 'description');
                if (e.key === 'Escape') { setEditValue(todo.description); setEditingField(null); }
              }}
              autoFocus
              placeholder="Add description"
              className="w-full text-xs px-3 py-1 rounded-lg outline-none transition-all duration-200"
              style={{
                border: '2px solid #7BAFA3',
                color: '#6A7A86',
              }}
            />
          ) : (
            <div
              onClick={() => !todo.completed && startEdit(todo.id, 'description', todo.description)}
              className="text-xs px-3 py-1 rounded-lg transition-all duration-200 flex items-center gap-2"
              style={{ 
                color: '#6A7A86',
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: todo.completed ? 'default' : 'pointer',
              }}
            >
              <span className="flex-1">{todo.description || 'Add description'}</span>
              {!todo.completed && hoveredRow === todo.id && (
                <Edit3 className="w-2.5 h-2.5 opacity-30" style={{ color: '#7BAFA3' }} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div>
        {editingField?.id === todo.id && editingField?.field === 'dueDate' ? (
          <input
            type="date"
            value={todo.dueDate}
            onChange={(e) => onUpdateTodo(todo.id, { dueDate: e.target.value })}
            onBlur={() => setEditingField(null)}
            autoFocus
            className="w-full px-2 py-1.5 rounded-lg text-xs outline-none transition-all duration-200"
            style={{
              border: '2px solid #7BAFA3',
              color: '#2E3A47',
            }}
          />
        ) : (
          <div
            onClick={() => !todo.completed && setEditingField({ id: todo.id, field: 'dueDate' })}
            className="text-xs px-2 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
            style={{ 
              color: overdue ? '#E17777' : '#2E3A47',
              backgroundColor: overdue ? 'rgba(225, 119, 119, 0.08)' : 'transparent',
              cursor: todo.completed ? 'default' : 'pointer',
              fontWeight: 500,
            }}
          >
            {overdue && <AlertCircle className="w-3 h-3" />}
            <Calendar className="w-3 h-3" style={{ color: overdue ? '#E17777' : '#7BAFA3' }} />
            <span>{formatDate(todo.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Priority */}
      <div>
        <select
          value={todo.priority}
          onChange={(e) => onUpdateTodo(todo.id, { priority: e.target.value as Todo['priority'] })}
          disabled={todo.completed}
          className="w-full px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-200 appearance-none text-center disabled:cursor-not-allowed"
          style={{
            backgroundColor: 
              todo.priority === 'High' ? 'rgba(249, 124, 124, 0.12)' :
              todo.priority === 'Medium' ? 'rgba(245, 199, 92, 0.12)' :
              'rgba(133, 184, 212, 0.12)',
            color:
              todo.priority === 'High' ? '#F97C7C' :
              todo.priority === 'Medium' ? '#F5C75C' :
              '#85B8D4',
            border: 'none',
            fontWeight: 500,
          }}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {todo.tags.map((tag, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 group/tag"
            style={{
              backgroundColor: 'white',
              color: '#2E3A47',
              border: '1px solid rgba(46, 58, 71, 0.2)',
              fontWeight: 500,
            }}
          >
            <span>{tag}</span>
            {!todo.completed && (
              <button
                onClick={() => removeTag(todo.id, todo.tags, idx)}
                className="opacity-0 group-hover/tag:opacity-100 transition-all hover:scale-110"
                style={{ color: '#E17777' }}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        {!todo.completed && (
          <>
            {newTagInput?.id === todo.id ? (
              <input
                type="text"
                value={newTagInput.value}
                onChange={(e) => setNewTagInput({ id: todo.id, value: e.target.value })}
                onBlur={() => saveNewTag(todo.id, todo.tags)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveNewTag(todo.id, todo.tags);
                  if (e.key === 'Escape') setNewTagInput(null);
                }}
                autoFocus
                placeholder="Tag..."
                className="px-2 py-1 rounded-lg text-xs outline-none"
                style={{
                  border: '2px solid #7BAFA3',
                  width: '70px'
                }}
              />
            ) : (
              <button
                onClick={() => addTag(todo.id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: 'rgba(123, 175, 163, 0.1)',
                  color: '#7BAFA3',
                  opacity: hoveredRow === todo.id ? 1 : 0
                }}
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Posts */}
      <div className="flex items-center gap-2">
        {todo.posts > 0 && (
          <div className="flex items-center gap-1.5">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white"
              style={{ backgroundColor: '#5E94CE', fontWeight: 600 }}
            >
              {todo.posts}
            </div>
          </div>
        )}
        {!todo.completed && (
          <button
            onClick={() => onOpenUpload(todo.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(94, 148, 206, 0.12)',
              color: '#5E94CE',
              opacity: hoveredRow === todo.id ? 1 : 0
            }}
            title="Add evidence"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Delete Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => handleDelete(todo.id, todo.task || 'Untitled')}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: 'rgba(225, 119, 119, 0.1)',
            color: '#E17777',
            opacity: hoveredRow === todo.id ? 1 : 0
          }}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}