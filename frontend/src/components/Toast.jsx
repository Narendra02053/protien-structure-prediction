import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const CONFIGS = {
  success: {
    icon: <CheckCircle2 size={17} />,
    color: '#34d399',
    bg: 'rgba(5,150,105,0.12)',
    border: 'rgba(5,150,105,0.25)',
    bar: 'from-emerald-500 to-teal-500',
  },
  error: {
    icon: <AlertCircle size={17} />,
    color: '#f87171',
    bg: 'rgba(220,38,38,0.12)',
    border: 'rgba(220,38,38,0.25)',
    bar: 'from-red-500 to-orange-500',
  },
  info: {
    icon: <Info size={17} />,
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.12)',
    border: 'rgba(37,99,235,0.25)',
    bar: 'from-blue-500 to-cyan-500',
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
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(6, 10, 22, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${cfg.border}`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 30px ${cfg.color}15`,
        }}
      >
        {/* Progress bar */}
        <div className="h-0.5 w-full bg-gray-900/60">
          <div
            className={`h-full bg-gradient-to-r ${cfg.bar} transition-all duration-100`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center space-x-3 px-5 py-4">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.icon}
          </div>

          {/* Message */}
          <p className="text-sm text-gray-200 font-medium flex-1 leading-snug">{message}</p>

          {/* Close */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
