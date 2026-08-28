import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  permissions: [],
  clubs: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    setClubs(state, action) {
      state.clubs = action.payload;
    },
  },
});

export const { setProfile, setPermissions, setClubs } = userSlice.actions;
export default userSlice.reducer;
