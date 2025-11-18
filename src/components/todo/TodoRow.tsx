import React, { useState } from 'react';
import { Plus, X, Trash2, Edit3, Calendar, HelpCircle, FileText, Folder, Mountain, Repeat, Flame, Sparkles, Check } from 'lucide-react';
import type { Todo } from '../../App';

interface TodoRowProps {
  todo: Todo;
  isLast: boolean;
  hoveredRow: string | null;
  setHoveredRow: (id: string | null) => void;
  editingField: { id: string; field: string } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  startEdit: (id: string, field: string, currentValue: string) => void;
  saveEdit: (id: string, field: string) => void;
  formatDate: (dateString: string) => string;
  isOverdue: (dateString: string, completed: boolean) => boolean;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => void;
  newTagInput: { id: string; value: string } | null;
  addTag: (id: string) => void;
  saveNewTag: (id: string, currentTags: string[]) => void;
  setNewTagInput: (value: { id: string; value: string } | null) => void;
  removeTag: (id: string, tags: string[], indexToRemove: number) => void;
  onOpenSmartPost: (id: string) => void;
  onOpenReviewDrawer: (id: string) => void;
  onOpenTaskUnderstanding: (id: string, taskTitle: string) => void;
  onOpenLinkageDrawer: (type: 'moment' | 'project', title: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoRow({
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
  onOpenSmartPost,
  onOpenReviewDrawer,
  onOpenTaskUnderstanding,
  onOpenLinkageDrawer,
  onDeleteTodo,
}: TodoRowProps) {
  const [streakCalendarOpen, setStreakCalendarOpen] = useState(false);
  
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const recurrenceLabel = todo.recurrence !== 'none' ? 
    (todo.recurrence.charAt(0).toUpperCase() + todo.recurrence.slice(1)) : null;

  // Streak color logic based on count
  const getStreakColor = (streak: number) => {
    if (streak >= 15) {
      return {
        bg: 'rgba(147, 51, 234, 0.12)', // purple
        color: '#9333EA',
        border: 'rgba(147, 51, 234, 0.25)',
        icon: '🔥',
      };
    } else if (streak >= 8) {
      return {
        bg: 'rgba(255, 107, 53, 0.12)', // orange
        color: '#FF6B35',
        border: 'rgba(255, 107, 53, 0.25)',
        icon: '🔥',
      };
    } else if (streak >= 4) {
      return {
        bg: 'rgba(245, 199, 92, 0.12)', // yellow
        color: '#D4A84F',
        border: 'rgba(245, 199, 92, 0.25)',
        icon: '⚡',
      };
    } else {
      return {
        bg: 'rgba(123, 175, 163, 0.12)', // soft green
        color: '#7BAFA3',
        border: 'rgba(123, 175, 163, 0.25)',
        icon: '✨',
      };
    }
  };

  const streakStyle = todo.streak > 0 ? getStreakColor(todo.streak) : null;

  // Generate streak calendar dates
  const getStreakCalendarDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = todo.streak - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div
      className="px-6 py-4 grid gap-4 items-start transition-all duration-200 group relative"
      style={{
        gridTemplateColumns: 'auto 24px 1fr 140px 110px 200px 120px',
        borderBottom: isLast ? 'none' : '1px solid rgba(227, 242, 250, 0.4)',
        backgroundColor: todo.completed ? 'rgba(227, 242, 250, 0.15)' : hoveredRow === todo.id ? 'rgba(227, 242, 250, 0.08)' : 'transparent',
      }}
      onMouseEnter={() => setHoveredRow(todo.id)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      {/* Checkbox */}
      <div className="pt-0.5">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
          className="w-5 h-5 rounded cursor-pointer"
          style={{
            accentColor: '#7BAFA3',
          }}
        />
      </div>

      {/* Task Understanding Icon - very small and subtle */}
      <div className="pt-1">
        {!todo.completed && (
          <button
            onClick={() => onOpenTaskUnderstanding(todo.id, todo.task)}
            className="flex items-center justify-center transition-opacity duration-200"
            style={{
              color: '#B0B8C1',
              opacity: 0.6,
            }}
            title="Task Understanding"
          >
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Task Column */}
      <div>
        {/* Task Title Row with Recurrence and Streak */}
        <div className="flex items-center gap-2 mb-1">
          {recurrenceLabel && !todo.completed && (
            <>
              <span
                className="px-2 py-0.5 rounded text-xs flex-shrink-0 flex items-center gap-1"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.12)',
                  color: '#3B7F73',
                  fontWeight: 500,
                  border: '1px solid rgba(123, 175, 163, 0.2)',
                }}
              >
                <Repeat className="w-3 h-3" />
                {recurrenceLabel}
              </span>
              
              {/* Streak Badge */}
              {todo.streak > 0 && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStreakCalendarOpen(!streakCalendarOpen);
                    }}
                    className="px-2 py-0.5 rounded text-xs flex-shrink-0 flex items-center gap-1 transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: streakStyle?.bg,
                      color: streakStyle?.color,
                      fontWeight: 600,
                      border: `1px solid ${streakStyle?.border}`,
                    }}
                  >
                    <Flame className="w-3 h-3" />
                    {todo.streak}
                  </button>

