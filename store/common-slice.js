import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalCity: 'London',
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setGlobalCity: (state, action) => {
      state.globalCity = action.payload;
    },
  },
});

export const { setGlobalCity} = commonSlice.actions;

export default commonSlice.reducer;

export const selectGlobalCity = (state) => state.common.globalCity;

