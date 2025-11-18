import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  action?: {
    label: string;
    onClick: () => void;
  } | null;
}

export function Toast({ message, show, action }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div 
        className="max-w-md mx-4 rounded-2xl p-6 shadow-2xl transition-all duration-300 pointer-events-auto"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FAF7 100%)',
          border: '1px solid rgba(123, 175, 163, 0.3)',
          boxShadow: '0 20px 60px rgba(123, 175, 163, 0.3)',
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7BAFA3 0%, #A8D9CB 100%)',
              boxShadow: '0 4px 16px rgba(123, 175, 163, 0.35)'
            }}
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 pt-1">
            <p className="leading-relaxed" style={{ color: '#2B4C5E', fontSize: '15px' }}>
              {message}
            </p>
            
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                }}
                className="mt-4 px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #7BAFA3 0%, #9BC9BE 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(123, 175, 163, 0.3)',
                  fontWeight: 500,
                }}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}