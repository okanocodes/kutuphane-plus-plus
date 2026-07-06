import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

export const fetchNotifications = createAsyncThunk(
  'ui/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications?userId=${userId}`);
      if (!res.ok) throw new Error('Bildirimler yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'ui/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error('Bildirim güncellenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'ui/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Bildirim silinemedi.');
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  return saved || 'dark'; // Midnight & Ember defaults to dark mode
};

const initialState = {
  theme: getInitialTheme(),
  notifications: [],
  toasts: [],
  status: 'idle',
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    addToast: (state, action) => {
      const { message, type = 'info', duration = 3000 } = action.payload;
      state.toasts.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        message,
        type,
        duration,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      });
  },
});

export const { toggleTheme, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
