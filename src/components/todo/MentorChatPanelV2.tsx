import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Copy, ThumbsUp, ThumbsDown, Share2, Plus, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MentorChatPanelV2Props {
  onClose: () => void;
  mode: 'task-lens' | 'writing-partner';
  taskTitle?: string;
  onInsertContent?: (content: string) => void;
  isSmartPostOpen?: boolean;
  width?: number;
  onWidthChange?: (width: number) => void;
  collapsed?: boolean;
  onCollapseToggle?: (collapsed: boolean) => void;
  isFullHeight?: boolean;
}

export function MentorChatPanelV2({
  onClose,
  mode,
  taskTitle,
  onInsertContent,
  isSmartPostOpen,
  isFullHeight = false,
}: MentorChatPanelV2Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: mode === 'task-lens' 
        ? `I'm here to help you understand "${taskTitle}". What would you like to know? I can break down the task, suggest approaches, identify dependencies, or help you plan your execution strategy.`
        : `I'm your writing partner! I can help you structure your post, expand on ideas, summarize your progress, or suggest frameworks for documenting your work. What would you like help with?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mode === 'task-lens'
          ? `Let me help you with that. Here's a breakdown:\n\n1. **Understanding the Task**: ${taskTitle}\n2. **Key Considerations**: Focus on core requirements first\n3. **Suggested Approach**: Start with research and prototyping\n4. **Timeline**: Break it into 2-3 day sprints\n\nWould you like me to elaborate on any of these points?`
          : `Great question! Here's how I'd structure that:\n\n**Main Points:**\n- Start with your objective and context\n- Describe what you did and why\n- Share the key insights or learnings\n- Note any challenges and how you overcame them\n- End with next steps or reflections\n\nWould you like me to help you draft any section?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInsert = (content: string) => {
    if (isSmartPostOpen && onInsertContent) {
      onInsertContent(content);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Quick action suggestions
  const quickActions = mode === 'task-lens' 
    ? [
        'Break it down',
        'Suggest approach',
        'Dependencies',
        'Time estimate',
        'Similar tasks',
        'Best practices',
      ]
    : [
        'Structure this',
        'Expand idea',
        'Summarize',
        'Suggest framework',
        'Make concise',
        'Add context',
      ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div
        className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7BAFA3 0%, #5E94CE 100%)',
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '16px', letterSpacing: '0.3px' }}>
              Mireo ✦ Your AI Collaborator
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#7BAFA3',
                  boxShadow: '0 0 0 2px rgba(123, 175, 163, 0.2)',
                }}
              />
              <p style={{ color: '#7BAFA3', fontSize: '12px', fontWeight: 500 }}>
                {mode === 'task-lens' ? 'Task Lens' : 'Writing Partner'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: 'rgba(139, 149, 160, 0.08)',
            color: '#8B95A0',
          }}
        >
          {isFullHeight ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
        style={{
          backgroundColor: '#F8F9FA',
        }}
      >
        <div className="space-y-5">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === 'user' ? (
                // User message - simple bubble on the right
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-md"
                    style={{
                      backgroundColor: '#E3F2FA',
                      color: '#2E3A47',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                // AI message - card on the left (Moments style)
                <div className="flex justify-start">
                  <div
                    className="w-full rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid rgba(227, 242, 250, 0.6)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {/* Message Content */}
                    <div className="px-5 py-4">
                      <div
                        style={{
                          color: '#2E3A47',
                          fontSize: '14px',
                          lineHeight: '1.7',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {message.content}
                      </div>
                    </div>

                    {/* Action Bar - Moments Style */}
                    <div
                      className="px-5 py-3 border-t flex items-center gap-4"
                      style={{
                        backgroundColor: 'rgba(248, 249, 250, 0.8)',
                        borderColor: 'rgba(227, 242, 250, 0.4)',
                      }}
                    >
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="transition-all duration-200 hover:scale-110"
                        style={{
                          color: '#7BAFA3',
                        }}
                        title="Copy"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      {isSmartPostOpen && (
                        <button
                          onClick={() => handleInsert(message.content)}
                          className="transition-all duration-200 hover:scale-110"
                          style={{
                            color: '#7BAFA3',
                          }}
                          title="Insert to post"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        className="transition-all duration-200 hover:scale-110"
                        style={{
                          color: '#7BAFA3',
                        }}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-5 h-5" />
                      </button>
                      <button
                        className="transition-all duration-200 hover:scale-110"
                        style={{
                          color: '#7BAFA3',
                        }}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-5 h-5" />
                      </button>
                      <button
                        className="transition-all duration-200 hover:scale-110"
                        style={{
                          color: '#7BAFA3',
                        }}
                        title="Share"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Section: Quick Actions + Input */}
      <div
        className="flex-shrink-0 border-t"
        style={{
          backgroundColor: 'white',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        {/* Quick Actions - Multi-row Layout (No Title) */}
        <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(227, 242, 250, 0.4)' }}>
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputValue(action)}
                className="px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, rgba(123, 175, 163, 0.1) 0%, rgba(94, 148, 206, 0.1) 100%)',
                  border: '1px solid rgba(123, 175, 163, 0.25)',
                  color: '#3B7F73',
                  fontSize: '12.5px',
                  fontWeight: 500,
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="px-5 py-4">
          <div
            className="rounded-2xl flex items-end gap-3 px-4 py-3"
            style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid rgba(227, 242, 250, 0.6)',
            }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Mireo anything..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm"
              style={{
                color: '#2E3A47',
                maxHeight: '120px',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: inputValue.trim() 
                  ? 'linear-gradient(135deg, #7BAFA3 0%, #5E94CE 100%)' 
                  : 'rgba(139, 149, 160, 0.15)',
                color: 'white',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}