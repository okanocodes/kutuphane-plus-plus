import { useState } from 'react';

export const PDFPreviewModal = ({ isOpen, onClose, book }) => {
  const [pageNum, setPageNum] = useState(1);
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !book) return null;

  const previewUrl = book.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-sm sm:p-md">
      <div className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* PDF Header controls */}
        <div className="bg-surface-container-high border-b border-outline-variant px-md py-sm flex flex-col sm:flex-row justify-between items-center gap-xs">
          <div className="flex items-center gap-xs text-left w-full sm:w-auto">
            <span className="material-symbols-outlined text-ember-orange">picture_as_pdf</span>
            <div className="truncate max-w-[200px] sm:max-w-md">
              <h3 className="font-headline-h3 text-sm font-bold text-on-surface truncate">{book.title} (Önizleme)</h3>
              <p className="text-[10px] text-on-surface-variant font-medium">Dijital Sürüm Önizleme - İlk 10 Sayfa</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-md w-full sm:w-auto">
            {/* Page navigation */}
            <div className="flex items-center gap-xs">
              <button
                onClick={() => setPageNum(p => Math.max(1, p - 1))}
                disabled={pageNum === 1}
                className="p-1 rounded hover:bg-surface-container-highest text-on-surface disabled:opacity-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">navigate_before</span>
              </button>
              <span className="font-metadata-mono text-xs text-on-surface whitespace-nowrap">
                Sayfa {pageNum} / 10
              </span>
              <button
                onClick={() => setPageNum(p => Math.min(10, p + 1))}
                disabled={pageNum === 10}
                className="p-1 rounded hover:bg-surface-container-highest text-on-surface disabled:opacity-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">navigate_next</span>
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-xs border-l border-outline-variant pl-md">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                className="p-1 rounded hover:bg-surface-container-highest text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">zoom_out</span>
              </button>
              <span className="font-metadata-mono text-xs text-on-surface min-w-[36px] text-center">
                %{zoom}
              </span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                className="p-1 rounded hover:bg-surface-container-highest text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">zoom_in</span>
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-error/20 hover:text-error text-on-surface-variant transition-all cursor-pointer border-l border-outline-variant pl-md sm:border-none sm:pl-0"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* PDF Reader Content */}
        <div className="flex-1 bg-surface-container-lowest overflow-auto p-md flex justify-center items-start">
          <div
            className="bg-white text-black shadow-lg rounded border border-outline-variant/30 flex flex-col justify-between p-lg relative transition-all duration-200"
            style={{
              width: `${600 * (zoom / 100)}px`,
              minHeight: `${800 * (zoom / 100)}px`,
            }}
          >
            {/* Mocking PDF pages gracefully */}
            <div className="space-y-md text-left">
              <div className="border-b border-black/10 pb-xs flex justify-between text-[10px] text-black/50">
                <span>{book.title} - {book.isbn}</span>
                <span>Bölüm {Math.ceil(pageNum / 2)}</span>
              </div>
              <h2 className="text-xl font-bold text-black border-l-4 border-ember-orange pl-xs uppercase">
                {book.title}
              </h2>
              <p className="text-xs leading-relaxed text-black/80 font-serif pt-sm">
                Sayfa {pageNum} içeriği yükleniyor. Bu dijital yayın, kütüphanemiz telif anlaşması çerçevesinde ilk 10 sayfalık sınırlı önizlemeye açılmıştır. Eserin tamamını okumak için kütüphanemizden basılı nüshasını talep edebilir veya dijital üye iseniz tam sürümünü indirebilirsiniz.
              </p>
              <p className="text-xs leading-relaxed text-black/80 font-serif">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien egestas finibus. Proin vulputate facilisis imperdiet. Duis tempor tellus et tortor convallis eleifend. Integer tincidunt interdum felis, in congue turpis dictum vel. Maecenas nec risus rhoncus, feugiat ipsum ac, gravida lectus.
              </p>
              <p className="text-xs leading-relaxed text-black/80 font-serif">
                Aenean efficitur at eros non congue. Morbi feugiat leo ut elementum iaculis. Quisque elementum nisl a sem interdum, at auctor mi interdum. Ut convallis erat at lorem condimentum cursus. Suspendisse pulvinar erat a massa cursus imperdiet. Sed viverra imperdiet ex in tempus. Ut vel feugiat elit, at sodales ligula.
              </p>
            </div>

            <div className="border-t border-black/10 pt-xs flex justify-between text-[10px] text-black/50 mt-xl">
              <span>Dijital Kütüphane K++</span>
              <span>Sayfa {pageNum} / 10</span>
            </div>
          </div>
        </div>

        {/* Mock PDF Iframe loader option */}
        <div className="bg-surface-container-high border-t border-outline-variant px-md py-xs text-center flex justify-between items-center text-xs text-on-surface-variant font-medium">
          <span>Telif hakları kütüphanemize aittir.</span>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ember-orange hover:underline flex items-center gap-xs font-semibold"
          >
            <span className="material-symbols-outlined text-xs">open_in_new</span>
            PDF Belgesini Aç
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
