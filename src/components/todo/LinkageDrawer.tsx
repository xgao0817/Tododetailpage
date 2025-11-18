import React from 'react';
import { X, ExternalLink, FileText, Folder, Mountain } from 'lucide-react';

interface LinkageDrawerProps {
  onClose: () => void;
  linkageType: 'moment' | 'project';
  linkageTitle: string;
}

const linkageData = {
  moment: {
    icon: FileText,
    color: '#7BAFA3',
    title: 'Moment',
    content: `**Original Moment Content:**

This moment captured insights from the team discussion about color theory on Nov 10. We explored the psychological impacts of different color palettes and how they affect user perception.

Key points discussed:
• Warm colors (reds, oranges) create urgency and energy
• Cool colors (blues, greens) promote calmness and trust
• Cultural context matters - color meanings vary globally
• Accessibility must be considered (contrast ratios, colorblindness)

The team agreed on focusing on a glacial blue theme for its professional yet approachable feel.`,
    metadata: 'Created: Nov 10, 2025 • Updated: Nov 12, 2025',
  },
  project: {
    icon: Folder,
    color: '#5E94CE',
    title: 'Project',
    content: `**Project: NVDA Deep Research**

A comprehensive research initiative focused on analyzing NVIDIA stock performance, market trends, and investment opportunities.

**Project Goals:**
• Track daily price movements and identify patterns
• Analyze quarterly earnings and guidance
• Monitor AI/GPU market dynamics
• Evaluate long-term investment thesis

**Current Status:**
In Progress - 67% Complete

**Team Members:**
Sarah Chen (Lead), Michael Rodriguez, Emma Thompson`,
    metadata: 'Started: Oct 1, 2025 • Due: Dec 31, 2025',
  },
  milestone: {
    icon: Mountain,
    color: '#F5C75C',
    title: 'Milestone',
    content: `**Milestone: Q4 Launch**

Critical milestone marking the launch of the new design system and accompanying documentation.

**Success Criteria:**
✓ All components documented
✓ Code examples provided
✓ Accessibility guidelines complete
• Design tokens finalized (in progress)
• Team training completed (pending)

**Dependencies:**
• Design system documentation
• Component library v2.0
• Figma integration

**Target Date:** December 15, 2025`,
    metadata: 'Priority: High • Status: On Track',
  },
};

export function LinkageDrawer({ onClose, linkageType, linkageTitle }: LinkageDrawerProps) {
  const data = linkageData[linkageType];
  const Icon = data.icon;

  return (
    <div
      className="fixed top-0 right-0 h-full flex flex-col shadow-2xl"
      style={{
        width: '480px',
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
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${data.color}15`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color: data.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#8B95A0', fontSize: '12px', marginBottom: '4px' }}>
                {data.title}
              </p>
              <h3 style={{ color: '#2E3A47', fontWeight: 600, fontSize: '16px', lineHeight: '1.4' }}>
                {linkageTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0 ml-3"
            style={{
              backgroundColor: 'rgba(139, 149, 160, 0.1)',
              color: '#8B95A0',
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Metadata */}
        <div
          className="rounded-lg px-3 py-2 mb-4"
          style={{
            backgroundColor: 'rgba(227, 242, 250, 0.3)',
          }}
        >
          <p style={{ color: '#5B6B76', fontSize: '12px' }}>
            {data.metadata}
          </p>
        </div>

        {/* Main Content */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(227, 242, 250, 0.6)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              color: '#2E3A47',
              fontSize: '14px',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
            }}
          >
            {data.content}
          </div>
        </div>

        {/* Navigation Button */}
        <button
          className="mt-5 w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.01]"
          style={{
            backgroundColor: `${data.color}12`,
            border: `1px solid ${data.color}30`,
            color: data.color,
          }}
        >
          <span style={{ fontWeight: 500, fontSize: '14px' }}>
            Go to {data.title.toLowerCase()} page
          </span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Related Items */}
        {linkageType === 'project' && (
          <div className="mt-6">
            <p style={{ color: '#5B6B76', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Related Tasks
            </p>
            <div className="space-y-2">
              {[
                'Research NVDA market position',
                'Analyze Q3 earnings report',
                'Compare with AMD performance'
              ].map((task, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid rgba(227, 242, 250, 0.6)',
                  }}
                >
                  <p style={{ color: '#2E3A47', fontSize: '13px' }}>
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}