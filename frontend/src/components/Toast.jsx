import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 glass rounded-2xl px-6 py-4 flex items-center space-x-3 shadow-2xl animate-slide-left border ${
            type === 'success' ? 'border-green-500/20' : type === 'error' ? 'border-red-500/20' : 'border-blue-500/20'
        }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                type === 'success' ? 'bg-green-500/10 text-green-400' : type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
                {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <span className="text-sm text-gray-200 font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/5">
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
