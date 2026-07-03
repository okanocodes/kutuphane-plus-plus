
export const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  id,
  name,
  className = ''
}) => {
  return (
    <div className={`space-y-xs w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-on-surface-variant font-label-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-outline-variant bg-surface-container-high text-on-surface placeholder-on-surface-variant/60 rounded-lg focus:outline-none focus:border-vivid-purple focus:ring-2 focus:ring-vivid-purple/50 focus:ring-offset-2 focus:ring-offset-surface sm:text-sm transition-all duration-200"
      />
    </div>
  );
};

export default Input;
