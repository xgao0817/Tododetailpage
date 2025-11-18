import React, { useState } from 'react';
import { X, Plus, Calendar, Repeat } from 'lucide-react';
import type { Todo } from '../../App';

interface AddTodoModalProps {
  onClose: () => void;
  onAddTodo: (todo: Omit<Todo, 'id' | 'completed' | 'posts' | 'streak'>) => void;
}

export function AddTodoModal({ onClose, onAddTodo }: AddTodoModalProps) {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!task.trim()) {
      return;
    }

    onAddTodo({
      task: task.trim(),
      description: description.trim(),
      dueDate,
      priority,
      recurrence,
      tags,
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          backgroundColor: 'white',
          border: '1px solid rgba(227, 242, 250, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
            borderColor: 'rgba(227, 242, 250, 0.8)',
          }}
        >
          <h2 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '18px' }}>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(225, 119, 119, 0.1)',
              color: '#E17777',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
              Task Name *
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task name"
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                border: '2px solid rgba(227, 242, 250, 0.8)',
                color: '#2E3A47',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7BAFA3'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)'}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                border: '2px solid rgba(227, 242, 250, 0.8)',
                color: '#2E3A47',
              }}
              onFocus={(e) => e.target.style.borderColor = '#7BAFA3'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)'}
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
                <Calendar className="w-3 h-3 inline mr-1" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  border: '2px solid rgba(227, 242, 250, 0.8)',
                  color: '#2E3A47',
                }}
                onFocus={(e) => e.target.style.borderColor = '#7BAFA3'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)'}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
                style={{
                  border: '2px solid rgba(227, 242, 250, 0.8)',
                  color: '#2E3A47',
                }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
              <Repeat className="w-3 h-3 inline mr-1" />
              Recurrence
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'none', label: 'None' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRecurrence(option.value as any)}
                  className="px-3 py-2 rounded-lg text-xs transition-all duration-200"
                  style={{
                    backgroundColor: recurrence === option.value ? 'rgba(94, 148, 206, 0.12)' : 'rgba(227, 242, 250, 0.3)',
                    color: recurrence === option.value ? '#5E94CE' : '#5B6B76',
                    fontWeight: recurrence === option.value ? 600 : 500,
                    border: `2px solid ${recurrence === option.value ? '#5E94CE' : 'transparent'}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#5B6B76', fontWeight: 500 }}>
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 group"
                  style={{
                    backgroundColor: 'white',
                    color: '#2E3A47',
                    border: '1px solid rgba(46, 58, 71, 0.2)',
                    fontWeight: 500,
                  }}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(idx)}
                    className="transition-all hover:scale-110"
                    style={{ color: '#E17777' }}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag"
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  border: '2px solid rgba(227, 242, 250, 0.8)',
                  color: '#2E3A47',
                }}
                onFocus={(e) => e.target.style.borderColor = '#7BAFA3'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)'}
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.12)',
                  color: '#7BAFA3',
                  fontWeight: 500,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t flex items-center justify-end gap-3"
          style={{
            borderColor: 'rgba(227, 242, 250, 0.8)',
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(91, 107, 118, 0.08)',
              color: '#5B6B76',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!task.trim()}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#7BAFA3',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}