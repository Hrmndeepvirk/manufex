import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  membershipTypes: [],
  campaignGroups: [],
  campaigns: [],
  accessSchedules: [],
  resourceTypes: [],
  resources: [],
};

const slice = createSlice({
  name: "memberSetup",
  initialState,
  reducers: {
    setMembershipTypes: (state, action) => {
      state.membershipTypes = action.payload;
    },
    setCampaignGroups: (state, action) => {
      state.campaignGroups = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setAccessSchedules: (state, action) => {
      state.accessSchedules = action.payload;
    },
    setResourceTypes: (state, action) => {
      state.resourceTypes = action.payload;
    },
    setResources: (state, action) => {
      state.resources = action.payload;
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
  setMembershipTypes,
  setCampaigns,
  setCampaignGroups,
  setAccessSchedules,
  setResourceTypes,
  setResources,

  updateItem,
  removeItem,
} = slice.actions;
export default slice.reducer;
