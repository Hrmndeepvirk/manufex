import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  meta: null,
  dismissedIds: [], // client-side "ignore" (per browser session)
};

const slice = createSlice({
  name: "shiftCoverRequest",
  initialState,
  reducers: {
    setShiftCoverRequests(state, action) {
      state.list = action.payload?.data || [];
      state.meta = action.payload?.meta || null;
    },
    upsertShiftCoverRequest(state, action) {
      const item = action.payload;
      if (!item?._id) return;
      const idx = state.list.findIndex((i) => i._id === item._id);
      if (idx >= 0) state.list[idx] = { ...state.list[idx], ...item };
      else state.list.unshift(item);
    },
    removeShiftCoverRequest(state, action) {
      const id = action.payload;
      state.list = state.list.filter((i) => i._id !== id);
    },
    dismissShiftCoverRequest(state, action) {
      const id = action.payload;
      if (!id) return;
      if (!state.dismissedIds.includes(id)) state.dismissedIds.push(id);
    },
    clearShiftCoverRequestDismissals(state) {
      state.dismissedIds = [];
    },
  },
});

export const {
  setShiftCoverRequests,
  upsertShiftCoverRequest,
  removeShiftCoverRequest,
  dismissShiftCoverRequest,
  clearShiftCoverRequestDismissals,
} = slice.actions;

export default slice.reducer;
