import React from 'react';
import { X, ExternalLink, FileText, Image, Link2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'link' | 'document';
}

interface ReviewPostDrawerProps {
  onClose: () => void;
  todoTitle: string;
  posts: Post[];
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Initial Research Complete',
    content: 'Completed research on color theory basics including warm vs cool colors and complementary schemes. Key insights: the psychological impact of colors varies across cultures...',
    timestamp: '2025-11-10 14:30',
    type: 'text',
  },
  {
    id: '2',
    title: 'Color Palette Finalized',
    content: 'After testing multiple variations, settled on Glacial Blue (#5E94CE) as primary color. Passes WCAG AA contrast requirements.',
    timestamp: '2025-11-12 10:15',
    type: 'image',
  },
  {
    id: '3',
    title: 'Reference Material',
    content: 'Found excellent article on design systems: https://designsystems.com/guide',
    timestamp: '2025-11-14 16:45',
    type: 'link',
  },
];

const typeIcons: Record<string, any> = {
  text: FileText,
  image: Image,
  link: Link2,
  document: FileText,
};

const typeColors: Record<string, string> = {
  text: '#5B6B76',
  image: '#7BAFA3',
  link: '#5E94CE',
  document: '#F5C75C',
};

export function ReviewPostDrawer({ onClose, todoTitle, posts }: ReviewPostDrawerProps) {
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <div
      className="fixed top-0 right-0 h-full flex flex-col shadow-2xl"
      style={{
        width: '420px',
        backgroundColor: '#FAFBFC',
        borderLeft: '1px solid rgba(227, 242, 250, 0.6)',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
          borderColor: 'rgba(227, 242, 250, 0.6)',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-3">
            <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '16px', lineHeight: '1.4' }}>
              {todoTitle}
            </h3>
            <p style={{ color: '#8B95A0', fontSize: '13px', marginTop: '4px' }}>
              {displayPosts.length} Smart {displayPosts.length === 1 ? 'Post' : 'Posts'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0"
            style={{
              backgroundColor: 'rgba(139, 149, 160, 0.1)',
              color: '#8B95A0',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {displayPosts.map((post, index) => {
          const Icon = typeIcons[post.type];
          const color = typeColors[post.type];
          
          return (
            <div
              key={post.id}
              className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(227, 242, 250, 0.6)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${color}15`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                    {post.title}
                  </h4>
                  <p style={{ color: '#8B95A0', fontSize: '12px' }}>
                    {post.timestamp}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p
                className="text-sm line-clamp-3"
                style={{
                  color: '#5B6B76',
                  lineHeight: '1.5',
                }}
              >
                {post.content}
              </p>

              {/* View Full Button */}
              <button
                className="mt-3 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'rgba(94, 148, 206, 0.08)',
                  color: '#5E94CE',
                  fontWeight: 500,
                  border: '1px solid rgba(94, 148, 206, 0.15)',
                }}
              >
                <ExternalLink className="w-3 h-3" />
                Open full Smart Post
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayPosts.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                backgroundColor: 'rgba(227, 242, 250, 0.3)',
              }}
            >
              <FileText className="w-8 h-8" style={{ color: '#8B95A0' }} />
            </div>
            <p style={{ color: '#2E3A47', fontWeight: 500, fontSize: '15px', marginBottom: '8px' }}>
              No posts yet
            </p>
            <p style={{ color: '#8B95A0', fontSize: '13px', lineHeight: '1.5' }}>
              Create your first Smart Post to<br />track progress on this task
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
