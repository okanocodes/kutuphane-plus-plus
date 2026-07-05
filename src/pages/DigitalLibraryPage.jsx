import { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchAuthors, fetchCategories } from '../store/bookSlice';
import PDFPreviewModal from '../components/book-detail/PDFPreviewModal';
import { addToast } from '../store/uiSlice';

export const DigitalLibraryPage = () => {
  const dispatch = useDispatch();
  const { books, authors, categories } = useSelector((state) => state.books);

  const [digitalTab, setDigitalTab] = useState('all'); // 'all' | 'ebook' | 'audio'
  const [selectedBookForPreview, setSelectedBookForPreview] = useState(null);

  // Audio Player states
  const [activeAudioBook, setActiveAudioBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter digital resources
  const digitalBooks = useMemo(() => {
    return books.filter((b) => {
      const isDigital = b.format === 'pdf' || b.format === 'epub' || b.format === 'audio';
      if (!isDigital) return false;

      if (digitalTab === 'ebook') return b.format === 'pdf' || b.format === 'epub';
      if (digitalTab === 'audio') return b.format === 'audio';
      return true;
    });
  }, [books, digitalTab]);

  const getAuthorName = (authorId) => {
    return authors.find((a) => String(a.id) === String(authorId))?.name || 'Yazar Bilinmiyor';
  };

  const getCategoryName = (categoryId) => {
    return categories.find((c) => String(c.id) === String(categoryId))?.name || 'Kategori Bilinmiyor';
  };

  // Audio actions
  const playAudio = (book) => {
    if (activeAudioBook?.id === book.id) {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          dispatch(addToast({ message: 'Ses oynatımı başlatılamadı.', type: 'error' }));
        });
      }
    } else {
      // Start playing new book
      setActiveAudioBook(book);
      setIsPlaying(false);
      dispatch(addToast({ message: `"${book.title}" sesli kitabı oynatılıyor...`, type: 'info' }));
      
      // We will let the useEffect handle loading of the src
    }
  };

  useEffect(() => {
    if (activeAudioBook && audioRef.current) {
      audioRef.current.src = activeAudioBook.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error(e);
        dispatch(addToast({ message: 'Ses dosyası yüklenemedi.', type: 'error' }));
      });
    }
  }, [activeAudioBook, dispatch]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeekChange = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-xl pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="space-y-xs text-left">
          <h1 className="font-display-lg text-primary text-3xl font-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-ember-orange">auto_stories</span>
            Dijital Kütüphane
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Her an, her yerde erişebileceğiniz sesli kitaplar, e-kitaplar ve akademik dokümanlar.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-surface-container border border-outline-variant p-1 rounded-xl w-fit self-start md:self-auto">
          <button
            onClick={() => setDigitalTab('all')}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              digitalTab === 'all' ? 'bg-vivid-purple text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tüm Kaynaklar
          </button>
          <button
            onClick={() => setDigitalTab('ebook')}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              digitalTab === 'ebook' ? 'bg-vivid-purple text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            E-Kitaplar
          </button>
          <button
            onClick={() => setDigitalTab('audio')}
            className={`px-md py-1.5 rounded-lg text-xs font-bold font-label-sm transition-all cursor-pointer ${
              digitalTab === 'audio' ? 'bg-vivid-purple text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sesli Kitaplar
          </button>
        </div>
      </div>

      {/* Resource Grid */}
      {digitalBooks.length === 0 ? (
        <div className="glass-card p-xl rounded-xl border border-outline-variant text-center space-y-md">
          <span className="material-symbols-outlined text-outline text-5xl">folder_off</span>
          <p className="font-body-md text-on-surface-variant">Bu kategoride dijital kaynak bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {digitalBooks.map((book) => {
            const isThisPlaying = activeAudioBook?.id === book.id && isPlaying;
            return (
              <div
                key={book.id}
                className="glass-card rounded-xl border border-outline-variant p-md flex flex-col justify-between hover:border-vivid-purple transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual Glow on Playing */}
                {isThisPlaying && (
                  <div className="absolute inset-0 bg-vivid-purple/5 animate-pulse pointer-events-none"></div>
                )}

                <div className="space-y-sm text-left">
                  {/* Format Badge Indicator */}
                  <div className="flex justify-between items-start">
                    <span className="font-label-xs text-xs text-vivid-purple uppercase font-bold tracking-wider">
                      {getCategoryName(book.categoryId)}
                    </span>
                    <span className="flex items-center gap-xs text-[10px] font-bold text-on-surface-variant uppercase px-2 py-0.5 bg-surface-container rounded-full border border-outline-variant/30">
                      <span className="material-symbols-outlined text-xs">
                        {book.format === 'audio' ? 'headphones' : 'menu_book'}
                      </span>
                      {book.format === 'audio' ? 'Sesli' : book.format.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-headline-h3 text-base font-bold text-on-surface line-clamp-1">{book.title}</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">{getAuthorName(book.authorId)}</p>
                  <p className="text-xs text-on-surface-variant/90 line-clamp-2 leading-relaxed pt-xs">
                    {book.description || 'Dijital sürümü hemen erişilebilir durumdadır.'}
                  </p>
                </div>

                <div className="mt-md pt-sm border-t border-outline-variant flex items-center justify-between">
                  <span className="font-metadata-mono text-label-xs text-on-surface-variant">
                    {book.format === 'audio' ? 'Ses Dosyası' : `${book.pages} Sayfa`}
                  </span>

                  {book.format === 'audio' ? (
                    <button
                      onClick={() => playAudio(book)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-xs cursor-pointer ${
                        activeAudioBook?.id === book.id
                          ? 'bg-ember-orange text-white'
                          : 'bg-vivid-purple text-white hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isThisPlaying ? 'pause' : 'play_arrow'}
                      </span>
                      {isThisPlaying ? 'Durdur' : 'Dinle'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedBookForPreview(book)}
                      className="px-4 py-1.5 bg-vivid-purple hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Oku
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Premium Audio Player */}
      {activeAudioBook && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 border-t border-outline-variant p-md shadow-2xl backdrop-blur-md animate-slide-up flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto rounded-t-2xl border-x">
          <div className="flex items-center gap-md text-left w-full md:w-1/3">
            <div className="w-10 h-10 bg-vivid-purple rounded-lg flex items-center justify-center relative shrink-0">
              <span className="material-symbols-outlined text-white text-lg">headphones</span>
              {/* Sound waves graphic animation */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
                  <div className="w-[3px] h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="w-[3px] h-5 bg-white rounded-full animate-pulse delay-75"></div>
                  <div className="w-[3px] h-2 bg-white rounded-full animate-pulse delay-150"></div>
                </div>
              )}
            </div>
            <div className="truncate">
              <p className="font-semibold text-sm text-on-surface truncate">{activeAudioBook.title}</p>
              <p className="text-xs text-on-surface-variant truncate">{getAuthorName(activeAudioBook.authorId)}</p>
            </div>
          </div>

          {/* Central Controls */}
          <div className="flex flex-col items-center gap-xs w-full md:w-1/3 py-sm md:py-0">
            <div className="flex items-center gap-md">
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime -= 10;
                }}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                title="-10 Saniye"
              >
                <span className="material-symbols-outlined">replay_10</span>
              </button>

              <button
                onClick={() => playAudio(activeAudioBook)}
                className="w-10 h-10 bg-ember-orange text-white rounded-full flex items-center justify-center hover:shadow-[0_0_10px_rgba(255,93,58,0.4)] transition-all active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime += 10;
                }}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                title="+10 Saniye"
              >
                <span className="material-symbols-outlined">forward_10</span>
              </button>
            </div>

            {/* Slider bar & timings */}
            <div className="flex items-center gap-sm w-full">
              <span className="font-metadata-mono text-[10px] text-on-surface-variant w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="flex-grow h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-ember-orange focus:outline-none"
              />
              <span className="font-metadata-mono text-[10px] text-on-surface-variant w-10 text-left">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end gap-xs w-full md:w-1/3">
            <span className="material-symbols-outlined text-on-surface-variant text-base">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-vivid-purple focus:outline-none"
            />
            
            {/* Close Audio Player Button */}
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
                setActiveAudioBook(null);
              }}
              className="ml-md text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Preview Modal for PDF E-Books */}
      <PDFPreviewModal
        book={selectedBookForPreview}
        isOpen={!!selectedBookForPreview}
        onClose={() => setSelectedBookForPreview(null)}
      />
    </div>
  );
};

export default DigitalLibraryPage;
