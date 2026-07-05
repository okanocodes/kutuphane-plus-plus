import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; //[cite: 1]
import bookReducer from './bookSlice'; //[cite: 1]
import userReducer from './userSlice'; //[cite: 1]
import reservationReducer from './reservationSlice'; //[cite: 1]
import uiReducer from './uiSlice'; //[cite: 1]
import dashboardReducer from './dashboardSlice'; // Senin yeni eklediğin slice dosyası

export const store = configureStore({
  reducer: {
    auth: authReducer, //[cite: 1]
    books: bookReducer, //[cite: 1]
    users: userReducer, //[cite: 1]
    reservations: reservationReducer, //[cite: 1]
    ui: uiReducer, //[cite: 1]
    dashboard: dashboardReducer, // Dashboard state yapısını sisteme entegre ettik
  },
});

export default store;