import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    info: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  };

  const iconStyles = {
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-none shadow-2xl max-w-sm w-full animate-scale-in border border-slate-100">
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`p-4 rounded-none mb-6 ${iconStyles[type]}`}>
            <AlertTriangle size={32} strokeWidth={1.5} />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>

          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full px-4 py-3 text-white text-sm font-semibold rounded-none shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles[type]}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-none hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["danger", "warning", "info"]),
};

export default ConfirmModal;
