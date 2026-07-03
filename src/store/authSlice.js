import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

// Thunk to log in a user by matching their name in the mock db
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Kullanıcılar alınamadı.');
      }
      const users = await response.json();
      
      // Find user matching username (case-insensitive) and optionally role
      const matchedUser = users.find(
        u => u.name.toLowerCase() === username.toLowerCase() && 
             (!role || u.role === role)
      );

      if (!matchedUser) {
        throw new Error('Kullanıcı bulunamadı veya rol eşleşmiyor.');
      }

      // Save user to localStorage for session persistence
      localStorage.setItem('auth_user', JSON.stringify(matchedUser));
      return matchedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to register a new user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role: role || 'student' }),
      });
      if (!response.ok) {
        throw new Error('Kayıt işlemi başarısız.');
      }
      const newUser = await response.json();
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem('auth_user'),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('auth_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
