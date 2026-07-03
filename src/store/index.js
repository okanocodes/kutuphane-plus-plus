import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice';
import userReducer from './userSlice';
import reservationReducer from './reservationSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    users: userReducer,
    reservations: reservationReducer,
    ui: uiReducer,
  },
});
export default store;
