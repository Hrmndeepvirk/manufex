import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: null,
  pointsEarningRules: [],
  rewardCatalogs: [],
};

const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setPointsEarningRules: (state, action) => {
      state.pointsEarningRules = action.payload;
    },
    setRewardsCatalogs: (state, action) => {
      state.rewardCatalogs = action.payload;
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
  setSettings,
  setPointsEarningRules,
  setRewardsCatalogs,
  updateItem,
  removeItem,
} = rewardsSlice.actions;
export default rewardsSlice.reducer;
