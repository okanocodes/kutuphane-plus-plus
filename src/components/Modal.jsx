export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-md">
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-[1000px] max-w-[95vw] max-h-[90vh] overflow-y-auto glass-card border border-outline-variant p-lg rounded-2xl shadow-glow-accent z-10">
        <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
          <h3 className="font-headline-h3 text-xl font-bold text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-ember-orange transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="py-sm">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
