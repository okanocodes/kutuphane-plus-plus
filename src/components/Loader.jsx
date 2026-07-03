
export const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {/* Animating wrapper for hardware acceleration as recommended by skill/skill.md */}
      <div className="animate-spin">
        <div className={`rounded-full border-t-ember-orange border-r-vivid-purple border-b-outline-variant border-l-outline-variant/35 ${sizes[size]}`} />
      </div>
    </div>
  );
};

export default Loader;
