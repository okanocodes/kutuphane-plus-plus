import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooks,
  addBook,
  deleteBook,
  updateBook,
  fetchAuthors,
  fetchCategories,
  fetchPublishers,
  addAuthor,
  addCategory,
  addPublisher
} from '../store/bookSlice';
import {
  fetchUsers,
  addUser,
  deleteUser,
  updateUser,
  fetchBorrowedBooks,
  borrowBook,
  returnBook,
  fetchPenalties
} from '../store/userSlice';
import {
  fetchReservations,
  updateReservationStatus,
  fetchStudyDesks,
  fetchMeetingRooms,
  fetchEvents
} from '../store/reservationSlice';
import { addToast } from '../store/uiSlice';
import { API_BASE_URL } from '../utils/api';
import Modal from '../components/Modal';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Import AG Grid CSS styles and Quartz theme
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Custom cell renderers for AG Grid
const BookActionCellRenderer = (params) => {
  if (!params.data) return null;
  const data = params.data;
  return (
    <div className="flex gap-xs items-center h-full">
      <button
        onClick={() => params.context.onEdit(data)}
        className="px-2.5 py-1 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Düzenle
      </button>
      <button
        onClick={() => params.context.onDelete(data.id)}
        className="px-2.5 py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Sil
      </button>
    </div>
  );
};

const UserActionCellRenderer = (params) => {
  if (!params.data) return null;
  const data = params.data;
  return (
    <div className="flex gap-xs items-center h-full">
      <button
        onClick={() => params.context.onEdit(data)}
        className="px-2.5 py-1 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Düzenle
      </button>
      <button
        onClick={() => params.context.onDelete(data.id)}
        className="px-2.5 py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Sil
      </button>
    </div>
  );
};

const ReservationActionCellRenderer = (params) => {
  if (!params.data) return null;
  const data = params.data;

  if (data.status === 'pending') {
    return (
      <div className="flex gap-xs items-center h-full">
        <button
          onClick={() => params.context.onApprove(data.id, data.bookId)}
          className="px-2.5 py-1 bg-success text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Onayla
        </button>
        <button
          onClick={() => params.context.onReject(data.id, data.bookId)}
          className="px-2.5 py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Reddet
        </button>
      </div>
    );
  }

  if (data.status === 'approved') {
    return (
      <div className="flex gap-xs items-center h-full">
        <button
          onClick={() => params.context.onReject(data.id, data.bookId)}
          className="px-2.5 py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          İptal Et
        </button>
      </div>
    );
  }

  return <span className="text-xs text-on-surface-variant">İşlem Yapılamaz</span>;
};

const LoanActionCellRenderer = (params) => {
  if (!params.data) return null;
  const data = params.data;
  return (
    <div className="flex gap-xs items-center h-full">
      <button
        onClick={() => params.context.onReturn(data.id, data.bookId)}
        className="px-2.5 py-1 bg-ember-orange text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        İade Al
      </button>
    </div>
  );
};

const EventActionCellRenderer = (params) => {
  if (!params.data) return null;
  const data = params.data;
  return (
    <div className="flex gap-xs items-center h-full">
      <button
        onClick={() => params.context.onEdit(data)}
        className="px-2.5 py-1 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Düzenle
      </button>
      <button
        onClick={() => params.context.onDelete(data.id)}
        className="px-2.5 py-1 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Sil
      </button>
    </div>
  );
};

