
export const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false,
  className = '' 
}) => {
  const baseStyle = "px-lg py-sm rounded-lg font-bold transition-all scale-95 active:scale-90 duration-100 font-label-sm text-label-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-ember-orange text-white hover:opacity-90 focus:ring-ember-orange/50 shadow-glow-accent",
    secondary: "bg-vivid-purple text-white hover:opacity-90 focus:ring-vivid-purple/50",
    outline: "border border-outline text-on-surface hover:bg-surface-container-high focus:ring-outline/50",
    text: "text-on-surface-variant hover:text-ember-orange hover:bg-surface-container/50 focus:ring-ember-orange/20"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
