import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queuedReports: [],
};

const queuedReportsSlice = createSlice({
  name: "queuedReports",
  initialState,
  reducers: {
    setQueuedReports(state, action) {
      state.queuedReports = action.payload;
    },
    updateQueuedItem(state, action) {
      const { option, item } = action.payload;
      if (state[option]) {
        const index = state[option].findIndex((i) => i._id === item._id);
        if (index !== -1) {
          state[option][index] = item;
        } else {
          state[option].push(item);
        }
      }
    },
    removeQueuedReport(state, action) {
      state.queuedReports = state.queuedReports.filter(
        (i) => i._id !== action.payload,
      );
    },
  },
});

export const { setQueuedReports, updateQueuedItem, removeQueuedReport } =
  queuedReportsSlice.actions;
export default queuedReportsSlice.reducer;
