import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const CONFIGS = {
  success: {
    icon: <CheckCircle2 size={17} strokeWidth={2.5} />,
    bg: '#7CFF6B',
    bar: '#0a0a0a',
  },
  error: {
    icon: <AlertCircle size={17} strokeWidth={2.5} />,
    bg: '#FF6B6B',
    bar: '#0a0a0a',
  },
  info: {
    icon: <Info size={17} strokeWidth={2.5} />,
    bg: '#7C9EFF',
    bar: '#0a0a0a',
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
        className="overflow-hidden border-3 border-white shadow-neo-lg bg-[#141414]"
      >
        <div className="h-2 w-full bg-[#1a1a1a] border-b-2 border-white">
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, background: cfg.bar }}
          />
        </div>

        <div className="flex items-center space-x-3 px-5 py-4">
          <div
            className="neo-icon-box w-9 h-9 flex-shrink-0"
            style={{ background: cfg.bg, color: '#0a0a0a' }}
          >
            {cfg.icon}
          </div>

          <p className="text-sm text-white font-extrabold flex-1 leading-snug">{message}</p>

          <button
            onClick={onClose}
            className="neo-btn-icon flex-shrink-0 p-1.5"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
