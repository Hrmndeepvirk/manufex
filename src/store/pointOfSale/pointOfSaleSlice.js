import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  catalogItems: [],
  membersList: [],
  filters: [],
  tags: [],
  topSellingCatalogItems: [],
  cashRegisters: [],
  currentCashRegister: null,
  registerStatusList: [],
  registerSummaryList: [],
  salesList: [],
  savedCarts: [],
  selectedDrawer: "",


};

const pointOfSaleSlice = createSlice({
  name: "pointOfSale",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setCatalogItems(state, action) {
      state.catalogItems = action.payload;
    },
    setMembersList(state, action) {
      state.membersList = action.payload;
    },
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setTags(state, action) {
      state.tags = action.payload;
    },
    setTopSellingCatalogItems(state, action) {
      state.topSellingCatalogItems = action.payload;
    },
    setCashRegisters(state, action) {
      state.cashRegisters = action.payload;
    },
    setCurrentCashRegister(state, action) {
      state.currentCashRegister = action.payload;
    },
    setRegisterStatusList(state, action) {
      state.registerStatusList = action.payload;
    },
    setRegisterSummaryList(state, action) {
      state.registerSummaryList = action.payload;
    },
    clearCurrentCashRegister(state) {
      state.currentCashRegister = null;
    },
    setSalesList: (state, action) => {
      state.salesList = action.payload;
    },
    setSavedCarts: (state, action) => {
      state.savedCarts = action.payload;
    },
    setSelectedDrawer: (state, action) => {
      state.selectedDrawer = action.payload;
    },
  },
});

export const {
  setCategories,
  setCatalogItems,
  setMembersList,
  setFilters,
  setTags,
  setTopSellingCatalogItems,
  setCashRegisters,
  setCurrentCashRegister,
  setRegisterStatusList,
  setRegisterSummaryList,
  clearCurrentCashRegister,
  setSalesList,
  setSavedCarts,
  setSelectedDrawer,
} = pointOfSaleSlice.actions; 
export default pointOfSaleSlice.reducer;
