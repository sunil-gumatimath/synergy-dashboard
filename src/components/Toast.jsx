import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />
  };

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };

  const iconStyles = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-amber-600'
  };

  return (
    <div className={`fixed top-6 right-6 z-[100] max-w-md animate-slide-in-right`}>
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${styles[type]}`}>
        <div className={iconStyles[type]}>
          {icons[type]}
        </div>
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
