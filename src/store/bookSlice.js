import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/books`);
      if (!res.ok) throw new Error('Kitaplar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`);
      if (!res.ok) throw new Error('Kitap detayları yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAuthors = createAsyncThunk(
  'books/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/authors`);
      if (!res.ok) throw new Error('Yazarlar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'books/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (!res.ok) throw new Error('Kategoriler yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPublishers = createAsyncThunk(
  'books/fetchPublishers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/publishers`);
      if (!res.ok) throw new Error('Yayınevleri yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBranches = createAsyncThunk(
  'books/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/branches`);
      if (!res.ok) throw new Error('Şubeler yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error('Kitap eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error('Kitap güncellenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Kitap silinemedi.');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunks to create new Author, Category, Publisher dynamically from inline inputs
export const addAuthor = createAsyncThunk(
  'books/addAuthor',
  async (name, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Yazar eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'books/addCategory',
  async (name, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Kategori eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPublisher = createAsyncThunk(
  'books/addPublisher',
  async (name, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/publishers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Yayınevi eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  books: [],
  selectedBook: null,
  authors: [],
  categories: [],
  publishers: [],
  branches: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBooks
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchBookById
      .addCase(fetchBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchAuthors
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      })
      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // fetchPublishers
      .addCase(fetchPublishers.fulfilled, (state, action) => {
        state.publishers = action.payload;
      })
      // fetchBranches
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.branches = action.payload;
      })
      // addBook
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      // updateBook
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.selectedBook && state.selectedBook.id === action.payload.id) {
          state.selectedBook = action.payload;
        }
      })
      // deleteBook
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(b => b.id !== action.payload);
      })
      // addAuthor
      .addCase(addAuthor.fulfilled, (state, action) => {
        state.authors.push(action.payload);
      })
      // addCategory
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // addPublisher
      .addCase(addPublisher.fulfilled, (state, action) => {
        state.publishers.push(action.payload);
      });
  },
});

export const { clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
