import React, { useState } from 'react';
import { X, Link2, Image, FileText, Mic, ChevronDown, Sparkles, Zap, Heart, SmilePlus, Frown, Meh, Lightbulb, Target, TrendingUp, Award, Trophy, Star, CheckCircle2, Rocket, Coffee, Brain, ThumbsUp, Flame, Sun, type LucideIcon } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (type: string) => void;
}

type EvidenceType = 'link' | 'image' | 'document' | 'voice';

interface MoodIcon {
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
}

const moodIcons: MoodIcon[] = [
  { icon: Sparkles, label: 'Excited', desc: 'Feeling amazing!', color: '#F5C75C' },
  { icon: Heart, label: 'Love it', desc: 'Really enjoyed this', color: '#E17777' },
  { icon: SmilePlus, label: 'Happy', desc: 'Great progress', color: '#7BAFA3' },
  { icon: ThumbsUp, label: 'Satisfied', desc: 'Job well done', color: '#5E94CE' },
  { icon: Zap, label: 'Energized', desc: 'Full of energy', color: '#F5C75C' },
  { icon: Flame, label: 'On fire', desc: 'Crushing it', color: '#E17777' },
  { icon: Rocket, label: 'Productive', desc: 'Moving fast', color: '#5E94CE' },
  { icon: Target, label: 'Focused', desc: 'Hit the target', color: '#7BAFA3' },
  { icon: TrendingUp, label: 'Progress', desc: 'Making gains', color: '#7BAFA3' },
  { icon: Lightbulb, label: 'Inspired', desc: 'Had a breakthrough', color: '#F5C75C' },
  { icon: Trophy, label: 'Achieved', desc: 'Big win today', color: '#E17777' },
  { icon: Award, label: 'Proud', desc: 'Feeling accomplished', color: '#5E94CE' },
  { icon: Star, label: 'Excellent', desc: 'Outstanding work', color: '#F5C75C' },
  { icon: CheckCircle2, label: 'Done', desc: 'Task completed', color: '#7BAFA3' },
  { icon: Coffee, label: 'Relaxed', desc: 'Smooth process', color: '#5E94CE' },
  { icon: Brain, label: 'Learning', desc: 'Gained new insight', color: '#7BAFA3' },
];

export function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<EvidenceType[]>([]);
  const [title, setTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodIcon>(moodIcons[0]);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [voiceNote, setVoiceNote] = useState('');
  const [textContent, setTextContent] = useState('');

  const toggleType = (type: EvidenceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSave = () => {
    if (title.trim() || textContent.trim() || selectedTypes.length > 0) {
      const evidenceTypes = selectedTypes.join('+');
      onUpload(evidenceTypes || 'text');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
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

        {/* Evidence Type Toolbar */}
        <div 
          className="px-6 py-4 border-b flex items-center gap-3"
          style={{
            borderColor: 'rgba(227, 242, 250, 0.8)',
            backgroundColor: '#FAFBFC',
          }}
        >
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

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Title Input with Mood Emoji Picker */}
          <div className="flex items-center gap-3">
            {/* Emoji Picker Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'rgba(245, 199, 92, 0.12)',
                  fontSize: '20px',
                }}
              >
                <selectedMood.icon className="w-5 h-5" style={{ color: selectedMood.color }} />
              </button>

              {/* Emoji Dropdown */}
              {showMoodPicker && (
                <div
                  className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(227, 242, 250, 0.8)',
                    width: '320px',
                    maxHeight: '400px',
                  }}
                >
                  {/* Picker Header */}
                  <div
                    className="px-4 py-3 border-b flex items-center justify-between"
                    style={{
                      background: 'linear-gradient(180deg, #FAFBFC 0%, #F5F8FA 100%)',
                      borderColor: 'rgba(227, 242, 250, 0.8)',
                    }}
                  >
                    <span className="text-sm" style={{ color: '#2E3A47', fontWeight: 600 }}>
                      Choose your mood
                    </span>
                    <button
                      onClick={() => setShowMoodPicker(false)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(225, 119, 119, 0.1)',
                        color: '#E17777',
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Emoji Grid */}
                  <div className="p-3 grid grid-cols-4 gap-2 overflow-y-auto" style={{ maxHeight: '340px' }}>
                    {moodIcons.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => {
                          setSelectedMood(mood);
                          setShowMoodPicker(false);
                        }}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor:
                            selectedMood.label === mood.label
                              ? 'rgba(123, 175, 163, 0.15)'
                              : 'rgba(227, 242, 250, 0.2)',
                          border: `2px solid ${
                            selectedMood.label === mood.label ? '#7BAFA3' : 'transparent'
                          }`,
                        }}
                        title={mood.desc}
                      >
                        <mood.icon className="w-5 h-5" style={{ color: mood.color }} />
                        <span
                          className="text-xs text-center"
                          style={{
                            color: selectedMood.label === mood.label ? '#3B7F73' : '#5B6B76',
                            fontWeight: selectedMood.label === mood.label ? 600 : 400,
                          }}
                        >
                          {mood.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              onFocus={(e) => e.target.style.borderBottomColor = '#7BAFA3'}
              onBlur={(e) => e.target.style.borderBottomColor = 'rgba(227, 242, 250, 0.8)'}
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
            onFocus={(e) => e.target.style.borderColor = '#7BAFA3'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(227, 242, 250, 0.8)'}
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
                onFocus={(e) => e.target.style.borderColor = '#5E94CE'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(94, 148, 206, 0.3)'}
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
              <label className="flex items-center justify-center w-full px-4 py-8 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
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
              <label className="flex items-center justify-center w-full px-4 py-8 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
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
                  {voiceNote || 'No recording yet'}
                </span>
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
              backgroundColor: '#5E94CE',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Save Post
          </button>
        </div>
      </div>

      {/* Click outside to close emoji picker */}
      {showMoodPicker && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 40 }}
          onClick={() => setShowMoodPicker(false)}
        />
      )}
    </div>
  );
}