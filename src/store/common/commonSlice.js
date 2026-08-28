import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  toast: null,
  message: null,
  isForbidden: false,
  forbiddenMessage: null,
  isUnAuthenticated: false,
  unAuthenticatedMessage: null,
  clubVersion: 0,
  pushNotification: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setToast(state, action) {
      state.toast = {
        title: action.payload.title,
        description: action.payload.description,
        // success info warning error secondary contrast
        type: action.payload.type,
        life: action.payload.life,
      };
    },
    clearToast(state) {
      state.toast = null;
    },
    setMessage(state, action) {
      state.message = {
        title: action.payload.title,
        description: action.payload.description,
        type: action.payload.type,
        life: action.payload.life,
      };
    },
    clearMessage(state) {
      state.message = null;
    },

    setIsForbidden(state, action) {
      state.isForbidden = action.payload.isForbidden;
      state.forbiddenMessage = action.payload.message;
    },
    clearForbidden(state) {
      state.isForbidden = false;
      state.forbiddenMessage = null;
    },
    setIsUnAuthenticated(state, action) {
      state.isUnAuthenticated = action.payload.isUnAuthenticated;
      state.unAuthenticatedMessage = action.payload.message;
    },
    clearUnAuthenticated(state) {
      state.isUnAuthenticated = false;
      state.unAuthenticatedMessage = null;
    },
    incrementClubVersion(state) {
      state.clubVersion += 1;
    },
    setPushNotification(state, action) {
      state.pushNotification = {
        title: action.payload.title,
        body: action.payload.body,
        image: action.payload.image || null,
      };
    },
    clearPushNotification(state) {
      state.pushNotification = null;
    },
  },
});

export const {
  setIsLoading,
  setToast,
  clearToast,
  setMessage,
  clearMessage,
  setIsForbidden,
  clearForbidden,
  clearUnAuthenticated,
  incrementClubVersion,
  setPushNotification,
  clearPushNotification,
} = commonSlice.actions;
export default commonSlice.reducer;
