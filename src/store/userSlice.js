import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateReservationStatus } from './reservationSlice';

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
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    try {
      // Create a borrow log
      const res = await fetch(`${BASE_URL}/borrowedBooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: Number(userId), 
          bookId: Number(bookId), 
          status: 'active', 
          borrowDate: new Date().toISOString().split('T')[0] 
        }),
      });
      if (!res.ok) throw new Error('Ödünç alma işlemi başarısız.');
      const borrowLog = await res.json();

      // Wait for json-server file write to flush to disk
      await delay(150);

      // Update book status to 'borrowed'
      await fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'borrowed' }),
      });

      // Wait for json-server file write to flush to disk
      await delay(150);

      // Fetch book info for notification title
      const bookRes = await fetch(`${BASE_URL}/books/${bookId}`);
      let bookTitle = `Kitap #${bookId}`;
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        bookTitle = bookData.title;
      }
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      // Create notification
      await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          type: 'ödünç',
          title: `[${dateStr}] "${bookTitle}" Kitabı ödünç alındı.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        }),
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
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    try {
      // Update borrow log status to 'returned'
      const res = await fetch(`${BASE_URL}/borrowedBooks/${borrowedRecordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'returned', returnDate: new Date().toISOString().split('T')[0] }),
      });
      if (!res.ok) throw new Error('İade işlemi başarısız.');
      const borrowLog = await res.json();

      // Wait for json-server file write to flush to disk
      await delay(150);

      // Update book status to 'available'
      await fetch(`${BASE_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'available' }),
      });

      // Wait for json-server file write to flush to disk
      await delay(150);

      // Fetch book info for notification title
      const bookRes = await fetch(`${BASE_URL}/books/${bookId}`);
      let bookTitle = `Kitap #${bookId}`;
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        bookTitle = bookData.title;
      }
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      // Create notification
      await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(borrowLog.userId),
          type: 'iade',
          title: `[${dateStr}] "${bookTitle}" Kitabı iade edildi.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      return borrowLog;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const extendLoan = createAsyncThunk(
  'users/extendLoan',
  async ({ recordId, newBorrowDate }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/borrowedBooks/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          borrowDate: newBorrowDate,
          status: 'active' // Reset overdue state if it was overdue
        }),
      });
      if (!res.ok) throw new Error('Süre uzatma işlemi başarısız.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearUserPenalty = createAsyncThunk(
  'users/clearUserPenalty',
  async (penaltyId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/penalties/${penaltyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Ceza silinemedi.');
      return penaltyId;
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
      // updateReservationStatus (add approved reservation loan to list)
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        if (action.payload && action.payload.borrowLog) {
          const exists = state.borrowedBooks.some(item => String(item.id) === String(action.payload.borrowLog.id));
          if (!exists) {
            state.borrowedBooks.push(action.payload.borrowLog);
          }
        }
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
      // extendLoan
      .addCase(extendLoan.fulfilled, (state, action) => {
        const index = state.borrowedBooks.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.borrowedBooks[index] = action.payload;
        }
      })
      // clearUserPenalty
      .addCase(clearUserPenalty.fulfilled, (state, action) => {
        state.penalties = state.penalties.filter(p => p.id !== action.payload);
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
