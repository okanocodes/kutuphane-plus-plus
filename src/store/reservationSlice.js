import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/reservations`);
      if (!res.ok) throw new Error('Rezervasyonlar yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      // Create reservation
      const res = await fetch(`${BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });
      if (!res.ok) throw new Error('Rezervasyon oluşturulamadı.');
      const newReservation = await res.json();

      // Update book status to 'reserved'
      await fetch(`${BASE_URL}/books/${reservationData.bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reserved' }),
      });

      return newReservation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReservationStatus = createAsyncThunk(
  'reservations/updateReservationStatus',
  async ({ id, status, bookId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Rezervasyon güncellenemedi.');
      const updatedReservation = await res.json();

      // If reservation is canceled, set book back to available
      if (status === 'canceled' && bookId) {
        await fetch(`${BASE_URL}/books/${bookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'available' }),
        });
      }

      return updatedReservation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStudyDesks = createAsyncThunk(
  'reservations/fetchStudyDesks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/studyDesks`);
      if (!res.ok) throw new Error('Çalışma masaları yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reserveStudyDesk = createAsyncThunk(
  'reservations/reserveStudyDesk',
  async ({ deskId, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/studyDesks/${deskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Masa rezervasyonu güncellenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMeetingRooms = createAsyncThunk(
  'reservations/fetchMeetingRooms',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/meetingRooms`);
      if (!res.ok) throw new Error('Toplantı odaları yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  reservations: [],
  studyDesks: [],
  meetingRooms: [],
  status: 'idle',
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchReservations
      .addCase(fetchReservations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // createReservation
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      // updateReservationStatus
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      // fetchStudyDesks
      .addCase(fetchStudyDesks.fulfilled, (state, action) => {
        state.studyDesks = action.payload;
      })
      // reserveStudyDesk
      .addCase(reserveStudyDesk.fulfilled, (state, action) => {
        const index = state.studyDesks.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.studyDesks[index] = action.payload;
        }
      })
      // fetchMeetingRooms
      .addCase(fetchMeetingRooms.fulfilled, (state, action) => {
        state.meetingRooms = action.payload;
      });
  },
});

export default reservationSlice.reducer;
