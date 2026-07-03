import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, addBook, deleteBook, updateBook, fetchAuthors, fetchCategories } from '../store/bookSlice';
import { fetchUsers, addUser, deleteUser, updateUser } from '../store/userSlice';
import { addToast } from '../store/uiSlice';
import { AgGridReact } from 'ag-grid-react';
import Modal from '../components/Modal';

// Import AG Grid core CSS styles
import 'ag-grid-community/styles/ag-grid.css';

// Action cell renderer inside the AG Grid table
const ActionCellRenderer = (params) => {
  const data = params.data;
  return (
    <div className="flex gap-xs items-center h-full">
      <button 
        onClick={() => params.context.onEdit(data)} 
        className="px-2 py-0.5 bg-vivid-purple text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all"
      >
        Düzenle
      </button>
      <button 
        onClick={() => params.context.onDelete(data.id)} 
        className="px-2 py-0.5 bg-error text-white text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-all"
      >
        Sil
      </button>
    </div>
  );
};

export const AdminPage = () => {
  const dispatch = useDispatch();
  
  const { books, authors, categories } = useSelector((state) => state.books);
  const { users } = useSelector((state) => state.users);

  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'users'
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [bookForm, setBookForm] = useState({ title: '', isbn: '', pages: '', authorId: '', categoryId: '', status: 'available' });
  const [userForm, setUserForm] = useState({ name: '', role: 'student' });

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUsers());
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Book AG Grid Column Definitions
  const bookColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70, sortable: true, filter: true },
    { field: 'title', headerName: 'Kitap Adı', flex: 2, sortable: true, filter: true },
    { field: 'isbn', headerName: 'ISBN', flex: 1, sortable: true, filter: true },
    { field: 'pages', headerName: 'Sayfa', width: 90, sortable: true },
    { field: 'status', headerName: 'Durum', width: 120, sortable: true, filter: true,
      cellRenderer: (params) => {
        const val = params.value || 'available';
        const classes = {
          available: 'bg-success/20 text-success',
          borrowed: 'bg-error/20 text-error',
          reserved: 'bg-accent-gold/20 text-accent-gold'
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${classes[val] || 'bg-outline-variant/20 text-on-surface-variant'}`}>
            {val === 'available' ? 'Müsait' : val === 'borrowed' ? 'Ödünçte' : val === 'reserved' ? 'Rezerve' : val}
          </span>
        );
      }
    },
    {
      headerName: 'İşlemler',
      width: 160,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false
    }
  ], []);

  // User AG Grid Column Definitions
  const userColDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70, sortable: true, filter: true },
    { field: 'name', headerName: 'Kullanıcı Adı', flex: 2, sortable: true, filter: true },
    { field: 'role', headerName: 'Rol', flex: 1, sortable: true, filter: true,
      cellRenderer: (params) => (
        <span className="capitalize font-semibold text-accent-gold">{params.value}</span>
      )
    },
    {
      headerName: 'İşlemler',
      width: 160,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false
    }
  ], []);

  // Book edit/delete context actions
  const bookContext = useMemo(() => ({
    onEdit: (book) => {
      setEditingItem(book);
      setBookForm({
        title: book.title,
        isbn: book.isbn,
        pages: book.pages,
        authorId: book.authorId || '',
        categoryId: book.categoryId || '',
        status: book.status || 'available'
      });
      setIsBookModalOpen(true);
    },
    onDelete: async (id) => {
      if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
        const resultAction = await dispatch(deleteBook(id));
        if (deleteBook.fulfilled.match(resultAction)) {
          dispatch(addToast({ message: 'Kitap silindi.', type: 'success' }));
        }
      }
    }
  }), [dispatch]);

  // User edit/delete context actions
  const userContext = useMemo(() => ({
    onEdit: (u) => {
      setEditingItem(u);
      setUserForm({ name: u.name, role: u.role });
      setIsUserModalOpen(true);
    },
    onDelete: async (id) => {
      if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
        const resultAction = await dispatch(deleteUser(id));
        if (deleteUser.fulfilled.match(resultAction)) {
          dispatch(addToast({ message: 'Kullanıcı silindi.', type: 'success' }));
        }
      }
    }
  }), [dispatch]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...bookForm,
      pages: Number(bookForm.pages),
      authorId: Number(bookForm.authorId),
      categoryId: Number(bookForm.categoryId),
    };

    if (editingItem) {
      const resultAction = await dispatch(updateBook({ id: editingItem.id, bookData: data }));
      if (updateBook.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Kitap güncellendi.', type: 'success' }));
      }
    } else {
      const resultAction = await dispatch(addBook(data));
      if (addBook.fulfilled.match(resultAction)) {
        dispatch(addToast({ message: 'Yeni kitap başarıyla eklendi.', type: 'success' }));
      }
    }

    setIsBookModalOpen(false);
    setEditingItem(null);
    setBookForm({ title: '', isbn: '', pages: '', authorId: '', categoryId: '', status: 'available' });
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
    setUserForm({ name: '', role: 'student' });
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="space-y-xs">
          <h1 className="font-display-lg text-primary text-3xl font-bold">Yönetici Paneli</h1>
          <p className="font-body-md text-on-surface-variant">Sistem veritabanındaki kitapları ve kullanıcı hesaplarını yönetin.</p>
        </div>

        <button 
          onClick={() => {
            setEditingItem(null);
            if (activeTab === 'books') {
              setBookForm({ title: '', isbn: '', pages: '', authorId: '', categoryId: '', status: 'available' });
              setIsBookModalOpen(true);
            } else {
              setUserForm({ name: '', role: 'student' });
              setIsUserModalOpen(true);
            }
          }}
          className="px-lg py-2.5 bg-ember-orange text-white rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-glow-accent"
        >
          {activeTab === 'books' ? '+ Yeni Kitap Ekle' : '+ Yeni Kullanıcı Ekle'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant font-label-sm text-sm">
        <button 
          onClick={() => setActiveTab('books')}
          className={`px-md py-sm border-b-2 font-bold transition-all ${
            activeTab === 'books' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Kitap Yönetimi
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-md py-sm border-b-2 font-bold transition-all ${
            activeTab === 'users' ? 'border-ember-orange text-ember-orange' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Kullanıcı Yönetimi
        </button>
      </div>

      {/* Grid wrapper */}
      <div className="ag-theme-custom w-full h-[450px]">
        {activeTab === 'books' ? (
          <AgGridReact
            rowData={books}
            columnDefs={bookColDefs}
            context={bookContext}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
          />
        ) : (
          <AgGridReact
            rowData={users}
            columnDefs={userColDefs}
            context={userContext}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
          />
        )}
      </div>

      {/* Book form modal */}
      <Modal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        title={editingItem ? 'Kitap Güncelle' : 'Yeni Kitap Ekle'}
      >
        <form onSubmit={handleBookSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Kitap Adı</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
              value={bookForm.title}
              onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">ISBN</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Sayfa</label>
              <input 
                type="number" 
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
                value={bookForm.pages}
                onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Durum</label>
              <select
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
                value={bookForm.status}
                onChange={(e) => setBookForm({...bookForm, status: e.target.value})}
              >
                <option value="available">Müsait</option>
                <option value="borrowed">Ödünçte</option>
                <option value="reserved">Rezerve</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Yazar</label>
              <select
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={bookForm.authorId}
                onChange={(e) => setBookForm({...bookForm, authorId: e.target.value})}
              >
                <option value="">Seçiniz</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Kategori</label>
              <select
                required
                className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none"
                value={bookForm.categoryId}
                onChange={(e) => setBookForm({...bookForm, categoryId: e.target.value})}
              >
                <option value="">Seçiniz</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-sm flex justify-end gap-sm">
            <button 
              type="button" 
              onClick={() => setIsBookModalOpen(false)}
              className="px-md py-2 border border-outline rounded-lg text-on-surface hover:bg-surface-container-high transition-all"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {/* User form modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingItem ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle'}
      >
        <form onSubmit={handleUserSubmit} className="space-y-md text-sm">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Kullanıcı Adı</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
              value={userForm.name}
              onChange={(e) => setUserForm({...userForm, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Rol</label>
            <select
              className="w-full px-3 py-2 border border-outline bg-surface-container text-on-surface rounded-lg focus:outline-none focus:ring-vivid-purple"
              value={userForm.role}
              onChange={(e) => setUserForm({...userForm, role: e.target.value})}
            >
              <option value="student">Öğrenci</option>
              <option value="academic">Akademisyen</option>
              <option value="librarian">Kütüphaneci</option>
              <option value="admin">Yönetici</option>
            </select>
          </div>
          <div className="pt-sm flex justify-end gap-sm">
            <button 
              type="button" 
              onClick={() => setIsUserModalOpen(false)}
              className="px-md py-2 border border-outline rounded-lg text-on-surface hover:bg-surface-container-high transition-all"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="px-md py-2 bg-ember-orange text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;