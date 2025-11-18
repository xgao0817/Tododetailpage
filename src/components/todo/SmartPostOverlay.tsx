import React, { useState } from 'react';
import { X, Sparkles, Image, Link2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { MentorChatPanelV2 } from './MentorChatPanelV2';

interface SmartPostOverlayProps {
  onClose: () => void;
  todoTitle: string;
}

export function SmartPostOverlay({
  onClose,
  todoTitle,
}: SmartPostOverlayProps) {
  const [content, setContent] = useState('');
  const [mentorChatOpen, setMentorChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'task-lens' | 'writing-partner'>('writing-partner');

  const handleInsertContent = (text: string) => {
    const newContent = content ? `${content}\n\n${text}` : text;
    setContent(newContent);
  };

  const handleOpenMentorChat = () => {
    setChatMode('writing-partner');
    setMentorChatOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Left Panel: Smart Post Editor */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          width: mentorChatOpen ? '60%' : '100%',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b flex items-center justify-between flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
            borderColor: 'rgba(227, 242, 250, 0.6)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(139, 149, 160, 0.08)',
                color: '#8B95A0',
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '20px' }}>
                {todoTitle}
              </h2>
              <p style={{ color: '#8B95A0', fontSize: '14px', marginTop: '4px' }}>
                AI-Assisted Smart Post
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenMentorChat}
              className="px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                background: mentorChatOpen 
                  ? 'rgba(123, 175, 163, 0.15)' 
                  : 'linear-gradient(135deg, #7BAFA3 0%, #5E94CE 100%)',
                color: mentorChatOpen ? '#3B7F73' : 'white',
                fontWeight: 500,
                fontSize: '14px',
                border: mentorChatOpen ? '1px solid rgba(123, 175, 163, 0.3)' : 'none',
              }}
              title="Get AI assistance"
            >
              <Sparkles className="w-4 h-4" />
              Mentor Assist
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(139, 149, 160, 0.08)',
                color: '#8B95A0',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Attachments Section */}
            <div className="mb-6">
              <p style={{ color: '#5B6B76', fontSize: '14px', fontWeight: 500, marginBottom: '14px' }}>
                Attachments (optional)
              </p>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(94, 148, 206, 0.08)',
                    border: '1px solid rgba(94, 148, 206, 0.2)',
                    color: '#5E94CE',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <Link2 className="w-4 h-4" />
                  Link
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(123, 175, 163, 0.08)',
                    border: '1px solid rgba(123, 175, 163, 0.2)',
                    color: '#7BAFA3',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <Image className="w-4 h-4" />
                  Image
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(245, 199, 92, 0.08)',
                    border: '1px solid rgba(245, 199, 92, 0.2)',
                    color: '#D4A84F',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Document
                </button>
              </div>
            </div>

            {/* Editor */}
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(227, 242, 250, 0.6)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                minHeight: '500px',
              }}
            >
              {!mentorChatOpen && (
                <div 
                  className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(123, 175, 163, 0.08)',
                    border: '1px solid rgba(123, 175, 163, 0.15)',
                  }}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: '#7BAFA3' }} />
                  <p style={{ color: '#3B7F73', fontSize: '13px' }}>
                    Need help? Click <strong>Mentor Assist</strong> above for AI suggestions
                  </p>
                </div>
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your progress, insights, or learnings...

What did you work on?
What challenges did you face?
What did you learn?
What's next?"
                className="w-full h-full text-sm outline-none resize-none"
                style={{
                  color: '#2E3A47',
                  lineHeight: '1.8',
                  backgroundColor: 'transparent',
                  minHeight: '450px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-5 border-t flex items-center justify-between flex-shrink-0"
          style={{
            backgroundColor: '#FAFBFC',
            borderColor: 'rgba(227, 242, 250, 0.6)',
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(139, 149, 160, 0.08)',
              color: '#5B6B76',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            className="px-8 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#5E94CE',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(94, 148, 206, 0.3)',
            }}
          >
            Submit Post
          </button>
        </div>
      </div>

      {/* Right Panel: AI Chat - Full Height */}
      {mentorChatOpen && (
        <div
          className="flex-shrink-0 h-full border-l"
          style={{
            width: '40%',
            borderColor: 'rgba(227, 242, 250, 0.6)',
          }}
        >
          <MentorChatPanelV2
            onClose={() => setMentorChatOpen(false)}
            mode={chatMode}
            taskTitle={todoTitle}
            isSmartPostOpen={true}
            onInsertContent={handleInsertContent}
            isFullHeight={true}
          />
        </div>
      )}
    </div>
  );
}