import React, { useState, useRef, useEffect } from 'react';

interface InlineEditorProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function InlineEditor({
  value,
  onSave,
  isEditing,
  onEditStart,
  onEditEnd,
  className = '',
  style = {},
}: InlineEditorProps) {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    onEditEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      onEditEnd();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`outline-none bg-white px-2 py-1 rounded transition-all duration-150 ${className}`}
        style={{
          ...style,
          boxShadow: '0 0 0 2px rgba(165, 201, 242, 0.3)',
        }}
      />
    );
  }

  return (
    <div
      onClick={onEditStart}
      className={`cursor-pointer hover:bg-white/50 px-2 py-1 rounded transition-all duration-150 ${className}`}
      style={style}
    >
      {value}
    </div>
  );
}
