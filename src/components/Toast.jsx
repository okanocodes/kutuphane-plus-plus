import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../store/uiSlice';

export const ToastContainer = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.ui);

  return (
    <div 
      style={{ left: '24px', bottom: '24px', width: '350px', maxWidth: 'calc(100vw - 48px)' }} 
      className="fixed z-50 flex flex-col gap-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => dispatch(removeToast(toast.id))} 
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const styles = {
    success: "border-success/30 bg-surface-container/90 text-success shadow-lg",
    error: "border-error/30 bg-surface-container/90 text-error shadow-lg",
    warning: "border-accent-gold/30 bg-surface-container/90 text-accent-gold shadow-lg",
    info: "border-vivid-purple/30 bg-surface-container/90 text-primary shadow-lg"
  };

  const icons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info"
  };

  return (
    <div className={`flex items-center justify-between p-md border rounded-xl backdrop-blur-md pointer-events-auto transition-all duration-300 border-l-4 ${
      toast.type === 'success' ? 'border-l-success' :
      toast.type === 'error' ? 'border-l-error' :
      toast.type === 'warning' ? 'border-l-accent-gold' : 'border-l-vivid-purple'
    } ${styles[toast.type]}`}>
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined">{icons[toast.type]}</span>
        <span className="font-label-sm text-sm font-semibold">{toast.message}</span>
      </div>
      <button onClick={onClose} className="hover:opacity-75 transition-opacity ml-sm">
        <span className="material-symbols-outlined text-sm block">close</span>
      </button>
    </div>
  );
};

export default ToastContainer;
