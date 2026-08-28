import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  details: {},
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyDetails(state, action) {
      state.details = action.payload;
    },
  },
});

export const { setCompanyDetails } = companySlice.actions;
export default companySlice.reducer;

