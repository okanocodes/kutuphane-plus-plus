import { useNavigate } from 'react-router-dom';

export const BookCard = ({ book, authorName, categoryName }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="glass-card rounded-xl border border-outline-variant p-md flex flex-col justify-between cursor-pointer book-card-hover hover:border-vivid-purple/50 transition-all duration-300"
    >
      <div className="space-y-sm">
        {/* Book Cover Placeholder */}
        <div className="aspect-[2/3] w-full bg-surface-container-highest rounded-lg flex items-center justify-center border border-outline-variant/30 relative overflow-hidden group">
          <span className="material-symbols-outlined text-outline text-5xl group-hover:scale-110 transition-transform duration-300">
            book
          </span>
          {book.rating && (
            <div className="absolute top-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-xs border border-outline-variant/30">
              <span className="material-symbols-outlined text-accent-gold text-xs font-bold">star</span>
              <span className="font-metadata-mono text-label-xs text-on-surface font-semibold">{book.rating}</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="space-y-xs pt-xs">
          <span className="font-label-xs text-xs text-vivid-purple uppercase font-bold tracking-wider">
            {categoryName || 'Kategori Yok'}
          </span>
          <h3 className="font-headline-h3 text-base font-bold text-on-surface line-clamp-1">
            {book.title}
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant line-clamp-1">
            {authorName || 'Bilinmeyen Yazar'}
          </p>
        </div>
      </div>

      <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center">
        <span className="font-metadata-mono text-label-xs text-on-surface-variant">
          {book.pages} Sayfa
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${book.status === 'available' ? 'bg-success/20 text-success' :
          book.status === 'borrowed' ? 'bg-error/20 text-error' :
            book.status === 'reserved' ? 'bg-accent-gold/20 text-accent-gold' :
              book.status === 'lost' ? 'bg-error/20 text-error' : 'bg-outline-variant/20 text-on-surface-variant'
          }`}>
          {book.status === 'available' ? 'Müsait' :
            book.status === 'borrowed' ? 'Ödünçte' :
              book.status === 'reserved' ? 'Rezerve' :
                book.status === 'lost' ? 'Kayıp' : book.status}
        </span>
      </div>
    </div>
  );
};

export default BookCard;
