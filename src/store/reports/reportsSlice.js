import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
    },
    updateReport(state, action) {
      const item = action.payload;
      const index = state.reports.findIndex((i) => i._id === item._id);
      if (index !== -1) {
        state.reports[index] = item;
      } else {
        state.reports.push(item);
      }
    },
    removeReport(state, action) {
      state.reports = state.reports.filter((i) => i._id !== action.payload);
    },
  },
});

export const { setReports, updateReport, removeReport } =
  reportsSlice.actions;
export default reportsSlice.reducer;
