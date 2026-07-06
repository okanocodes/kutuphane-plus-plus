import { useMemo } from 'react';
import BookCard from '../BookCard';

export const SimilarBooks = ({ currentBook, books, authors, categories }) => {
  const similarBooksList = useMemo(() => {
    if (!currentBook || !books) return [];
    return books
      .filter(
        (b) =>
          String(b.id) !== String(currentBook.id) &&
          (String(b.categoryId) === String(currentBook.categoryId) ||
            String(b.authorId) === String(currentBook.authorId))
      )
      .slice(0, 4);
  }, [currentBook, books]);

  if (similarBooksList.length === 0) return null;

  const getAuthorName = (authorId) => {
    return authors.find((a) => String(a.id) === String(authorId))?.name || 'Yazar Bilinmiyor';
  };

  const getCategoryName = (categoryId) => {
    return categories.find((c) => String(c.id) === String(categoryId))?.name || 'Kategori Bilinmiyor';
  };

  return (
    <div className="space-y-md py-lg border-t border-outline-variant/30">
      <div className="space-y-xs">
        <h2 className="font-headline-h2 text-2xl font-bold text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-ember-orange">auto_awesome</span>
          Benzer Kitaplar
        </h2>
        <p className="text-sm font-body-md text-on-surface-variant">Bu esere ilgi duyan okurlarımızın beğenebileceği diğer kitaplar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {similarBooksList.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            authorName={getAuthorName(book.authorId)}
            categoryName={getCategoryName(book.categoryId)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarBooks;