// Helper function to compress image before uploading
const compressImage = (file, maxWidth = 400, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsImage = true;
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Reusable Searchable & Addable Select Dropdown
const SearchableAddSelect = ({ label, items, value, onChange, onAdd, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  const selectedItem = items.find(item => String(item.id) === String(value));

  const handleAddNew = async () => {
    if (search.trim()) {
      const addedItem = await onAdd(search.trim());
      if (addedItem) {
        onChange(addedItem.id);
        setSearch('');
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative space-y-1 text-left">
      <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg cursor-pointer flex justify-between items-center sm:text-sm"
      >
        <span>{selectedItem ? selectedItem.name : placeholder}</span>
        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl p-2 space-y-2 max-h-60 overflow-y-auto font-body-md">
          <input
            type="text"
            className="w-full px-2 py-1 bg-surface-container border border-outline text-on-surface rounded text-xs focus:outline-none"
            placeholder="Ara veya ekle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div className="space-y-1">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                className={`px-2 py-1.5 rounded text-xs cursor-pointer hover:bg-vivid-purple hover:text-white ${String(value) === String(item.id) ? 'bg-vivid-purple/20 text-tertiary-fixed font-bold' : 'text-on-surface'}`}
              >
                {item.name}
              </div>
            ))}
            {filtered.length === 0 && search.trim() && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNew();
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-ember-orange font-bold hover:bg-surface-container-highest rounded"
              >
                + "{search}" Yeni Ekle
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPage = () => {
  const dispatch = useDispatch();

  const { books, authors, categories, publishers } = useSelector((state) => state.books);
  const { users, borrowedBooks, penalties } = useSelector((state) => state.users);
  const { reservations, studyDesks, meetingRooms, events } = useSelector((state) => state.reservations);

  const [activeTab, setActiveTab] = useState('dashboard');

  // Search inputs
  const [bookSearch, setBookSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [reservationSearch, setReservationSearch] = useState('');
  const [loanSearch, setLoanSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');

  // Modals & Form states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  // Forms
  const [bookForm, setBookForm] = useState({ title: '', isbn: '', pages: '', authorId: '', categoryId: '', publisherId: '', status: 'available', coverUrl: '', publishYear: '', keywords: [], description: '' });
  const [userForm, setUserForm] = useState({ name: '', role: 'student' });
  const [spaceForm, setSpaceForm] = useState({ type: 'desk', name: '', capacity: 4 });
  const [loanForm, setLoanForm] = useState({ userId: '', bookId: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: '', capacity: 20 });

  // System Settings state
  const [settings, setSettings] = useState({ maxLoanDays: 15, maxBooks: 5 });

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUsers());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());
    dispatch(fetchReservations());
    dispatch(fetchBorrowedBooks());
    dispatch(fetchPenalties());
    dispatch(fetchStudyDesks());
    dispatch(fetchMeetingRooms());
    dispatch(fetchEvents());

    // Fetch global settings
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => { if (data) setSettings(data); });
  }, [dispatch]);

  useEffect(() => { document.title = 'Kütüphane++ — Yönetim Paneli'; }, []);

  // Helper functions
  const getBookTitle = (bookId) => books.find(b => String(b.id) === String(bookId))?.title || `Kitap #${bookId}`;
  const getUserName = (userId) => users.find(u => String(u.id) === String(userId))?.name || `Kullanıcı #${userId}`;
  const getAuthorName = (authorId) => authors.find(a => String(a.id) === String(authorId))?.name || `Yazar #${authorId}`;
  const getCategoryName = (categoryId) => categories.find(c => String(c.id) === String(categoryId))?.name || `Kategori #${categoryId}`;
  const getPublisherName = (publisherId) => publishers.find(p => String(p.id) === String(publisherId))?.name || `Yayınevi #${publisherId}`;

  // Statistics
  const totalBooks = books.length;
  const totalUsers = users.length;
  const activeLoans = borrowedBooks.filter(b => b.status === 'active' || b.status === 'overdue');
  const activeRes = reservations.filter(r => r.status === 'pending');
  const totalFines = penalties.reduce((sum, curr) => sum + curr.amount, 0);

  const deskOccupancy = Math.round((studyDesks.filter(d => d.status !== 'available').length / (studyDesks.length || 1)) * 100);
  const roomOccupancy = Math.round((meetingRooms.filter(r => r.status !== 'available').length / (meetingRooms.length || 1)) * 100);

  // Handlers for dynamic Author / Category / Publisher addition
  const handleAddAuthor = async (name) => {
    const action = await dispatch(addAuthor(name));
    if (addAuthor.fulfilled.match(action)) {
      dispatch(addToast({ message: 'Yeni yazar eklendi.', type: 'success' }));
      return action.payload;
    }
  };

  const handleAddCategory = async (name) => {
    const action = await dispatch(addCategory(name));
    if (addCategory.fulfilled.match(action)) {
      dispatch(addToast({ message: 'Yeni kategori eklendi.', type: 'success' }));
      return action.payload;
    }
  };

  const handleAddPublisher = async (name) => {
    const action = await dispatch(addPublisher(name));
    if (addPublisher.fulfilled.match(action)) {
      dispatch(addToast({ message: 'Yeni yayınevi eklendi.', type: 'success' }));
      return action.payload;
    }
  };

  const handleGenerateISBN = () => {
    // Generate a random 12-digit number starting with 978
    let isbn = '978';
    for (let i = 0; i < 9; i++) {
      isbn += Math.floor(Math.random() * 10);
    }

    // Calculate ISBN-13 checksum digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i]);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    const finalISBN = isbn + checksum;

    setBookForm(prev => ({ ...prev, isbn: finalISBN }));
    dispatch(addToast({ message: 'ISBN-13 başarıyla üretildi.', type: 'info' }));
  };

  // Submit handlers
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...bookForm,
      pages: Number(bookForm.pages),
      authorId: Number(bookForm.authorId),
      categoryId: Number(bookForm.categoryId),
      publisherId: Number(bookForm.publisherId),
      publishYear: bookForm.publishYear ? Number(bookForm.publishYear) : null,
      keywords: bookForm.keywords.length > 0 ? bookForm.keywords : undefined,
      description: bookForm.description || undefined,
    };

    if (editingItem) {
      const resultAction = await dispatch(updateBook({ id: editingItem.id, bookData: data }));
      if (updateBook.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Kitap güncellendi.', type: 'success' }));
        setIsBookModalOpen(false);
        setEditingItem(null);
      } else if (updateBook.rejected.match(resultAction)) {
        dispatch(addToast({ message: resultAction.payload || 'Kitap güncellenirken hata oluştu.', type: 'error' }));
      }
    } else {
      const resultAction = await dispatch(addBook(data));
      if (addBook.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Yeni kitap başarıyla eklendi.', type: 'success' }));
        setIsBookModalOpen(false);
        setEditingItem(null);
      } else if (addBook.rejected.match(resultAction)) {
        dispatch(addToast({ message: resultAction.payload || 'Kitap eklenirken hata oluştu.', type: 'error' }));
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const resultAction = await dispatch(updateUser({ id: editingItem.id, userData: userForm }));
      if (updateUser.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Kullanıcı güncellendi.', type: 'success' }));
      }
    } else {
      const resultAction = await dispatch(addUser(userForm));
      if (addUser.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Kullanıcı başarıyla eklendi.', type: 'success' }));
      }
    }
    setIsUserModalOpen(false);
    setEditingItem(null);
  };

  const handleSpaceSubmit = async (e) => {
    e.preventDefault();
    const endpoint = spaceForm.type === 'desk' ? 'studyDesks' : 'meetingRooms';
    const body = spaceForm.type === 'desk'
      ? { status: 'available' }
      : { name: spaceForm.name, capacity: Number(spaceForm.capacity), status: 'available', userId: null, date: null, timeSlot: null };

    await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    dispatch(addToast({ message: 'Çalışma alanı başarıyla tanımlandı.', type: 'success' }));
    setIsSpaceModalOpen(false);
    dispatch(fetchStudyDesks());
    dispatch(fetchMeetingRooms());
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      capacity: Number(eventForm.capacity),
      reservedSeats: editingItem ? editingItem.reservedSeats : 0,
      participants: editingItem ? editingItem.participants : []
    };

    if (editingItem) {
      await fetch(`${API_BASE_URL}/events/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      dispatch(addToast({ message: 'Etkinlik güncellendi.', type: 'success' }));
    } else {
      await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      dispatch(addToast({ message: 'Yeni etkinlik oluşturuldu.', type: 'success' }));
    }

    setIsEventModalOpen(false);
    setEditingItem(null);
    dispatch(fetchEvents());
  };

  const handleEventDelete = async (id) => {
    if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE'
      });
      dispatch(addToast({ message: 'Etkinlik silindi.', type: 'success' }));
      dispatch(fetchEvents());
    }
  };

  const handleStatusChange = async (id, newStatus, bookId) => {
    const resultAction = await dispatch(updateReservationStatus({ id, status: newStatus, bookId }));
    if (updateReservationStatus.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: `Rezervasyon durumu '${newStatus}' olarak güncellendi.`, type: 'success' }));
      dispatch(fetchReservations());
      dispatch(fetchBooks());
      dispatch(fetchBorrowedBooks());
    } else {
      dispatch(addToast({ message: 'Güncelleme başarısız.', type: 'error' }));
    }
  };

  const handleReturn = async (recordId, bookId) => {
    const resultAction = await dispatch(returnBook({ borrowedRecordId: recordId, bookId }));
    if (returnBook.fulfilled.match(resultAction)) {
      dispatch(addToast({ message: 'Kitap başarıyla iade alındı.', type: 'success' }));
      dispatch(fetchBorrowedBooks());
      dispatch(fetchBooks());
    } else {
      dispatch(addToast({ message: 'İade işlemi başarısız.', type: 'error' }));
    }
  };

  const handleIssueLoan = async (e) => {
    e.preventDefault();
    if (!loanForm.userId || !loanForm.bookId) {
      dispatch(addToast({ message: 'Lütfen kullanıcı ve kitap seçin.', type: 'warning' }));
      return;
    }
    const result = await dispatch(borrowBook({ userId: loanForm.userId, bookId: loanForm.bookId }));
    if (borrowBook.fulfilled.match(result)) {
      dispatch(addToast({ message: 'Kitap ödünç verildi.', type: 'success' }));
      setLoanForm({ userId: '', bookId: '' });
      dispatch(fetchBorrowedBooks());
      dispatch(fetchBooks());
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    dispatch(addToast({ message: 'Sistem limit ayarları kaydedildi.', type: 'success' }));
  };

  // AG Grid context bindings
  const bookContext = useMemo(() => ({
    onEdit: (book) => {
      setEditingItem(book);
      setBookForm({
        title: book.title,
        isbn: book.isbn,
        pages: book.pages,
        authorId: book.authorId || '',
        categoryId: book.categoryId || '',
        publisherId: book.publisherId || '',
        status: book.status || 'available',
        coverUrl: book.coverUrl || '',
        publishYear: book.publishYear !== undefined ? book.publishYear : '',
        keywords: book.keywords || [],
        description: book.description || ''
      });
      setIsBookModalOpen(true);
    },
    onDelete: async (id) => {
      if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
        await dispatch(deleteBook(id));
        dispatch(addToast({ message: 'Kitap silindi.', type: 'success' }));
      }
    }
  }), [dispatch]);

  const userContext = useMemo(() => ({
    onEdit: (u) => {
      setEditingItem(u);
      setUserForm({ name: u.name, role: u.role });
      setIsUserModalOpen(true);
    },
    onDelete: async (id) => {
      if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        await dispatch(deleteUser(id));
        dispatch(addToast({ message: 'Kullanıcı silindi.', type: 'success' }));
      }
    }
  }), [dispatch]);

  const reservationContext = useMemo(() => ({
    onApprove: (id, bookId) => handleStatusChange(id, 'approved', bookId),
    onReject: (id, bookId) => handleStatusChange(id, 'canceled', bookId)
  }), [dispatch]);

  const loanContext = useMemo(() => ({
    onReturn: (id, bookId) => handleReturn(id, bookId)
  }), [dispatch]);

  const eventContext = useMemo(() => ({
    onEdit: (ev) => {
      setEditingItem(ev);
      setEventForm({
        title: ev.title,
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        capacity: ev.capacity || 20
      });
      setIsEventModalOpen(true);
    },
    onDelete: (id) => handleEventDelete(id)
  }), [dispatch]);

  // Default Column Definitions for AG Grid
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1
  }), []);

  // Column definitions for AG Grid
  const bookColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, maxWidth: 100, flex: 0 },
    { field: 'title', headerName: 'Kitap Adı', minWidth: 200 },
    { field: 'isbn', headerName: 'ISBN', minWidth: 140 },
    {
      field: 'authorId', headerName: 'Yazar', minWidth: 150,
      valueGetter: (params) => params.data ? getAuthorName(params.data.authorId) : ''
    },
    {
      field: 'categoryId', headerName: 'Kategori', minWidth: 130,
      valueGetter: (params) => params.data ? getCategoryName(params.data.categoryId) : ''
    },
    {
      field: 'publisherId', headerName: 'Yayınevi', minWidth: 130,
      valueGetter: (params) => params.data ? getPublisherName(params.data.publisherId) : ''
    },
    {
      field: 'status', headerName: 'Durum', minWidth: 120,
      cellRenderer: (params) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${params.value === 'available' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {params.value === 'available' ? 'Müsait' : params.value === 'borrowed' ? 'Ödünçte' : params.value}
        </span>
      )
    },
    { headerName: 'İşlemler', minWidth: 170, cellRenderer: BookActionCellRenderer, sortable: false, filter: false }
  ], [authors, categories, publishers]);

  const userColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, maxWidth: 100, flex: 0 },
    { field: 'name', headerName: 'Kullanıcı Adı', minWidth: 200 },
    {
      field: 'role', headerName: 'Rol', minWidth: 140,
      cellRenderer: (params) => <span className="capitalize font-semibold text-accent-gold">{params.value}</span>
    },
    { headerName: 'İşlemler', minWidth: 170, cellRenderer: UserActionCellRenderer, sortable: false, filter: false }
  ], []);

  const reservationColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, maxWidth: 100, flex: 0 },
    {
      field: 'userId', headerName: 'Kullanıcı', minWidth: 180,
      valueGetter: (params) => params.data ? getUserName(params.data.userId) : ''
    },
    {
      field: 'bookId', headerName: 'Kitap', minWidth: 200,
      valueGetter: (params) => params.data ? getBookTitle(params.data.bookId) : ''
    },
    { field: 'date', headerName: 'Tarih', minWidth: 130 },
    {
      field: 'status', headerName: 'Durum', minWidth: 130,
      cellRenderer: (params) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${params.value === 'approved' ? 'bg-success/20 text-success' : 'bg-accent-gold/20 text-accent-gold'}`}>
          {params.value}
        </span>
      )
    },
    { headerName: 'İşlemler', minWidth: 185, cellRenderer: ReservationActionCellRenderer, sortable: false, filter: false }
  ], [users, books]);

  const activeBorrowedList = useMemo(() => {
    return borrowedBooks.filter(b => b.status !== 'returned');
  }, [borrowedBooks]);

  const loanColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, maxWidth: 100, flex: 0 },
    {
      field: 'userId', headerName: 'Kullanıcı', minWidth: 180,
      valueGetter: (params) => params.data ? getUserName(params.data.userId) : ''
    },
    {
      field: 'bookId', headerName: 'Kitap', minWidth: 200,
      valueGetter: (params) => params.data ? getBookTitle(params.data.bookId) : ''
    },
    { field: 'borrowDate', headerName: 'Ödünç Tarihi', minWidth: 130 },
    {
      field: 'status', headerName: 'Durum', minWidth: 130,
      cellRenderer: (params) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${params.value === 'overdue' ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
          {params.value}
        </span>
      )
    },
    { headerName: 'İşlemler', minWidth: 125, cellRenderer: LoanActionCellRenderer, sortable: false, filter: false }
  ], [users, books]);

  const eventColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 80, maxWidth: 100, flex: 0 },
    { field: 'title', headerName: 'Etkinlik Adı', minWidth: 200 },
    { field: 'date', headerName: 'Tarih', minWidth: 120 },
    { field: 'time', headerName: 'Saat', minWidth: 90 },
    { field: 'location', headerName: 'Konum', minWidth: 150 },
    {
      field: 'capacity', headerName: 'Kontenjan', minWidth: 120,
      valueGetter: (params) => params.data ? `${params.data.reservedSeats || 0} / ${params.data.capacity || 0}` : ''
    },
    { headerName: 'İşlemler', minWidth: 170, cellRenderer: EventActionCellRenderer, sortable: false, filter: false }
  ], []);

  return (
    <div className="space-y-lg text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="space-y-xs">
          <h1 className="font-display-lg text-primary text-3xl font-bold">Yönetici Kontrol Paneli</h1>
          <p className="font-body-md text-on-surface-variant">Sistem veritabanını, çalışma alanlarını, ödünç sistemini ve ayarları kontrol edin.</p>
        </div>

        <div className="flex gap-sm">
          {activeTab === 'books' && (
            <button onClick={() => { setEditingItem(null); setBookForm({ title: '', isbn: '', pages: '', authorId: '', categoryId: '', publisherId: '', status: 'available', coverUrl: '', publishYear: '', keywords: [], description: '' }); setIsBookModalOpen(true); }} className="px-md py-2 bg-ember-orange text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-glow-accent">+ Kitap</button>
          )}
          {activeTab === 'users' && (
            <button onClick={() => { setEditingItem(null); setUserForm({ name: '', role: 'student' }); setIsUserModalOpen(true); }} className="px-md py-2 bg-ember-orange text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-glow-accent">+ Kullanıcı</button>
          )}
          {activeTab === 'spaces' && (
            <button onClick={() => setIsSpaceModalOpen(true)} className="px-md py-2 bg-ember-orange text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-glow-accent">+ Alan Ekle</button>
          )}
          {activeTab === 'events' && (
            <button onClick={() => { setEditingItem(null); setEventForm({ title: '', date: '', time: '', location: '', capacity: 20 }); setIsEventModalOpen(true); }} className="px-md py-2 bg-ember-orange text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-glow-accent">+ Etkinlik</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant font-label-sm text-xs md:text-sm overflow-x-auto whitespace-nowrap scrollbar-none gap-xs pb-1">
        {[
          { id: 'dashboard', label: 'Genel Durum', icon: 'monitoring' },
          { id: 'books', label: 'Kitap Yönetimi', icon: 'library_books' },
          { id: 'users', label: 'Kullanıcı Yönetimi', icon: 'group' },
          { id: 'reservations', label: 'Rezervasyon Yönetimi', icon: 'approval' },
          { id: 'loans', label: 'Ödünç Yönetimi', icon: 'swap_horiz' },
          { id: 'events', label: 'Etkinlik Yönetimi', icon: 'event' },
          { id: 'spaces', label: 'Çalışma Alanları', icon: 'table_restaurant' },
          { id: 'settings', label: 'Sistem Ayarları', icon: 'settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-sm py-2 border-b-2 font-bold transition-all flex items-center gap-xs cursor-pointer ${activeTab === tab.id ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}

      {/* 1. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md">
            <div className="glass-card p-md rounded-xl border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-medium">Toplam Kitap</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">{totalBooks}</h3>
            </div>
            <div className="glass-card p-md rounded-xl border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-medium">Toplam Üye</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">{totalUsers}</h3>
            </div>
            <div className="glass-card p-md rounded-xl border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-medium">Aktif Ödünçte</p>
              <h3 className="text-2xl font-bold mt-1 text-ember-orange">{activeLoans.length}</h3>
            </div>
            <div className="glass-card p-md rounded-xl border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-medium">Bekleyen İstek</p>
              <h3 className="text-2xl font-bold mt-1 text-accent-gold">{activeRes.length}</h3>
            </div>
            <div className="glass-card p-md rounded-xl border border-outline-variant">
              <p className="text-xs text-on-surface-variant font-medium">Toplam Ceza</p>
              <h3 className="text-2xl font-bold mt-1 text-error">{totalFines} TL</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Occupancies */}
            <div className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
              <h3 className="text-base font-bold text-on-surface">Canlı Kütüphane Alan Dolulukları</h3>
              <div className="space-y-sm">
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Masa Doluluk Oranı</span>
                    <span>{deskOccupancy}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-1">
                    <div className="bg-ember-orange h-full rounded-full" style={{ width: `${deskOccupancy}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Toplantı Odaları Doluluk Oranı</span>
                    <span>{roomOccupancy}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-1">
                    <div className="bg-vivid-purple h-full rounded-full" style={{ width: `${roomOccupancy}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Chart */}
            <div className="glass-card p-lg rounded-xl border border-outline-variant flex flex-col justify-between">
              <h3 className="text-base font-bold text-on-surface">Ödünç Alma Kanalları Dağılımı</h3>
              <div className="flex items-center justify-around py-sm">
                <svg width="120" height="120" viewBox="0 0 40 40" className="transform -rotate-90">
                  <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#1f1f24" strokeWidth="6" />
                  <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#5B21B6" strokeWidth="6" strokeDasharray="60 40" strokeDashoffset="0" />
                  <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#FF5D3A" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="-60" />
                </svg>
                <div className="space-y-xs text-xs">
                  <div className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-vivid-purple rounded-full"></span> Dijital (PDF/Sesli) %60</div>
                  <div className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-ember-orange rounded-full"></span> Fiziksel %40</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Books Tab (AG Grid Table) */}
      {activeTab === 'books' && (
        <div className="space-y-sm">
          <div className="flex justify-between items-center font-body-md">
            <span className="text-xs text-on-surface-variant font-medium">Toplam {books.length} kayıt listeleniyor</span>
            <input
              type="text"
              placeholder="Tabloda hızlı ara..."
              className="px-3 py-1.5 bg-surface-container border border-outline text-on-surface rounded-lg text-xs focus:outline-none w-72"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
          </div>
          <div className="ag-theme-quartz ag-theme-quartz-dark ag-theme-custom w-full h-[480px]">
            <AgGridReact
              rowData={books}
              columnDefs={bookColDefs}
              defaultColDef={defaultColDef}
              context={bookContext}
              quickFilterText={bookSearch}
              pagination={true}
              paginationPageSize={10}
              rowHeight={48}
            />
          </div>
        </div>
      )}

      {/* 3. Users Tab (AG Grid Table) */}
      {activeTab === 'users' && (
        <div className="space-y-sm">
          <div className="flex justify-between items-center font-body-md">
            <span className="text-xs text-on-surface-variant font-medium">Toplam {users.length} üye listeleniyor</span>
            <input
              type="text"
              placeholder="Tabloda hızlı ara..."
              className="px-3 py-1.5 bg-surface-container border border-outline text-on-surface rounded-lg text-xs focus:outline-none w-72"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          <div className="ag-theme-quartz ag-theme-quartz-dark ag-theme-custom w-full h-[480px]">
            <AgGridReact
              rowData={users}
              columnDefs={userColDefs}
              defaultColDef={defaultColDef}
              context={userContext}
              quickFilterText={userSearch}
              pagination={true}
              paginationPageSize={10}
              rowHeight={48}
            />
          </div>
        </div>
      )}

      {/* 4. Reservations Tab (AG Grid Table) */}
      {activeTab === 'reservations' && (
        <div className="space-y-sm">
          <div className="flex justify-between items-center font-body-md">
            <span className="text-xs text-on-surface-variant font-medium">Toplam {reservations.length} talep listeleniyor</span>
            <input
              type="text"
              placeholder="Tabloda hızlı ara..."
              className="px-3 py-1.5 bg-surface-container border border-outline text-on-surface rounded-lg text-xs focus:outline-none w-72"
              value={reservationSearch}
              onChange={(e) => setReservationSearch(e.target.value)}
            />
          </div>
          <div className="ag-theme-quartz ag-theme-quartz-dark ag-theme-custom w-full h-[480px]">
            <AgGridReact
              rowData={reservations}
              columnDefs={reservationColDefs}
              defaultColDef={defaultColDef}
              context={reservationContext}
              quickFilterText={reservationSearch}
              pagination={true}
              paginationPageSize={10}
              rowHeight={48}
            />
          </div>
        </div>
      )}

      {/* 5. Loans Tab (Borrow / Return System) */}
      {activeTab === 'loans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="glass-card p-lg rounded-xl border border-outline-variant space-y-md">
            <h3 className="text-base font-bold text-on-surface border-l-4 border-ember-orange pl-xs font-body-md">Kitap Ödünç Ver</h3>
            <form onSubmit={handleIssueLoan} className="space-y-md">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Üye Seçin</label>
                <select
                  required
                  value={loanForm.userId}
                  onChange={(e) => setLoanForm({ ...loanForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg text-sm focus:outline-none"
                >
                  <option value="">Seçiniz</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kitap Seçin (Müsait Olanlar)</label>
                <select
                  required
                  value={loanForm.bookId}
                  onChange={(e) => setLoanForm({ ...loanForm, bookId: e.target.value })}
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg text-sm focus:outline-none"
                >
                  <option value="">Seçiniz</option>
                  {books.filter(b => b.status === 'available').map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full py-2 bg-ember-orange text-white text-sm font-bold rounded-lg shadow-md cursor-pointer">Kitabı Ödünç Ver</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-sm">
            <div className="flex justify-between items-center font-body-md">
              <span className="text-xs text-on-surface-variant font-medium">Toplam {activeBorrowedList.length} aktif kayıt</span>
              <input
                type="text"
                placeholder="Tabloda hızlı ara..."
                className="px-3 py-1.5 bg-surface-container border border-outline text-on-surface rounded-lg text-xs focus:outline-none w-72"
                value={loanSearch}
                onChange={(e) => setLoanSearch(e.target.value)}
              />
            </div>
            <div className="ag-theme-quartz ag-theme-quartz-dark ag-theme-custom h-[400px]">
              <AgGridReact
                rowData={activeBorrowedList}
                columnDefs={loanColDefs}
                defaultColDef={defaultColDef}
                context={loanContext}
                quickFilterText={loanSearch}
                pagination={true}
                paginationPageSize={10}
                rowHeight={48}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5.5. Events Tab (AG Grid Table) */}
      {activeTab === 'events' && (
        <div className="space-y-sm">
          <div className="flex justify-between items-center font-body-md">
            <span className="text-xs text-on-surface-variant font-medium">Toplam {events.length} etkinlik listeleniyor</span>
            <input
              type="text"
              placeholder="Tabloda hızlı ara..."
              className="px-3 py-1.5 bg-surface-container border border-outline text-on-surface rounded-lg text-xs focus:outline-none w-72"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
            />
          </div>
          <div className="ag-theme-quartz ag-theme-quartz-dark ag-theme-custom w-full h-[480px]">
            <AgGridReact
              rowData={events}
              columnDefs={eventColDefs}
              defaultColDef={defaultColDef}
              context={eventContext}
              quickFilterText={eventSearch}
              pagination={true}
              paginationPageSize={10}
              rowHeight={48}
            />
          </div>
        </div>
      )}

      {/* 6. Spaces Tab */}
      {activeTab === 'spaces' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg font-body-md">
          <div className="space-y-md">
            <h3 className="text-base font-bold text-on-surface border-l-4 border-ember-orange pl-xs">Masa Listesi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
              {studyDesks.map(desk => (
                <div key={desk.id} className="bg-surface-container p-md rounded-xl border border-outline-variant flex flex-col justify-between items-center text-center">
                  <span className="font-metadata-mono text-xs text-on-surface-variant">Desk #{desk.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-1 ${desk.status === 'available' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>{desk.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-md">
            <h3 className="text-base font-bold text-on-surface border-l-4 border-ember-orange pl-xs">Toplantı Odaları</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {meetingRooms.map(room => (
                <div key={room.id} className="bg-surface-container p-md rounded-xl border border-outline-variant flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-on-surface">{room.name}</h4>
                    <p className="text-xs text-on-surface-variant">{room.capacity} Kişilik</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${room.status === 'available' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>{room.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-card p-lg rounded-xl border border-outline-variant max-w-2xl font-body-md">
          <h3 className="text-base font-bold text-on-surface border-l-4 border-ember-orange pl-xs mb-md">Sistem Limit Ayarları</h3>
          <form onSubmit={handleSettingsSave} className="space-y-md text-sm">
            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Maksimum Ödünç Süresi (Gün)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                  value={settings.maxLoanDays}
                  onChange={(e) => setSettings({ ...settings, maxLoanDays: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Maksimum Kitap Limeti</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                  value={settings.maxBooks}
                  onChange={(e) => setSettings({ ...settings, maxBooks: Number(e.target.value) })}
                />
              </div>
            </div>

            <button type="submit" className="px-lg py-2.5 bg-ember-orange text-white rounded-lg font-bold text-sm cursor-pointer">Ayarları Kaydet</button>
          </form>
        </div>
      )}

      {/* Book Form Modal with Searchable & Addable selects */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={editingItem ? 'Kitap Güncelle' : 'Yeni Kitap Ekle'}
      >
        <form onSubmit={handleBookSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kitap Adı</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">ISBN</label>
            <div className="flex gap-sm">
              <input
                type="text"
                required
                className="flex-1 px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
              />
              <button
                type="button"
                onClick={handleGenerateISBN}
                className="px-md py-2 border border-outline hover:bg-surface-container-high transition-all text-xs font-bold text-on-surface rounded-lg cursor-pointer flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-sm">autorenew</span>
                Üret
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-sm font-body-md">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Sayfa</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={bookForm.pages}
                onChange={(e) => setBookForm({ ...bookForm, pages: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Yayın Yılı</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={bookForm.publishYear}
                onChange={(e) => setBookForm({ ...bookForm, publishYear: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Durum</label>
              <select
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={bookForm.status}
                onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
              >
                <option value="available">Müsait</option>
                <option value="borrowed">Ödünçte</option>
                <option value="reserved">Rezerve</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kitap Kapağı (Resim)</label>
            <div className="flex gap-sm items-center mb-1">
              <label className="flex items-center gap-xs cursor-pointer px-3 py-1.5 border border-outline hover:bg-surface-container-high transition-all text-xs font-bold rounded-lg text-on-surface">
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                Dosyadan Yükle
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const compressedImage = await compressImage(file, 400, 600, 0.7);
                        setBookForm({ ...bookForm, coverUrl: compressedImage });
                        dispatch(addToast({ message: 'Resim sıkıştırılarak yüklendi.', type: 'info' }));
                      } catch {
                        dispatch(addToast({ message: 'Resim yüklenirken hata oluştu.', type: 'error' }));
                      }
                    }
                  }}
                />
              </label>
              <span className="text-xs text-on-surface-variant">veya URL adresi girin:</span>
            </div>
            <input
              type="text"
              placeholder="https://resim-adresi.com/kapak.jpg"
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
              value={bookForm.coverUrl || ''}
              onChange={(e) => setBookForm({ ...bookForm, coverUrl: e.target.value })}
            />
            {bookForm.coverUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={bookForm.coverUrl}
                  alt="Önizleme"
                  className="max-h-24 object-contain rounded-lg border border-outline-variant"
                />
              </div>
            )}
          </div>

          {/* Custom Searchable Selects */}
          <SearchableAddSelect
            label="Yazar"
            items={authors}
            value={bookForm.authorId}
            onChange={(id) => setBookForm({ ...bookForm, authorId: id })}
            onAdd={handleAddAuthor}
            placeholder="Yazar Seçiniz"
          />

          <SearchableAddSelect
            label="Kategori"
            items={categories}
            value={bookForm.categoryId}
            onChange={(id) => setBookForm({ ...bookForm, categoryId: id })}
            onAdd={handleAddCategory}
            placeholder="Kategori Seçiniz"
          />

          <SearchableAddSelect
            label="Yayınevi"
            items={publishers}
            value={bookForm.publisherId}
            onChange={(id) => setBookForm({ ...bookForm, publisherId: id })}
            onAdd={handleAddPublisher}
            placeholder="Yayınevi Seçiniz"
          />

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kitap Özeti (İsteğe Bağlı)</label>
            <textarea
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md resize-none"
              rows="4"
              placeholder="Kitabın kısa özeti yazınız..."
              value={bookForm.description}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Anahtar Kelimeler (İsteğe Bağlı)</label>
            <div className="space-y-2">
              <div className="flex gap-sm">
                <input
                  type="text"
                  placeholder="Yeni anahtar kelime yazıp Enter'e basınız..."
                  className="flex-1 px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      e.preventDefault();
                      const keyword = e.target.value.trim();
                      if (!bookForm.keywords.includes(keyword)) {
                        setBookForm({ ...bookForm, keywords: [...bookForm.keywords, keyword] });
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              {bookForm.keywords.length > 0 && (
                <div className="flex flex-wrap gap-xs">
                  {bookForm.keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="flex items-center gap-xs bg-vivid-purple/20 text-tertiary-fixed text-xs px-2.5 py-1 rounded-full border border-vivid-purple/50 font-semibold"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setBookForm({
                            ...bookForm,
                            keywords: bookForm.keywords.filter((k) => k !== keyword),
                          })
                        }
                        className="ml-xs cursor-pointer hover:text-error transition-colors text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-sm flex justify-end gap-sm font-body-md">
            <button type="button" onClick={() => setIsBookModalOpen(false)} className="px-md py-2 border border-outline rounded-lg text-on-surface hover:bg-surface-container-high transition-all cursor-pointer">İptal</button>
            <button type="submit" className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold cursor-pointer">Kaydet</button>
          </div>
        </form>
      </Modal>

      {/* User Form Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingItem ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle'}
      >
        <form onSubmit={handleUserSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kullanıcı Adı</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Rol</label>
            <select
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            >
              <option value="student">Öğrenci</option>
              <option value="academic">Akademisyen</option>
              <option value="librarian">Kütüphaneci</option>
              <option value="admin">Yönetici</option>
            </select>
          </div>
          <div className="pt-sm flex justify-end gap-sm font-body-md">
            <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-md py-2 border border-outline rounded-lg text-on-surface hover:bg-surface-container-high transition-all cursor-pointer">İptal</button>
            <button type="submit" className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold cursor-pointer">Kaydet</button>
          </div>
        </form>
      </Modal>

      {/* Space Modal */}
      <Modal
        isOpen={isSpaceModalOpen}
        onClose={() => setIsSpaceModalOpen(false)}
        title="Yeni Çalışma Alanı Ekle"
      >
        <form onSubmit={handleSpaceSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Alan Türü</label>
            <select
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
              value={spaceForm.type}
              onChange={(e) => setSpaceForm({ ...spaceForm, type: e.target.value })}
            >
              <option value="desk">Masa</option>
              <option value="room">Toplantı Odası</option>
            </select>
          </div>
          {spaceForm.type === 'room' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Oda Adı</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg"
                  value={spaceForm.name}
                  onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Kapasite</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg"
                  value={spaceForm.capacity}
                  onChange={(e) => setSpaceForm({ ...spaceForm, capacity: e.target.value })}
                />
              </div>
            </>
          )}
          <div className="pt-sm flex justify-end gap-sm font-body-md">
            <button type="button" onClick={() => setIsSpaceModalOpen(false)} className="px-md py-2 border border-outline rounded-lg hover:bg-surface-container-high transition-all cursor-pointer">İptal</button>
            <button type="submit" className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold cursor-pointer">Alan Ekle</button>
          </div>
        </form>
      </Modal>

      {/* Event Form Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={editingItem ? 'Etkinlik Güncelle' : 'Etkinlik Ekle'}
      >
        <form onSubmit={handleEventSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Etkinlik Adı</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none font-body-md"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Tarih</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Saat</label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Konum</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase">Maksimum Kontenjan</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
              value={eventForm.capacity}
              onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
            />
          </div>
          <div className="pt-sm flex justify-end gap-sm font-body-md">
            <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-md py-2 border border-outline rounded-lg hover:bg-surface-container-high transition-all cursor-pointer">İptal</button>
            <button type="submit" className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold cursor-pointer">Kaydet</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;