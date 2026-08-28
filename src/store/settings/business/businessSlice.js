import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: null,
  reasonCodes: [],
  iposTerminals: [],
  customizations: {},
  clubs: [],
  defaults: {},
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setReasonCodes: (state, action) => {
      state.reasonCodes = action.payload;
    },
    setIposTerminals: (state, action) => {
      state.iposTerminals = action.payload;
    },
    setCustomizations: (state, action) => {
      state.customizations = action.payload;
    },
    setClubs: (state, action) => {
      state.clubs = action.payload;
    },
    setDefaults: (state, action) => {
      state.defaults = action.payload;
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
  setCompany,
  setReasonCodes,
  setIposTerminals,
  setCustomizations,
  setClubs,
  setDefaults,

  updateItem,
  removeItem,
} = businessSlice.actions;
export default businessSlice.reducer;
