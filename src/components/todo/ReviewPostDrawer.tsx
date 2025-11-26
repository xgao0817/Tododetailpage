import React, { useState } from 'react';
import { X, Image as ImageIcon, Link2, FileText, Music, Video } from 'lucide-react';

interface PostAsset {
  type: 'photo' | 'link' | 'document' | 'video' | 'audio';
  url?: string;
  title?: string;
  thumbnails?: string[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  assets?: PostAsset[];
  timestamp: string;
}

interface ReviewPostDrawerProps {
  onClose: () => void;
  todoTitle: string;
  posts: Post[];
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Studio Discovery',
    content: 'Discovered an abandoned warehouse with perfect natural lighting. The space has incredible acoustics and industrial character that could work perfectly for the photo series.',
    assets: [
      {
        type: 'photo',
        thumbnails: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
        ],
      },
    ],
    timestamp: '2025-11-10 14:30',
  },
  {
    id: '2',
    title: 'Creative Process R...',
    content: "The creative process isn't about perfection—it's about showing up consistently and learning from every iteration. Today I realized that my best work comes from embracing the messy middle.",
    timestamp: '2025-11-12 10:15',
  },
  {
    id: '3',
    title: 'Location Scouting',
    content: 'Completed the final editing phase for the nature series. The challenge was maintaining color consistency across different lighting conditions.',
    assets: [
      {
        type: 'photo',
        thumbnails: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
        ],
      },
    ],
    timestamp: '2025-11-14 16:45',
  },
  {
    id: '4',
    title: 'Portfolio Launch',
    content: 'Published my creative portfolio for 2024 showcasing the best work from this year.',
    assets: [
      {
        type: 'link',
        url: 'https://portfolio.example.com',
        title: 'My Creative Portfolio 2024',
      },
    ],
    timestamp: '2025-11-15 09:20',
  },
];

export function ReviewPostDrawer({ onClose, todoTitle, posts }: ReviewPostDrawerProps) {
  const displayPosts = posts.length > 0 ? posts : mockPosts;
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <>
      <div
        className="fixed top-0 right-0 h-full flex flex-col shadow-2xl"
        style={{
          width: '560px',
          backgroundColor: '#F8F9FA',
          borderLeft: '1px solid rgba(227, 242, 250, 0.8)',
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div
          className="px-7 py-6 border-b"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(227, 242, 250, 0.8)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '20px', marginBottom: '6px' }}>
                {todoTitle}
              </h2>
              <p style={{ color: '#8B95A0', fontSize: '14px' }}>
                {displayPosts.length} Smart {displayPosts.length === 1 ? 'Post' : 'Posts'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(139, 149, 160, 0.08)',
                color: '#8B95A0',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {displayPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const hasAssets = post.assets && post.assets.length > 0;

            return (
              <div
                key={post.id}
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(227, 242, 250, 0.8)',
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Post Header - No source label */}
                <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(227, 242, 250, 0.5)' }}>
                  <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '17px' }}>
                    {post.title}
                  </h3>
                </div>

                {/* Post Content */}
                <div className="p-6 space-y-4">
                  {/* Content Card - Green background */}
                  <div
                    className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:opacity-90"
                    onClick={() => post.content.length > 100 && toggleExpand(post.id)}
                    style={{
                      backgroundColor: '#E8F4F1',
                    }}
                  >
                    <p
                      style={{
                        color: '#3C4751',
                        fontSize: '15px',
                        lineHeight: '1.6',
                      }}
                    >
                      {isExpanded || post.content.length <= 100
                        ? post.content
                        : post.content.slice(0, 100) + '...'}
                    </p>
                  </div>

                  {/* Assets Cards - Green background */}
                  {hasAssets && post.assets!.map((asset, assetIndex) => {
                    if (asset.type === 'photo' && asset.thumbnails) {
                      return (
                        <div
                          key={assetIndex}
                          className="rounded-2xl p-5"
                          style={{
                            backgroundColor: '#E8F4F1',
                          }}
                        >
                          <div className="space-y-4">
                            {/* Photos Label */}
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-5 h-5" style={{ color: '#7BAFA3' }} />
                              <span
                                style={{
                                  color: '#6B7784',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  letterSpacing: '0.5px',
                                }}
                              >
                                PHOTOS ({asset.thumbnails.length})
                              </span>
                            </div>
                            {/* Photo Grid */}
                            <div className="flex gap-3 flex-wrap">
                              {asset.thumbnails.map((thumbnail, thumbIndex) => (
                                <div
                                  key={thumbIndex}
                                  className="w-24 h-24 rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105"
                                  style={{
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                  }}
                                  onClick={() => setPreviewImage(thumbnail)}
                                >
                                  <img
                                    src={thumbnail}
                                    alt={`Photo ${thumbIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (asset.type === 'video') {
                      return (
                        <div
                          key={assetIndex}
                          className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:opacity-90"
                          style={{
                            backgroundColor: '#E8F4F1',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                backgroundColor: 'rgba(123, 175, 163, 0.2)',
                              }}
                            >
                              <Video className="w-5 h-5" style={{ color: '#7BAFA3' }} />
                            </div>
                            <span style={{ color: '#3C4751', fontSize: '15px', fontWeight: 500 }}>
                              {asset.title || 'Video'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (asset.type === 'audio') {
                      return (
                        <div
                          key={assetIndex}
                          className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:opacity-90"
                          style={{
                            backgroundColor: '#E8F4F1',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                backgroundColor: 'rgba(123, 175, 163, 0.2)',
                              }}
                            >
                              <Music className="w-5 h-5" style={{ color: '#7BAFA3' }} />
                            </div>
                            <span style={{ color: '#3C4751', fontSize: '15px', fontWeight: 500 }}>
                              {asset.title || 'Audio'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (asset.type === 'link') {
                      return (
                        <div
                          key={assetIndex}
                          className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:opacity-90"
                          style={{
                            backgroundColor: '#E8F4F1',
                          }}
                          onClick={() => asset.url && window.open(asset.url, '_blank')}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                backgroundColor: 'rgba(94, 148, 206, 0.15)',
                              }}
                            >
                              <Link2 className="w-5 h-5" style={{ color: '#5E94CE' }} />
                            </div>
                            <span style={{ color: '#3C4751', fontSize: '15px', fontWeight: 500 }}>
                              {asset.title || 'Link'}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>

                {/* Timestamp Footer */}
                <div
                  className="px-6 py-4 border-t"
                  style={{
                    backgroundColor: '#FAFBFC',
                    borderColor: 'rgba(227, 242, 250, 0.5)',
                  }}
                >
                  <p style={{ color: '#8B95A0', fontSize: '13px' }}>
                    {new Date(post.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })} • {new Date(post.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {displayPosts.length === 0 && (
          <div className="flex-1 flex items-center justify-center px-7 py-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
                style={{
                  backgroundColor: 'rgba(227, 242, 250, 0.3)',
                }}
              >
                <FileText className="w-10 h-10" style={{ color: '#8B95A0' }} />
              </div>
              <p style={{ color: '#2E3A47', fontWeight: 600, fontSize: '17px', marginBottom: '10px' }}>
                No posts yet
              </p>
              <p style={{ color: '#8B95A0', fontSize: '14px', lineHeight: '1.5' }}>
                Create your first Smart Post to<br />track progress on this task
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 200,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}