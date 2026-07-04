import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    readBooks: 24,
    activeReservations: 2,
    borrowedBooksCount: 3,
    penaltyPoints: 0,
  },
  readingStatsMonthly: [
    { month: 'Oca', count: 4 },
    { month: 'Şub', count: 7 },
    { month: 'Mar', count: 3 },
    { month: 'Nis', count: 5 },
    { month: 'May', count: 8 },
  ],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
});

export default dashboardSlice.reducer;