                  {/* Streak Calendar Dropdown */}
                  {streakCalendarOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 p-3 rounded-lg shadow-xl z-50"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(227, 242, 250, 0.8)',
                        minWidth: '240px',
                      }}
                    >
                      <div className="mb-2" style={{ color: '#2E3A47', fontSize: '13px', fontWeight: 600 }}>
                        🔥 Streak Calendar
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {getStreakCalendarDates().map((date, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center"
                          >
                            <div style={{ color: '#8B95A0', fontSize: '10px', marginBottom: '4px' }}>
                              {date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                            </div>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center relative"
                              style={{
                                backgroundColor: 'rgba(123, 175, 163, 0.12)',
                                border: '2px solid #7BAFA3',
                              }}
                            >
                              <div
                                className="absolute inset-1 rounded-full"
                                style={{
                                  backgroundColor: '#7BAFA3',
                                }}
                              />
                              <span style={{ color: 'white', fontSize: '11px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
                                {date.getDate()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t" style={{ borderColor: 'rgba(227, 242, 250, 0.6)' }}>
                        <p style={{ color: '#5B6B76', fontSize: '11px' }}>
                          {todo.streak} {todo.streak === 1 ? 'day' : 'days'} completed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {editingField?.id === todo.id && editingField?.field === 'task' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(todo.id, 'task')}
              onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id, 'task')}
              autoFocus
              className="flex-1 px-2 py-1 rounded outline-none"
              style={{
                border: '2px solid #7BAFA3',
                color: '#2E3A47',
                fontSize: '15px',
              }}
            />
          ) : (
            <div
              onClick={() => !todo.completed && startEdit(todo.id, 'task', todo.task)}
              className="flex-1 flex items-center gap-2 cursor-pointer"
            >
              <span
                style={{
                  color: todo.completed ? '#8B95A0' : '#2E3A47',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.task}
              </span>
              {!todo.completed && hoveredRow === todo.id && (
                <Edit3 className="w-3 h-3" style={{ color: '#8B95A0' }} />
              )}
            </div>
          )}
        </div>

        {/* Linkage Row */}
        {todo.linkages && (todo.linkages.moment || todo.linkages.project) && (
          <div className="flex items-center gap-2 mt-2">
            {todo.linkages.moment && (
              <button
                onClick={() => onOpenLinkageDrawer('moment', todo.linkages!.moment!)}
                className="flex items-center gap-1 px-2 py-0.5 rounded transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.06)',
                  fontSize: '11px',
                  color: '#6A7A86',
                }}
              >
                <FileText className="w-2.5 h-2.5" style={{ color: '#7BAFA3' }} />
                <span>{todo.linkages.moment}</span>
              </button>
            )}
            {todo.linkages.project && (
              <button
                onClick={() => onOpenLinkageDrawer('project', todo.linkages!.project!)}
                className="flex items-center gap-1 px-2 py-0.5 rounded transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(94, 148, 206, 0.06)',
                  fontSize: '11px',
                  color: '#6A7A86',
                }}
              >
                <Folder className="w-2.5 h-2.5" style={{ color: '#5E94CE' }} />
                <span>{todo.linkages.project}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Due Date */}
      <div>
        {editingField?.id === todo.id && editingField?.field === 'dueDate' ? (
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(todo.id, 'dueDate')}
            autoFocus
            className="px-2 py-1 rounded text-sm outline-none"
            style={{
              border: '2px solid #7BAFA3',
              color: '#2E3A47',
            }}
          />
        ) : (
          <div
            onClick={() => !todo.completed && startEdit(todo.id, 'dueDate', todo.dueDate)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" style={{ color: overdue ? '#E17777' : '#8B95A0' }} />
            <span
              style={{
                color: overdue ? '#E17777' : '#5B6B76',
                fontSize: '14px',
                fontWeight: overdue ? 500 : 400,
              }}
            >
              {formatDate(todo.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* Priority */}
      <div>
        {editingField?.id === todo.id && editingField?.field === 'priority' ? (
          <select
            value={editValue}
            onChange={(e) => {
              onUpdateTodo(todo.id, { priority: e.target.value as any });
            }}
            onBlur={() => {}}
            autoFocus
            className="px-2 py-1 rounded text-sm outline-none"
            style={{
              border: '2px solid #7BAFA3',
              color: '#2E3A47',
            }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        ) : (
          <button
            onClick={() => !todo.completed && startEdit(todo.id, 'priority', todo.priority)}
            className="px-2.5 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor:
                todo.priority === 'High'
                  ? 'rgba(225, 119, 119, 0.12)'
                  : todo.priority === 'Medium'
                  ? 'rgba(245, 199, 92, 0.12)'
                  : 'rgba(139, 149, 160, 0.12)',
              color:
                todo.priority === 'High'
                  ? '#E17777'
                  : todo.priority === 'Medium'
                  ? '#D4A84F'
                  : '#8B95A0',
              fontWeight: 500,
              border: `1px solid ${
                todo.priority === 'High'
                  ? 'rgba(225, 119, 119, 0.2)'
                  : todo.priority === 'Medium'
                  ? 'rgba(245, 199, 92, 0.2)'
                  : 'rgba(139, 149, 160, 0.2)'
              }`,
            }}
          >
            {todo.priority}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {todo.tags.map((tag, tagIndex) => (
          <div
            key={tagIndex}
            className="px-2 py-1 rounded-full text-xs flex items-center gap-1 group/tag transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(123, 175, 163, 0.08)',
              color: '#3B7F73',
              border: '1px solid rgba(123, 175, 163, 0.15)',
            }}
          >
            <span>{tag}</span>
            {!todo.completed && (
              <button
                onClick={() => removeTag(todo.id, todo.tags, tagIndex)}
                className="opacity-0 group-hover/tag:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {newTagInput?.id === todo.id ? (
          <input
            type="text"
            value={newTagInput.value}
            onChange={(e) => setNewTagInput({ id: todo.id, value: e.target.value })}
            onBlur={() => saveNewTag(todo.id, todo.tags)}
            onKeyPress={(e) => e.key === 'Enter' && saveNewTag(todo.id, todo.tags)}
            autoFocus
            placeholder="Tag name"
            className="px-2 py-1 rounded-full text-xs outline-none"
            style={{
              border: '2px solid #7BAFA3',
              backgroundColor: 'white',
              width: '80px',
            }}
          />
        ) : (
          !todo.completed && (
            <button
              onClick={() => addTag(todo.id)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(123, 175, 163, 0.08)',
                color: '#7BAFA3',
                border: '1px dashed rgba(123, 175, 163, 0.3)',
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
          )
        )}
      </div>

      {/* Smart Post Column */}
      <div className="flex items-center gap-2">
        {/* Posts Badge */}
        {todo.posts > 0 && (
          <button
            onClick={() => onOpenReviewDrawer(todo.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(94, 148, 206, 0.12)',
              color: '#5E94CE',
              fontWeight: 600,
              border: '1px solid rgba(94, 148, 206, 0.2)',
            }}
            title={`${todo.posts} Smart Post${todo.posts > 1 ? 's' : ''}`}
          >
            {todo.posts}
          </button>
        )}

        {/* Smart Post Icon Button */}
        {!todo.completed && (
          <button
            onClick={() => onOpenSmartPost(todo.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(94, 148, 206, 0.08)',
              color: '#5E94CE',
              border: '1px solid rgba(94, 148, 206, 0.15)',
            }}
            title="Create Smart Post"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Delete Button */}
        {!todo.completed && hoveredRow === todo.id && (
          <button
            onClick={() => {
              if (window.confirm(`Delete "${todo.task}"?`)) {
                onDeleteTodo(todo.id);
              }
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(225, 119, 119, 0.08)',
              color: '#E17777',
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}