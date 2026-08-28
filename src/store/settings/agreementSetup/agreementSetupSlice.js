import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assessedFees: [],
  agreementTemplates: [],
  agreementPlans: [],
  agreementCategories: [],
  agreementPromotions: [],
  groupPlans: [],
};

const slice = createSlice({
  name: "agreementSetup",
  initialState,
  reducers: {
    setAssessedFees: (state, action) => {
      state.assessedFees = action.payload;
    },
    setAgreementTemplates: (state, action) => {
      state.agreementTemplates = action.payload;
    },
    setAgreementPlans: (state, action) => {
      state.agreementPlans = action.payload;
    },
    setAgreementCategories: (state, action) => {
      state.agreementCategories = action.payload;
    },
    setAgreementPromotions: (state, action) => {
      state.agreementPromotions = action.payload;
    },
    setGroupPlans: (state, action) => {
      state.groupPlans = action.payload;
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
  setAssessedFees,
  setAgreementTemplates,
  setAgreementPlans,
  setAgreementCategories,
  setAgreementPromotions,
  setGroupPlans,

  updateItem,
  removeItem,
} = slice.actions;
export default slice.reducer;
