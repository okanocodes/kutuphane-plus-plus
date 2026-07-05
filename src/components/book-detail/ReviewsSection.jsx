import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, addReview } from '../../store/favoriteSlice';
import { addToast } from '../../store/uiSlice';

export const ReviewsSection = ({ bookId, user, isAuthenticated }) => {
  const dispatch = useDispatch();
  const { reviews, reviewsStatus } = useSelector((state) => state.favorites);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bookId) {
      dispatch(fetchReviews(bookId));
    }
  }, [dispatch, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(addToast({ message: 'Yorum yapmak için giriş yapmalısınız.', type: 'warning' }));
      return;
    }
    if (!comment.trim()) {
      dispatch(addToast({ message: 'Lütfen bir yorum yazın.', type: 'warning' }));
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        bookId,
        userId: user.id,
        userName: user.name || 'Bilinmeyen Kullanıcı',
        rating,
        comment: comment.trim(),
      };
      const result = await dispatch(addReview(reviewData));
      if (addReview.fulfilled.match(result)) {
        dispatch(addToast({ message: 'Yorumunuz başarıyla eklendi.', type: 'success' }));
        setComment('');
        setRating(5);
        // Refresh reviews list
        dispatch(fetchReviews(bookId));
      } else {
        dispatch(addToast({ message: 'Yorum eklenirken hata oluştu.', type: 'error' }));
      }
    } catch {
      dispatch(addToast({ message: 'İşlem başarısız.', type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const renderStars = (score, clickable = false, size = 'sm') => {
    const stars = [];
    const sizeClass = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={clickable ? () => setRating(i) : undefined}
          className={`material-symbols-outlined cursor-pointer select-none transition-colors ${
            i <= score ? 'text-accent-gold font-bold' : 'text-outline-variant'
          } ${sizeClass}`}
        >
          {i <= score ? 'star' : 'star_border'}
        </span>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div className="space-y-xl py-lg">
      <h2 className="font-headline-h2 text-2xl font-bold border-l-4 border-ember-orange pl-md text-on-surface">
        Değerlendirmeler & Yorumlar
      </h2>

      {/* Statistics & Breakdown Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg bg-surface-container-low p-md rounded-2xl border border-outline-variant">
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-md border-b md:border-b-0 md:border-r border-outline-variant/30">
          <span className="font-metadata-mono text-5xl font-bold text-on-surface leading-none">{averageRating}</span>
          {renderStars(Math.round(parseFloat(averageRating)), false, 'lg')}
          <span className="text-xs text-on-surface-variant mt-sm font-semibold">
            {totalReviews} Yorum / Puanlama
          </span>
        </div>

        <div className="md:col-span-8 flex flex-col justify-center gap-xs">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-sm text-sm">
                <span className="w-3 text-on-surface-variant font-metadata-mono text-right">{stars}</span>
                <span className="material-symbols-outlined text-accent-gold text-xs">star</span>
                <div className="flex-grow h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-gold transition-all duration-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-8 text-on-surface-variant font-metadata-mono text-left">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="glass-card p-md rounded-2xl border border-outline-variant space-y-md">
        <h3 className="font-headline-h3 text-base font-bold text-on-surface">Bu Kitaba Puan Ver ve Yorum Yap</h3>
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="flex items-center gap-md">
              <span className="text-sm font-medium text-on-surface-variant">Puanınız:</span>
              {renderStars(rating, true, 'lg')}
            </div>

            <div className="space-y-xs">
              <textarea
                placeholder="Kitap hakkındaki düşüncelerinizi, eleştirilerinizi veya yorumlarınızı buraya yazın..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-xl p-md text-sm outline-none focus:ring-2 focus:ring-vivid-purple placeholder-on-surface-variant resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-xl py-2 bg-ember-orange hover:bg-ember-orange/95 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center gap-sm disabled:opacity-50 cursor-pointer text-sm"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Yorum Gönder
            </button>
          </form>
        ) : (
          <div className="bg-surface-container/50 p-md rounded-xl text-center border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant mb-md">Yorum yapmak ve puan vermek için üye girişi yapmalısınız.</p>
            <a
              href="/login"
              className="inline-block px-md py-2 bg-vivid-purple hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              Giriş Yap
            </a>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div className="space-y-md">
        <h3 className="font-headline-h3 text-base font-bold text-on-surface">Kullanıcı Yorumları ({totalReviews})</h3>
        {reviewsStatus === 'loading' ? (
          <p className="text-sm text-on-surface-variant">Yorumlar yükleniyor...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">Bu kitap için henüz yorum yapılmamış. İlk yorum yapan siz olun!</p>
        ) : (
          <div className="flex flex-col gap-sm">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-surface-container-low border border-outline-variant p-md rounded-xl space-y-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-on-surface">{rev.userName || `Kullanıcı #${rev.userId}`}</span>
                  {renderStars(rev.rating)}
                </div>
                <p className="text-xs text-on-surface-variant font-metadata-mono">K++ Okuyucu</p>
                <p className="text-sm text-on-surface leading-relaxed pt-xs">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
