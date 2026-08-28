import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tax: [],
  paymentMethods: [],
  discounts: [],
  registers: [],
};

const slice = createSlice({
  name: "pointOfSale",
  initialState,
  reducers: {
    setTax: (state, action) => {
      state.tax = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    setDiscounts: (state, action) => {
      state.discounts = action.payload;
    },
    setRegisters: (state, action) => {
      state.registers = action.payload;
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
  setTax,
  setPaymentMethods,
  setDiscounts,
  setRegisters,

  updateItem,
  removeItem,
} = slice.actions;
export default slice.reducer;
