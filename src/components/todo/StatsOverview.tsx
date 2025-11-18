import React from 'react';
import { CheckCircle2, Circle, FileText, Paperclip } from 'lucide-react';

interface StatsOverviewProps {
  total: number;
  notStarted: number;
  done: number;
  posts: number;
}

export function StatsOverview({ 
  total, 
  notStarted, 
  done, 
  posts 
}: StatsOverviewProps) {
  const stats = [
    {
      label: 'Total',
      value: total,
      gradient: 'linear-gradient(135deg, #7BAFA3 0%, #9BC9BE 100%)',
      iconColor: '#FFFFFF',
      textColor: '#FFFFFF',
      icon: FileText,
      borderColor: 'rgba(123, 175, 163, 0.3)',
    },
    {
      label: 'Active',
      value: notStarted,
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #EBF5FC 100%)',
      iconColor: '#85B8D4',
      textColor: '#5E94CE',
      icon: Circle,
      borderColor: 'rgba(133, 184, 212, 0.2)',
    },
    {
      label: 'Done',
      value: done,
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0FAF7 100%)',
      iconColor: '#7BAFA3',
      textColor: '#3B7F73',
      icon: CheckCircle2,
      borderColor: 'rgba(123, 175, 163, 0.2)',
    },
    {
      label: 'Smart Posts',
      value: posts,
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5FAFE 100%)',
      iconColor: '#8BADC1',
      textColor: '#5B7A8C',
      icon: Paperclip,
      borderColor: 'rgba(139, 173, 193, 0.2)',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isFirst = index === 0;
        
        return (
          <div
            key={index}
            className="relative rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden group"
            style={{
              background: stat.gradient,
              boxShadow: isFirst 
                ? '0 4px 16px rgba(123, 175, 163, 0.2)' 
                : '0 2px 12px rgba(0, 0, 0, 0.04)',
              border: `1px solid ${stat.borderColor}`,
            }}
          >
            {/* Decorative pattern for first card */}
            {isFirst && (
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
              />
            )}
            
            {/* Icon */}
            <div 
              className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110"
              style={{
                backgroundColor: isFirst ? 'rgba(255, 255, 255, 0.2)' : `${stat.iconColor}15`,
              }}
            >
              <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 relative z-10">
              <div 
                className="mb-0.5" 
                style={{ 
                  color: stat.textColor, 
                  fontSize: '28px', 
                  fontWeight: 700, 
                  lineHeight: 1, 
                  letterSpacing: '-0.03em' 
                }}
              >
                {stat.value}
              </div>
              <div 
                className="text-xs truncate" 
                style={{ 
                  color: isFirst ? 'rgba(255, 255, 255, 0.9)' : '#6A7A86', 
                  fontWeight: 500,
                  letterSpacing: '0.02em'
                }}
              >
                {stat.label}
              </div>
            </div>

            {/* Hover effect line */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{
                background: isFirst 
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 100%)'
                  : `linear-gradient(90deg, transparent 0%, ${stat.iconColor} 50%, transparent 100%)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
}