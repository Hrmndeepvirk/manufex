import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredEmployees: [],
};

const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    setFilteredEmployees: (state, action) => {
      state.filteredEmployees = action.payload;
    },
  },
});

export const { setFilteredEmployees } = helperSlice.actions;
export default helperSlice.reducer;
