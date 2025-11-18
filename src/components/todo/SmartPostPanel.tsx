import React, { useState } from 'react';
import { X, Sparkles, Image, Link2, FileText } from 'lucide-react';

interface SmartPostPanelProps {
  onClose: () => void;
  todoTitle: string;
  onOpenMentorChat: () => void;
  mentorChatOpen?: boolean;
}

export function SmartPostPanel({ onClose, todoTitle, onOpenMentorChat, mentorChatOpen }: SmartPostPanelProps) {
  const [content, setContent] = useState('');
  const [insertedTags, setInsertedTags] = useState<string[]>([]);

  // Adjust panel width based on whether mentor chat is open
  const panelWidth = mentorChatOpen ? '40%' : '50%';

  const handleInsertContent = (text: string) => {
    const newContent = content ? `${content}\n\n${text}` : text;
    setContent(newContent);
    setInsertedTags([...insertedTags, '📎 Added via Mentor Assist']);
  };

  return (
    <div
      className="fixed top-0 h-full flex flex-col shadow-2xl transition-all duration-300"
      style={{
        right: mentorChatOpen ? '35%' : '0',
        width: panelWidth,
        backgroundColor: '#FFFFFF',
        borderLeft: '1px solid rgba(227, 242, 250, 0.6)',
        zIndex: 90,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <div>
          <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '18px' }}>
            {todoTitle}
          </h3>
          <p style={{ color: '#8B95A0', fontSize: '13px', marginTop: '4px' }}>
            AI-Assisted Post
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMentorChat}
            className="px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            style={{
              background: mentorChatOpen 
                ? 'rgba(123, 175, 163, 0.15)' 
                : 'linear-gradient(135deg, #7BAFA3 0%, #5E94CE 100%)',
              color: mentorChatOpen ? '#3B7F73' : 'white',
              fontWeight: 500,
              fontSize: '14px',
            }}
            title="Get AI assistance"
          >
            <Sparkles className="w-4 h-4" />
            Mentor Assist
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: 'rgba(139, 149, 160, 0.1)',
              color: '#8B95A0',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area - Now fills full height */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
        {/* Attachments Section - Moved to top */}
        <div className="mb-4">
          <p style={{ color: '#5B6B76', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>
            Attachments (optional)
          </p>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(94, 148, 206, 0.08)',
                border: '1px solid rgba(94, 148, 206, 0.2)',
                color: '#5E94CE',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <Link2 className="w-4 h-4" />
              Add Link
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(123, 175, 163, 0.08)',
                border: '1px solid rgba(123, 175, 163, 0.2)',
                color: '#7BAFA3',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <Image className="w-4 h-4" />
              Add Image
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(245, 199, 92, 0.08)',
                border: '1px solid rgba(245, 199, 92, 0.2)',
                color: '#F5C75C',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <FileText className="w-4 h-4" />
              Add Document
            </button>
          </div>
        </div>

        {/* Editor - Now expands to fill remaining space */}
        <div
          className="rounded-xl p-5 flex-1 flex flex-col"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(227, 242, 250, 0.6)',
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your progress, insights, or learnings...

What did you work on?
What challenges did you face?
What did you learn?
What's next?"
            className="w-full flex-1 text-sm outline-none resize-none"
            style={{
              color: '#2E3A47',
              lineHeight: '1.6',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Inserted Tags */}
        {insertedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {insertedTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.12)',
                  color: '#3B7F73',
                  fontSize: '11px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* AI Suggestions */}
        {!mentorChatOpen && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{
              backgroundColor: 'rgba(123, 175, 163, 0.05)',
              border: '1px solid rgba(123, 175, 163, 0.15)',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.15)',
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#7BAFA3' }} />
              </div>
              <div className="flex-1">
                <p style={{ color: '#3B7F73', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  AI Suggestion
                </p>
                <p style={{ color: '#5B6B76', fontSize: '13px', lineHeight: '1.5' }}>
                  Click "Mentor Assist" above to get help with structuring your post, summarizing related moments, or finding examples.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
        style={{
          backgroundColor: '#FAFBFC',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'rgba(139, 149, 160, 0.08)',
            color: '#5B6B76',
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: '#5E94CE',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Submit Post
        </button>
      </div>
    </div>
  );
}
