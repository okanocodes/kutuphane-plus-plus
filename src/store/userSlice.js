import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: {
    name: 'Sudenaz Sangür',
    email: 'sudenaz@nisantasi.edu.tr',
    studentId: '202312345',
    department: 'Management Information Systems',
  },
  status: 'idle',
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;