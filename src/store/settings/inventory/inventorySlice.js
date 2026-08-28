import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  catalogItems: [],
  profitCenters: [],
  referralGroups: [],
  catalogCategories: [],
  vendors: [],
  commissionGroups: [],
  filterSets: [],
  tags: [],
  catalogSubCategories: [],
  catalogSubCategoryGroups: [],
};

const slice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setCatalogItems: (state, action) => {
      state.catalogItems = action.payload;
    },
    setProfitCenters: (state, action) => {
      state.profitCenters = action.payload;
    },
    setReferralGroups: (state, action) => {
      state.referralGroups = action.payload;
    },
    setCatalogCategories: (state, action) => {
      state.catalogCategories = action.payload;
    },
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setCommissionGroups: (state, action) => {
      state.commissionGroups = action.payload;
    },

    setFilterSets: (state, action) => {
      state.filterSets = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setCatalogSubCategories: (state, action) => {
      state.catalogSubCategories = action.payload;
    },
    clearCatalogSubCategories: (state) => {
      state.catalogSubCategories = [];
    },

    setCatalogSubCategoryGroups: (state, action) => {
  state.catalogSubCategoryGroups = action.payload;
},
clearCatalogSubCategoryGroups: (state) => {
  state.catalogSubCategoryGroups = [];
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
  setCatalogItems,
  setProfitCenters,
  setReferralGroups,
  setCatalogCategories,
  setVendors,
  setCommissionGroups,
  setFilterSets,
  setTags,
  updateItem,
  removeItem,
  setCatalogSubCategories,
  clearCatalogSubCategories,
  setCatalogSubCategoryGroups,
  clearCatalogSubCategoryGroups,
} = slice.actions;
export default slice.reducer;
