import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    totalEmployees: 0,
    totalMembers: 0,
    activeMembers: 0,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStats(state, action) {
      state.stats = action.payload;
    },
  },
});

export const { setDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;