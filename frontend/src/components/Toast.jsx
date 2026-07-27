import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, message, type = "success", duration = 3500 } = toast;

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} className="toast__icon toast__icon--success" />,
    error: <AlertCircle size={18} className="toast__icon toast__icon--error" />,
    info: <Info size={18} className="toast__icon toast__icon--info" />
  };

  return (
    <div className={`toast toast--${type}`} role="alert">
      {icons[type] || icons.info}
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(id)}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
