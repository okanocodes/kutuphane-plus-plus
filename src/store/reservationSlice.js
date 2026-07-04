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
      const res = await fetch(`${BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (!res.ok) throw new Error('Rezervasyon oluşturulamadı.');
      const newReservation = await res.json();

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
  async ({ deskId, userId, date, timeSlot, floor, hall }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/studyDesks/${deskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'reserved',
          userId,
          date,
          timeSlot,
          floor,
          hall,
        }),
      });

      if (!res.ok) throw new Error('Masa rezervasyonu oluşturulamadı.');
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

export const reserveMeetingRoom = createAsyncThunk(
  'reservations/reserveMeetingRoom',
  async ({ roomId, userId, date, timeSlot }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/meetingRooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'reserved',
          userId,
          date,
          timeSlot,
        }),
      });

      if (!res.ok) throw new Error('Toplantı odası rezervasyonu oluşturulamadı.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'reservations/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/events`);
      if (!res.ok) throw new Error('Etkinlikler yüklenemedi.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reserveEvent = createAsyncThunk(
  'reservations/reserveEvent',
  async ({ event, userId }, { rejectWithValue }) => {
    try {
      const currentParticipants = event.participants || [];
      const alreadyJoined = currentParticipants.map(String).includes(String(userId));

      if (alreadyJoined) {
        throw new Error('Bu etkinliğe zaten katıldınız.');
      }

      const reservedSeats = Number(event.reservedSeats || 0);
      const capacity = Number(event.capacity || 0);

      if (capacity > 0 && reservedSeats >= capacity) {
        throw new Error('Etkinlik kontenjanı dolu.');
      }

      const res = await fetch(`${BASE_URL}/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservedSeats: reservedSeats + 1,
          participants: [...currentParticipants, userId],
        }),
      });

      if (!res.ok) throw new Error('Etkinlik rezervasyonu oluşturulamadı.');
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
  events: [],
  status: 'idle',
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })

      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const index = state.reservations.findIndex((r) => String(r.id) === String(action.payload.id));
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })

      .addCase(fetchStudyDesks.fulfilled, (state, action) => {
        state.studyDesks = action.payload;
      })

      .addCase(reserveStudyDesk.fulfilled, (state, action) => {
        const index = state.studyDesks.findIndex((desk) => String(desk.id) === String(action.payload.id));
        if (index !== -1) {
          state.studyDesks[index] = action.payload;
        }
      })

      .addCase(fetchMeetingRooms.fulfilled, (state, action) => {
        state.meetingRooms = action.payload;
      })

      .addCase(reserveMeetingRoom.fulfilled, (state, action) => {
        const index = state.meetingRooms.findIndex((room) => String(room.id) === String(action.payload.id));
        if (index !== -1) {
          state.meetingRooms[index] = action.payload;
        }
      })

      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })

      .addCase(reserveEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => String(event.id) === String(action.payload.id));
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      });
  },
});

export default reservationSlice.reducer;