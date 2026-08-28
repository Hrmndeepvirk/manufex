import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  levels: [],
  eventSetups: [],
  locationTypes: [],
  locations: [],
  eventCategories: [],
  classes: [],
  schedulingOptions: [],
  specialTimingsAndHolidays: [],
  eventSetupServices: [],
};

const slice = createSlice({
  name: "scheduleSetup",
  initialState,
  reducers: {
    setLevels: (state, action) => {
      state.levels = action.payload;
    },
    setEventSetups: (state, action) => {
      state.eventSetups = action.payload;
    },
    setLocationTypes: (state, action) => {
      state.locationTypes = action.payload;
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setEventCategories: (state, action) => {
      state.eventCategories = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    setSchedulingOption: (state, action) => {
      state.schedulingOptions = action.payload;
    },

    setEventSetupServices: (state, action) => {
      state.eventSetupServices = action.payload;
    },

    setSpecialTimingsAndHolidays: (state, action) => {
      state.specialTimingsAndHolidays = action.payload;
    },
    updateItem(state, action) {
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
    removeItem(state, action) {
      const { option, id } = action.payload;
      if (state[option]) {
        state[option] = state[option].filter((i) => i._id !== id);
      }
    },
  },
});

export const {
  setLevels,
  setEventSetups,
  setLocationTypes,
  setLocations,
  setEventCategories,
  setClasses,
  setSpecialTimingsAndHolidays,
  setEventSetupServices,
  setSchedulingOption,

  updateItem,
  removeItem,
} = slice.actions;
export default slice.reducer;
