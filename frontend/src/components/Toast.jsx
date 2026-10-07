import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const CONFIGS = {
  success: {
    icon: <CheckCircle2 size={16} />,
    accent: 'text-emerald-400',
    bar: '#10b981',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
  },
  error: {
    icon: <AlertCircle size={16} />,
    accent: 'text-red-400',
    bar: '#ef4444',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
  },
  info: {
    icon: <Info size={16} />,
    accent: 'text-indigo-400',
    bar: '#6366f1',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/10',
  },
};

const DURATION = 5000;

const Toast = ({ message, type = 'info', onClose }) => {
  const [progress, setProgress] = useState(100);
  const cfg = CONFIGS[type] || CONFIGS.info;

  useEffect(() => {
    const timer = setTimeout(onClose, DURATION);
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - (100 / (DURATION / 100))));
    }, 100);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-slide-left"
      style={{ maxWidth: '360px', minWidth: '280px' }}
    >
      <div
        className={`overflow-hidden border ${cfg.border} bg-slate-900/95 backdrop-blur-lg shadow-2xl rounded-xl`}
      >
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-slate-800">
          <div
            className="h-full transition-all duration-100 rounded-full"
            style={{ width: `${progress}%`, background: cfg.bar }}
          />
        </div>

        <div className="flex items-center space-x-3 px-5 py-4">
          <div
            className={`neo-icon-box w-8 h-8 flex-shrink-0 border ${cfg.border} ${cfg.bg} ${cfg.accent} rounded-xl`}
          >
            {cfg.icon}
          </div>

          <p className={`text-sm font-medium flex-1 leading-snug ${cfg.accent === 'text-emerald-400' ? 'text-emerald-200' : cfg.accent === 'text-red-400' ? 'text-red-200' : 'text-indigo-200'}`}>
            {message}
          </p>

          <button
            onClick={onClose}
            className="neo-btn-icon flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
