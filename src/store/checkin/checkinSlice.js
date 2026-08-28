import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recent: [],
  lastCheckin: null,
  memberEvents: [],
  memberResources: [],
  memberServices: [],
  memberProducts: [],
  quickEnrollEvents: [],
};

const checkinSlice = createSlice({
  name: "checkin",
  initialState,
  reducers: {
    setRecentCheckins(state, action) {
      state.recent = action.payload;
    },
    setLastCheckin(state, action) {
      state.lastCheckin = action.payload;
    },
    setMemberEvents(state, action) {
      state.memberEvents = action.payload;
    },
    setMemberBookedResources(state, action) {
      state.memberResources = action.payload;
    },
    setMemberServices(state, action) {
      state.memberServices = action.payload;
    },
    setMemberProducts(state, action) {
      state.memberProducts = action.payload;
    },
    setQuickEnrollEvents(state, action) {
      state.quickEnrollEvents = action.payload;
    },
    updateCheckinItem(state, action) {
      const item = action.payload;
      if (state.recent) {
        const index = state.recent.findIndex((i) => i._id === item._id);
        if (index !== -1) {
          state.recent[index] = item;
        } else {
          state.recent.unshift(item);
        }
      }
    },
  },
});

export const {
  setRecentCheckins,
  setLastCheckin,
  setMemberEvents,
  setMemberBookedResources,
  setMemberServices,
  setQuickEnrollEvents,
  setMemberProducts,
  updateCheckinItem,
} = checkinSlice.actions;
export default checkinSlice.reducer;
