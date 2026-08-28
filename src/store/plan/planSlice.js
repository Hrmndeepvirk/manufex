import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plans: [],
  draftPlans: [],
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans(state, action) {
      state.plans = action.payload;
    },
    setDraftPlans(state, action) {
      state.draftPlans = action.payload;
    },
  },
});

export const { setPlans, setDraftPlans } = planSlice.actions;
export default planSlice.reducer;
