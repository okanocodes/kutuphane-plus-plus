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

      // Get book details for notification title
      const bookRes = await fetch(`${BASE_URL}/books/${reservationData.bookId}`);
      let bookTitle = 'Bilinmeyen Kitap';
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
          userId: Number(reservationData.userId),
          type: 'rezervasyon',
          title: `[${dateStr}] "${bookTitle}" Kitabı için rezervasyon talebi alındı.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        }),
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
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    try {
      // 1. Fetch reservation to get userId and bookId directly from database
      const getRes = await fetch(`${BASE_URL}/reservations/${id}`);
      if (!getRes.ok) throw new Error('Rezervasyon bulunamadı.');
      const reservation = await getRes.json();
      const userId = reservation.userId;
      const resolvedBookId = Number(reservation.bookId || bookId);

      if (isNaN(resolvedBookId)) {
        throw new Error('Geçersiz kitap ID.');
      }

      // 2. Update status
      const res = await fetch(`${BASE_URL}/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Rezervasyon güncellenemedi.');
      const updatedReservation = await res.json();
      
      // Wait for json-server file write to flush to disk
      await delay(150);

      // Get book details for notification title
      const bookRes = await fetch(`${BASE_URL}/books/${resolvedBookId}`);
      let bookTitle = 'Bilinmeyen Kitap';
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        bookTitle = bookData.title;
      }
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      // 3. approved -> convert to loan, set book as borrowed, write notification
      let borrowLog = null;
      if (status === 'approved') {
        // Create active borrow log
        const borrowRes = await fetch(`${BASE_URL}/borrowedBooks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            bookId: resolvedBookId,
            status: 'active',
            borrowDate: new Date().toISOString().split('T')[0]
          })
        });
        if (!borrowRes.ok) {
          const errText = await borrowRes.text();
          throw new Error(`Ödünç kaydı oluşturulamadı: ${errText}`);
        }
        borrowLog = await borrowRes.json();

        // Wait for json-server file write to flush to disk
        await delay(150);

        // Update book status
        await fetch(`${BASE_URL}/books/${resolvedBookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'borrowed' }),
        });

        // Wait for json-server file write to flush to disk
        await delay(150);

        // Create notification
        await fetch(`${BASE_URL}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            type: 'rezervasyon',
            title: `[${dateStr}] "${bookTitle}" Kitap rezervasyonunuz onaylandı.`,
            read: false,
            date: new Date().toISOString().split('T')[0]
          })
        });
      }

      // 4. canceled -> return book to available, write notification
      if (status === 'canceled' && resolvedBookId) {
        await fetch(`${BASE_URL}/books/${resolvedBookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'available' }),
        });

        // Wait for json-server file write to flush to disk
        await delay(150);

        // Create notification
        await fetch(`${BASE_URL}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            type: 'rezervasyon',
            title: `[${dateStr}] "${bookTitle}" Kitap rezervasyonunuz iptal edildi.`,
            read: false,
            date: new Date().toISOString().split('T')[0]
          })
        });
      }

      return {
        reservation: updatedReservation,
        borrowLog: borrowLog
      };
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
      const deskData = await res.json();

      // Create notification
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          type: 'rezervasyon',
          title: `[${dateStr}] "Masa #${deskId}" Çalışma masası rezervasyonu oluşturuldu.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        })
      });

      return deskData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelStudyDeskReservation = createAsyncThunk(
  'reservations/cancelStudyDeskReservation',
  async (deskId, { rejectWithValue }) => {
    try {
      // Fetch desk details to get the userId before clearing
      const deskRes = await fetch(`${BASE_URL}/studyDesks/${deskId}`);
      let userId = null;
      if (deskRes.ok) {
        const deskData = await deskRes.json();
        userId = deskData.userId;
      }

      const res = await fetch(`${BASE_URL}/studyDesks/${deskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'available',
          userId: null,
          date: null,
          timeSlot: null,
          floor: null,
          hall: null,
        }),
      });
      if (!res.ok) throw new Error('Masa rezervasyonu iptal edilemedi.');
      const finalDeskData = await res.json();

      if (userId) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        await fetch(`${BASE_URL}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            type: 'rezervasyon',
            title: `[${dateStr}] "Masa #${deskId}" Çalışma masası rezervasyonunuz iptal edildi.`,
            read: false,
            date: new Date().toISOString().split('T')[0]
          })
        });
      }

      return finalDeskData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkInStudyDesk = createAsyncThunk(
  'reservations/checkInStudyDesk',
  async (deskId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/studyDesks/${deskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'occupied',
        }),
      });
      if (!res.ok) throw new Error('Giriş işlemi başarısız.');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const extendStudyDeskReservation = createAsyncThunk(
  'reservations/extendStudyDeskReservation',
  async ({ deskId, newTimeSlot }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/studyDesks/${deskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeSlot: newTimeSlot,
        }),
      });
      if (!res.ok) throw new Error('Süre uzatılamadı.');
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
      const roomData = await res.json();
      const roomName = roomData.name || `Oda #${roomId}`;

      // Create notification
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          type: 'rezervasyon',
          title: `[${dateStr}] "${roomName}" Toplantı odası rezervasyonu oluşturuldu.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        })
      });

      return roomData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelMeetingRoomReservation = createAsyncThunk(
  'reservations/cancelMeetingRoomReservation',
  async (roomId, { rejectWithValue }) => {
    try {
      // Fetch room details to get the userId before clearing
      const roomRes = await fetch(`${BASE_URL}/meetingRooms/${roomId}`);
      let userId = null;
      let roomName = `Oda #${roomId}`;
      if (roomRes.ok) {
        const roomData = await roomRes.json();
        userId = roomData.userId;
        roomName = roomData.name || `Oda #${roomId}`;
      }

      const res = await fetch(`${BASE_URL}/meetingRooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'available',
          userId: null,
          date: null,
          timeSlot: null,
        }),
      });
      if (!res.ok) throw new Error('Oda rezervasyonu iptal edilemedi.');
      const finalRoomData = await res.json();

      if (userId) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        await fetch(`${BASE_URL}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(userId),
            type: 'rezervasyon',
            title: `[${dateStr}] "${roomName}" Toplantı odası rezervasyonunuz iptal edildi.`,
            read: false,
            date: new Date().toISOString().split('T')[0]
          })
        });
      }

      return finalRoomData;
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
      const eventData = await res.json();

      // Create notification
      const now = new Date();
      const dateStr = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          type: 'event',
          title: `[${dateStr}] "${event.title}" Etkinliğine katılım kaydınız oluşturuldu.`,
          read: false,
          date: new Date().toISOString().split('T')[0]
        })
      });

      return eventData;
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
        const targetReservation = action.payload.reservation || action.payload;
        const index = state.reservations.findIndex((r) => String(r.id) === String(targetReservation.id));
        if (index !== -1) {
          state.reservations[index] = targetReservation;
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

      .addCase(cancelStudyDeskReservation.fulfilled, (state, action) => {
        const index = state.studyDesks.findIndex((desk) => String(desk.id) === String(action.payload.id));
        if (index !== -1) {
          state.studyDesks[index] = action.payload;
        }
      })

      .addCase(checkInStudyDesk.fulfilled, (state, action) => {
        const index = state.studyDesks.findIndex((desk) => String(desk.id) === String(action.payload.id));
        if (index !== -1) {
          state.studyDesks[index] = action.payload;
        }
      })

      .addCase(extendStudyDeskReservation.fulfilled, (state, action) => {
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

      .addCase(cancelMeetingRoomReservation.fulfilled, (state, action) => {
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