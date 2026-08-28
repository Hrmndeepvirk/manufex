import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: null,
};

const visitorRegisterationSlice = createSlice({
  name: "visitorRegisteration",
  initialState,
  reducers: {
    setCompany(state, action) {
      state.company = action.payload;
    },
    clearCompany(state) {
      state.company = null;
    },
  },
});

export const { setCompany, clearCompany } = visitorRegisterationSlice.actions;
export default visitorRegisterationSlice.reducer;
