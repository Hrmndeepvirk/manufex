import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeTasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setEmployeeTasks(state, action) {
      state.employeeTasks = action.payload;
    },
  },
});

export const { setEmployeeTasks } = taskSlice.actions;
export default taskSlice.reducer;
