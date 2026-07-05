export const QRGenerator = ({ book, isOpen, onClose }) => {
  if (!isOpen || !book) return null;

  const qrData = JSON.stringify({
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    shelf: "Kat 2 - Salon A - Raf 14B",
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 w-screen h-screen top-0 left-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-md">
      <div className="bg-surface-container border border-outline-variant rounded-2xl w-[90%] sm:w-[360px] p-lg relative shadow-2xl text-center space-y-md shrink-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-on-surface-variant hover:text-ember-orange transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="space-y-xs">
          <h3 className="font-headline-h3 text-xl font-bold text-on-surface">Kitap QR Kodu</h3>
          <p className="font-body-md text-xs text-on-surface-variant">Kütüphanede kitabı teslim almak veya raf konumunu doğrulamak için görevliye gösterin.</p>
        </div>

        <div className="w-[180px] h-[180px] bg-white rounded-xl p-2 mx-auto border border-outline-variant/30 shadow-inner flex items-center justify-center">
          <img src={qrImageUrl} alt="Kitap QR Kodu" className="w-[164px] h-[164px] block" />
        </div>

        <div className="bg-surface-container-high border border-outline-variant/30 p-sm rounded-xl space-y-xs text-left">
          <p className="text-xs text-on-surface-variant font-medium">
            Kitap Adı: <span className="text-on-surface font-semibold">{book.title}</span>
          </p>
          <p className="text-xs text-on-surface-variant font-medium">
            ISBN: <span className="font-metadata-mono text-on-surface font-semibold">{book.isbn}</span>
          </p>
          <p className="text-xs text-on-surface-variant font-medium">
            Raf Konumu: <span className="text-on-surface font-semibold">Kat 2 - Salon A - Raf 14B</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-vivid-purple hover:bg-vivid-purple/90 text-white rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
