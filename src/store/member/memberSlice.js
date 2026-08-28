import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  members: [],
  memberServices: [],
  memberServiceRedeems: [],
  memberResourceUsage: [],
  memberPastDues: [],
  rewards: [],
  memberAgreements: [],
  memberRedeemables: [],
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setMembers(state, action) {
      state.members = action.payload;
    },
    setMemberServices(state, action) {
      state.memberServices = action.payload;
    },
    setMemberServiceRedeems: (state, action) => {
      state.memberServiceRedeems = action.payload;
    },
    setRewards: (state, action) => {
      state.rewards = action.payload;
    },
    setMemberAgreements: (state, action) => {
      state.memberAgreements = action.payload;
    },
    setMemberRedeemables: (state, action) => {
      state.memberRedeemables = action.payload;
    },
    setMemberResourceUsage: (state, action) => {
      state.memberResourceUsage = action.payload;
    },
    setMemberPastDues: (state, action) => {
      state.memberPastDues = action.payload;
    },
  },
});

export const {
  setMembers,
  setMemberServices,
  setMemberServiceRedeems,
  setMemberResourceUsage,
  setMemberPastDues,
  setRewards,
  setMemberAgreements,
  setMemberRedeemables,
} = memberSlice.actions;
export default memberSlice.reducer;
