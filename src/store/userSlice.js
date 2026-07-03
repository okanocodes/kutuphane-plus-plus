import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      if (!res.ok) throw new Error('Kullanıcılar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBorrowedBooks = createAsyncThunk(
  'users/fetchBorrowedBooks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/borrowedBooks`);
      if (!res.ok) throw new Error('Ödünç kitap listesi yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPenalties = createAsyncThunk(
  'users/fetchPenalties',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/penalties`);
      if (!res.ok) throw new Error('Cezalar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const borrowBook = createAsyncThunk(
  'users/borrowBook',
  async ({ userId, bookId }, { rejectWithValue }) => {
    try {
      // Create a borrow log
      const res = await fetch(`${BASE_URL}/borrowedBooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId), status: 'active', borrowDate: new Date().toISOString().split('T')[0] }),
      });
      if (!res.ok) throw new Error('Ödünç alma işlemi başarısız.');
      const borrowLog = await res.json();

      // Update book status to 'borrowed'
      await fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'borrowed' }),
      });

      return borrowLog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const returnBook = createAsyncThunk(
  'users/returnBook',
  async ({ borrowedRecordId, bookId }, { rejectWithValue }) => {
    try {
      // Update borrow log status to 'returned'
      const res = await fetch(`${BASE_URL}/borrowedBooks/${borrowedRecordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'returned', returnDate: new Date().toISOString().split('T')[0] }),
      });
      if (!res.ok) throw new Error('İade işlemi başarısız.');
      const borrowLog = await res.json();

      // Update book status to 'available'
      await fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'available' }),
      });

      return borrowLog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error('Kullanıcı eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error('Kullanıcı güncellenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Kullanıcı silinemedi.');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  borrowedBooks: [],
  penalties: [],
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchBorrowedBooks
      .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
        state.borrowedBooks = action.payload;
      })
      // fetchPenalties
      .addCase(fetchPenalties.fulfilled, (state, action) => {
        state.penalties = action.payload;
      })
      // borrowBook
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.borrowedBooks.push(action.payload);
      })
      // returnBook
      .addCase(returnBook.fulfilled, (state, action) => {
        const index = state.borrowedBooks.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.borrowedBooks[index] = action.payload;
        }
      })
      // addUser
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
