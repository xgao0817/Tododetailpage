import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface MentorChatPanelProps {
  onClose: () => void;
  mode: 'task-understanding' | 'writing-assist';
  taskTitle?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  insertable?: boolean;
}

const taskUnderstandingQuestions = [
  { id: 'goal', text: 'What is the goal of this task?', icon: '🎯' },
  { id: 'input', text: 'What kind of input is expected?', icon: '📝' },
  { id: 'why', text: 'Why does this matter?', icon: '💡' },
  { id: 'example', text: 'Show me an example', icon: '✨' },
  { id: 'background', text: 'Show me background info', icon: '📚' },
];

const writingAssistOptions = [
  { id: 'structure', text: 'Provide structure', icon: '📋' },
  { id: 'summarize', text: 'Summarize related moments', icon: '📝' },
  { id: 'lookup', text: 'Look up info', icon: '🔍' },
  { id: 'examples', text: 'Suggest examples', icon: '💡' },
  { id: 'questions', text: 'Ask guiding questions', icon: '❓' },
];

const aiResponses: Record<string, string> = {
  goal: "This task aims to establish a comprehensive understanding of the design system's core principles, ensuring consistency across all product touchpoints. The primary goal is to create a single source of truth that team members can reference when making design decisions.",
  input: "You'll need to provide detailed documentation including color specifications, typography scales, component usage guidelines, and code examples. Screenshots, Figma links, and interactive prototypes are highly valuable inputs.",
  why: "A well-documented design system reduces inconsistencies, speeds up development time, improves cross-team collaboration, and ensures brand cohesion. It transforms design from ad-hoc decisions into a systematic, scalable process.",
  example: "Example structure:\n\n1. **Colors**: Primary (#5E94CE), Secondary (#7BAFA3), Accent (#F5C75C)\n2. **Typography**: Headings (Semibold, 18-32px), Body (Regular, 14-16px)\n3. **Components**: Buttons, Cards, Inputs with states (default, hover, active, disabled)\n4. **Spacing**: 4px base unit (8px, 16px, 24px, 32px)\n5. **Usage Guidelines**: Do's and don'ts with visual examples",
  background: "Design systems emerged from the need to scale design consistency across growing product teams. Companies like Airbnb, Shopify, and IBM pioneered comprehensive systems that balance flexibility with structure. The glacial blue theme you're working with represents a calming, professional aesthetic suitable for productivity tools.",
  structure: "**Suggested Post Structure:**\n\n**Title**: [Your key insight or progress]\n\n**Context**: What were you working on? What was the situation?\n\n**Action**: What did you do? What approaches did you try?\n\n**Result**: What happened? What did you learn?\n\n**Next Steps**: Where do you go from here?\n\n**Resources**: Links, images, references",
  summarize: "Based on your recent moments:\n\n• **Nov 14**: Discussed color theory with team, noted warm vs cool palette tensions\n• **Nov 12**: Experimented with different blue shades, settled on #5E94CE\n• **Nov 10**: Reviewed competitor design systems (Shopify Polaris, Material Design)\n• **Nov 8**: Initial research on accessibility requirements (WCAG AA contrast ratios)",
  lookup: "I can help you find information on:\n\n• Design system best practices and case studies\n• Accessibility guidelines (WCAG standards)\n• Component documentation patterns\n• Typography and color theory resources\n• Figma/design tool integration tips\n\nWhat would you like to explore?",
  examples: "**Example Evidence Post:**\n\n**Title**: \"Finalized Primary Color Palette\"\n\n**Content**: After testing 8 different blue variations, settled on Glacial Blue (#5E94CE) for primary actions. Tested against white and gray backgrounds, passes WCAG AA contrast requirements. Team feedback was positive - described as \"professional yet approachable.\"\n\n**Attachments**: \n• Color palette screenshot\n• Contrast ratio test results\n• Team feedback summary",
  questions: "Let me ask you some questions to guide your thinking:\n\n• What was the most challenging part of this task?\n• What surprised you during the process?\n• How does this work connect to your broader goals?\n• What would you do differently next time?\n• Who might benefit from knowing about this?",
};

export function MentorChatPanel({ onClose, mode, taskTitle }: MentorChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: mode === 'task-understanding' 
        ? `I'm here to help you understand the task: "${taskTitle}". What would you like to know?`
        : 'How would you like me to assist with this post?',
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleQuickReply = (questionId: string) => {
    const question = mode === 'task-understanding' 
      ? taskUnderstandingQuestions.find(q => q.id === questionId)
      : writingAssistOptions.find(q => q.id === questionId);
    
    if (question) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: question.text,
      };
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[questionId] || 'Let me help you with that...',
        insertable: mode === 'writing-assist',
      };
      
      setMessages([...messages, userMessage, aiMessage]);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
      };
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your question. Let me provide some insights...',
        insertable: mode === 'writing-assist',
      };
      
      setMessages([...messages, userMessage, aiMessage]);
      setInputValue('');
    }
  };

  const quickReplies = mode === 'task-understanding' ? taskUnderstandingQuestions : writingAssistOptions;
  const showQuickReplies = true; // Always show quick actions

  return (
    <div
      className="fixed top-0 right-0 h-full flex flex-col shadow-2xl"
      style={{
        width: '35%',
        backgroundColor: '#FAFBFC',
        borderLeft: '1px solid rgba(227, 242, 250, 0.6)',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
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
            <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '16px' }}>
              Mentor Assist
            </h3>
            <p style={{ color: '#8B95A0', fontSize: '13px', marginTop: '2px' }}>
              {mode === 'task-understanding' ? 'Task Understanding' : 'Writing Assistant'}
            </p>
          </div>
        </div>
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] rounded-xl px-4 py-3"
              style={{
                backgroundColor: message.type === 'user' 
                  ? 'rgba(94, 148, 206, 0.12)' 
                  : 'white',
                border: message.type === 'user' 
                  ? '1px solid rgba(94, 148, 206, 0.2)' 
                  : '1px solid rgba(227, 242, 250, 0.6)',
                boxShadow: message.type === 'user' 
                  ? 'none' 
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <p
                style={{
                  color: '#2E3A47',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.content}
              </p>
              
              {message.insertable && message.type === 'ai' && (
                <button
                  className="mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(123, 175, 163, 0.12)',
                    color: '#3B7F73',
                    fontWeight: 500,
                    border: '1px solid rgba(123, 175, 163, 0.2)',
                  }}
                >
                  <ArrowRight className="w-3 h-3" />
                  Insert into Post
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Quick Reply Pills */}
        {showQuickReplies && (
          <div className="space-y-2 pt-2">
            <p style={{ color: '#8B95A0', fontSize: '12px', fontWeight: 500 }}>
              Quick actions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply.id)}
                  className="px-3 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'white',
                    color: '#5E94CE',
                    fontWeight: 500,
                    border: '1px solid rgba(94, 148, 206, 0.2)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <span style={{ marginRight: '6px' }}>{reply.icon}</span>
                  {reply.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="px-6 py-4 border-t"
        style={{
          backgroundColor: 'white',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: 'rgba(227, 242, 250, 0.2)',
              border: '1px solid rgba(227, 242, 250, 0.6)',
              color: '#2E3A47',
            }}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: '#5E94CE',
              color: 'white',
              fontWeight: 500,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}