import React, { useState } from 'react';
import { X, Sparkles, Image, Link2, FileText, Mic, MessageCircle } from 'lucide-react';
import { MentorChatPanelV2 } from './MentorChatPanelV2';

interface SmartPostOverlayProps {
  onClose: () => void;
  todoTitle: string;
}

type EvidenceType = 'link' | 'image' | 'document' | 'voice';

export function SmartPostOverlay({
  onClose,
  todoTitle,
}: SmartPostOverlayProps) {
  const [selectedTypes, setSelectedTypes] = useState<EvidenceType[]>([]);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [mentorChatOpen, setMentorChatOpen] = useState(false);

  const toggleType = (type: EvidenceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleInsertContent = (text: string) => {
    const newContent = textContent ? `${textContent}\n\n${text}` : text;
    setTextContent(newContent);
  };

  const handleSave = () => {
    if (title.trim() || textContent.trim() || selectedTypes.length > 0) {
      // Save post logic
      onClose();
    }
  };

  const evidenceButtons = [
    { type: 'link' as EvidenceType, icon: Link2, label: 'Link', color: '#5E94CE' },
    { type: 'image' as EvidenceType, icon: Image, label: 'Image', color: '#7BAFA3' },
    { type: 'document' as EvidenceType, icon: FileText, label: 'Document', color: '#F5C75C' },
    { type: 'voice' as EvidenceType, icon: Mic, label: 'Voice', color: '#E17777' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      {/* Main Post Editor */}
      <div
        className="flex items-center justify-center p-4"
        style={{
          width: mentorChatOpen ? '60%' : '100%',
          transition: 'width 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-2xl rounded-2xl shadow-2xl"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(227, 242, 250, 0.8)',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{
              background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
              borderColor: 'rgba(227, 242, 250, 0.8)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            <h2 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '18px' }}>
              Attach Evidence Post
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

          {/* Evidence Type Toolbar with AI Mentor */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{
              borderColor: 'rgba(227, 242, 250, 0.8)',
              backgroundColor: '#FAFBFC',
            }}
          >
            <div className="flex items-center gap-3">
              {evidenceButtons.map((btn) => {
                const Icon = btn.icon;
                const isSelected = selectedTypes.includes(btn.type);
                return (
                  <button
                    key={btn.type}
                    onClick={() => toggleType(btn.type)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: isSelected ? `${btn.color}15` : 'rgba(227, 242, 250, 0.3)',
                      border: `2px solid ${isSelected ? btn.color : 'transparent'}`,
                      color: isSelected ? btn.color : '#5B6B76',
                    }}
                    title={btn.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            {/* AI Mentor Button */}
            <button
              onClick={() => setMentorChatOpen(!mentorChatOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: mentorChatOpen
                  ? 'rgba(123, 175, 163, 0.2)'
                  : 'rgba(227, 242, 250, 0.3)',
                border: `2px solid ${mentorChatOpen ? '#7BAFA3' : 'transparent'}`,
                color: mentorChatOpen ? '#7BAFA3' : '#5B6B76',
              }}
              title="AI Mentor"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Title Input with Sparkles Icon */}
            <div className="flex items-center gap-3">
              {/* Sparkles Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(245, 199, 92, 0.12)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#F5C75C' }} />
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title..."
                className="flex-1 px-0 py-2 text-base outline-none"
                style={{
                  color: '#2E3A47',
                  borderBottom: '2px solid rgba(227, 242, 250, 0.8)',
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#7BAFA3')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(227, 242, 250, 0.8)')}
              />
            </div>

            {/* Main Text Area */}
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Describe your progress, insights, or notes..."
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none transition-all duration-200"
              rows={6}
              style={{
                backgroundColor: 'rgba(227, 242, 250, 0.2)',
                border: '2px solid rgba(227, 242, 250, 0.8)',
                color: '#2E3A47',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#7BAFA3')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)')}
            />

            {/* Dynamic Input Fields Based on Selected Types */}
            {selectedTypes.includes('link') && (
              <div
                className="p-4 rounded-lg space-y-2"
                style={{
                  backgroundColor: 'rgba(94, 148, 206, 0.08)',
                  border: '1px solid rgba(94, 148, 206, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4" style={{ color: '#5E94CE' }} />
                  <span className="text-xs" style={{ color: '#5E94CE', fontWeight: 600 }}>
                    Link Attachment
                  </span>
                </div>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid rgba(94, 148, 206, 0.3)',
                    color: '#2E3A47',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#5E94CE')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(94, 148, 206, 0.3)')}
                />
              </div>
            )}

            {selectedTypes.includes('image') && (
              <div
                className="p-4 rounded-lg space-y-2"
                style={{
                  backgroundColor: 'rgba(123, 175, 163, 0.08)',
                  border: '1px solid rgba(123, 175, 163, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4" style={{ color: '#7BAFA3' }} />
                  <span className="text-xs" style={{ color: '#7BAFA3', fontWeight: 600 }}>
                    Image Upload
                  </span>
                </div>
                <label
                  className="flex items-center justify-center w-full px-4 py-8 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'white',
                    border: '2px dashed rgba(123, 175, 163, 0.4)',
                    color: '#7BAFA3',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-2" style={{ color: '#7BAFA3' }} />
                    <span className="text-sm">
                      {imageFile ? imageFile.name : 'Click to upload image'}
                    </span>
                  </div>
                </label>
              </div>
            )}

            {selectedTypes.includes('document') && (
              <div
                className="p-4 rounded-lg space-y-2"
                style={{
                  backgroundColor: 'rgba(245, 199, 92, 0.08)',
                  border: '1px solid rgba(245, 199, 92, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" style={{ color: '#F5C75C' }} />
                  <span className="text-xs" style={{ color: '#F5C75C', fontWeight: 600 }}>
                    Document Upload
                  </span>
                </div>
                <label
                  className="flex items-center justify-center w-full px-4 py-8 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'white',
                    border: '2px dashed rgba(245, 199, 92, 0.4)',
                    color: '#F5C75C',
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#F5C75C' }} />
                    <span className="text-sm">
                      {documentFile ? documentFile.name : 'Click to upload document'}
                    </span>
                  </div>
                </label>
              </div>
            )}

            {selectedTypes.includes('voice') && (
              <div
                className="p-4 rounded-lg space-y-2"
                style={{
                  backgroundColor: 'rgba(225, 119, 119, 0.08)',
                  border: '1px solid rgba(225, 119, 119, 0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4" style={{ color: '#E17777' }} />
                  <span className="text-xs" style={{ color: '#E17777', fontWeight: 600 }}>
                    Voice Note
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    style={{
                      backgroundColor: 'rgba(225, 119, 119, 0.15)',
                      color: '#E17777',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}
                  >
                    <Mic className="w-4 h-4" />
                    Record Voice
                  </button>
                  <span className="text-xs" style={{ color: '#5B6B76' }}>
                    No recording yet
                  </span>
                </div>
              </div>
            )}

            {/* AI Suggestion when mentor chat is not open */}
            {!mentorChatOpen && (
              <div
                className="rounded-xl p-4"
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
                      Click the message icon above to get AI assistance with structuring your post, summarizing insights, or finding examples.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 border-t flex items-center justify-end gap-3"
            style={{
              borderColor: 'rgba(227, 242, 250, 0.8)',
              backgroundColor: '#FAFBFC',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
          >
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(91, 107, 118, 0.08)',
                color: '#5B6B76',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#7BAFA3',
                color: 'white',
                fontWeight: 600,
              }}
            >
              Save Post
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Mentor */}
      {mentorChatOpen && (
        <div
          className="flex-shrink-0 h-full"
          style={{
            width: '40%',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full" style={{ backgroundColor: 'white' }}>
            <MentorChatPanelV2
              onClose={() => setMentorChatOpen(false)}
              mode="writing-partner"
              taskTitle={todoTitle}
              isSmartPostOpen={true}
              onInsertContent={handleInsertContent}
              isFullHeight={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}