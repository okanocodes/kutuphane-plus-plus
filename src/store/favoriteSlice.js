import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/favorites?userId=${userId}`);
      if (!res.ok) throw new Error('Favoriler yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, bookId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId) }),
      });
      if (!res.ok) throw new Error('Favorilere eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/favorites/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Favorilerden kaldırılamadı.');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReadingList = createAsyncThunk(
  'favorites/fetchReadingList',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/readingList?userId=${userId}`);
      if (!res.ok) throw new Error('Okuma listesi yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReadingList = createAsyncThunk(
  'favorites/addReadingList',
  async ({ userId, bookId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/readingList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId) }),
      });
      if (!res.ok) throw new Error('Okuma listesine eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeReadingList = createAsyncThunk(
  'favorites/removeReadingList',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/readingList/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Okuma listesinden kaldırılamadı.');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'favorites/fetchReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/reviews?bookId=${bookId}`);
      if (!res.ok) throw new Error('Yorumlar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'favorites/addReview',
  async ({ bookId, userId, userName, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: Number(bookId),
          userId: Number(userId),
          userName,
          rating: Number(rating),
          comment,
        }),
      });
      if (!res.ok) throw new Error('Yorum eklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  favorites: [],
  readingList: [],
  reviews: [],
  status: 'idle',
  reviewsStatus: 'idle',
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.reviewsStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter((fav) => fav.id !== action.payload);
      })

      // Reading List
      .addCase(fetchReadingList.fulfilled, (state, action) => {
        state.readingList = action.payload;
      })
      .addCase(addReadingList.fulfilled, (state, action) => {
        state.readingList.push(action.payload);
      })
      .addCase(removeReadingList.fulfilled, (state, action) => {
        state.readingList = state.readingList.filter((item) => item.id !== action.payload);
      })

      // Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsStatus = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsStatus = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.reviewsStatus = 'failed';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      });
  },
});

export const { clearReviews } = favoriteSlice.actions;
export default favoriteSlice.reducer;
