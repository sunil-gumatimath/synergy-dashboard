import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "./Toast.css";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <div className={`toast-container ${isExiting ? "toast-exit" : ""}`}>
      <div className={`toast toast--${type}`}>
        <div className="toast__icon">{icons[type]}</div>
        <p className="toast__message">{message}</p>
        <button
          onClick={handleClose}
          className="toast__close"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
        <div className="toast__progress">
          <div
            className="toast__progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;
