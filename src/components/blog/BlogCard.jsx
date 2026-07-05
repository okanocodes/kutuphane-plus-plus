export const BlogCard = ({ blog, onClick }) => {
  const categoryLabels = {
    news: 'Haberler',
    recommendation: 'Kitap Önerisi',
    new_release: 'Yeni Kitaplar',
  };

  const categoryColorClasses = {
    news: 'bg-vivid-purple/20 text-tertiary-fixed',
    recommendation: 'bg-ember-orange/20 text-ember-orange',
    new_release: 'bg-success/20 text-success',
  };

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl border border-outline-variant overflow-hidden flex flex-col justify-between cursor-pointer book-card-hover hover:border-vivid-purple/50 transition-all duration-300"
    >
      <div className="space-y-sm text-left">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full bg-surface-container-highest overflow-hidden border-b border-outline-variant/30">
          <img
            src={blog.imageUrl || 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80'}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${categoryColorClasses[blog.category] || 'bg-outline-variant/20 text-on-surface-variant'}`}>
            {categoryLabels[blog.category] || 'Blog'}
          </span>
        </div>

        {/* Details */}
        <div className="p-md space-y-xs">
          <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-metadata-mono font-medium">
            <span>{blog.date}</span>
            <span>Yazar: {blog.author}</span>
          </div>

          <h3 className="font-headline-h3 text-base font-bold text-on-surface line-clamp-2 pt-xs">
            {blog.title}
          </h3>

          <p className="font-body-md text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
            {blog.content}
          </p>
        </div>
      </div>

      <div className="px-md pb-md flex items-center justify-end text-xs font-bold text-ember-orange hover:text-ember-orange/80 group">
        <span>Devamını Oku</span>
        <span className="material-symbols-outlined text-sm ml-xs group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
