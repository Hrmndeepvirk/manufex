import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repeatingEvents: [],
  employeeAvailability: [],
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setRepeatingEvents: (state, action) => {
      state.repeatingEvents = action.payload;
    },
    setEmployeeAvailability: (state, action) => {
      state.employeeAvailability = action.payload;
    },
  },
});

export const { setRepeatingEvents, setEmployeeAvailability } = scheduleSlice.actions;
export default scheduleSlice.reducer;
