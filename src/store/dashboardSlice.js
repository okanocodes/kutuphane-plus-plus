import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    readBooks: 24,
    activeReservations: 2,
    borrowedBooksCount: 3,
    penaltyPoints: 0,
  },
  borrowedBooks: [
    { id: 1, title: "Simyacı", author: "Paulo Coelho", dueDate: "2026-07-15", status: "Aktif" },
    { id: 2, title: "Suç ve Ceza", author: "Dostoyevski", dueDate: "2026-07-20", status: "Aktif" },
  ],
  monthlyStats: [
    { month: 'Oca', count: 4, height: 'h-16' },
    { month: 'Şub', count: 7, height: 'h-28' },
    { month: 'Mar', count: 3, height: 'h-12' },
    { month: 'Nis', count: 5, height: 'h-20' },
    { month: 'May', count: 8, height: 'h-32' },
  ]
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    extendBookDueDate: (state, action) => {
      const book = state.borrowedBooks.find(b => b.id === action.payload);
      if (book) {
        book.dueDate = "2026-07-30";
      }
    }
  },
});

export const { extendBookDueDate } = dashboardSlice.actions;
export default dashboardSlice.reducer;