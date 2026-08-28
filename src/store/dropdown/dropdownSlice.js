import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reasonCodes: [],
  clubs: [],

  employees: [],
  jobTitles: [],
  departments: [],
  securityRoles: [],

  levels: [],
  locationTypes: [],
  locations: [],
  eventSetups: [],
  eventCategories: [],
  classes: [],

  tax: [],
  paymentMethods: [],
  discounts: [],
  registers: [],

  catalogItems: [],
  profitCenters: [],
  catalogCategories: [],
  catalogSubCategories: [],
  vendors: [],
  commissionGroups: [],
  referralGroups: [],

  membershipTypes: [],
  campaignGroups: [],
  campaigns: [],
  accessSchedules: [],
  resourceTypes: [],
  resources: [],

  assessedFees: [],
  agreementTemplates: [],
  agreementPlans: [],
  agreementCategories: [],
  agreementPromotions: [],

  filterSets: [],
  tags: [],

  members: [],
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    setDropdownData(state, action) {
      const payload = action.payload;
      state.reasonCodes = payload.reasonCodes || [];
      state.clubs = payload.clubs || [];

      state.employees = payload.employees || [];
      state.jobTitles = payload.jobTitles || [];
      state.departments = payload.departments || [];
      state.securityRoles = payload.securityRoles || [];

      state.levels = payload.levels || [];
      state.locationTypes = payload.locationTypes || [];
      state.locations = payload.locations || [];
      state.eventSetups = payload.eventSetups || [];
      state.eventCategories = payload.eventCategories || [];
      state.classes = payload.classes || [];

      state.tax =
        payload.tax.map((item) => ({
          ...item,
          title: `${item.title} (${item.taxRatePercentage}%)`,
        })) || [];
      state.paymentMethods = payload.paymentMethods || [];
      state.discounts = payload.discounts || [];
      state.registers = payload.registers || [];

      state.catalogItems = payload.catalogItems || [];
      state.profitCenters = payload.profitCenters || [];
      state.catalogCategories = payload.catalogCategories || [];
      state.catalogSubCategories = payload.catalogSubCategories || [];

      state.vendors = payload.vendors || [];
      state.commissionGroups = payload.commissionGroups || [];
      state.referralGroups = payload.referralGroups || [];

      state.membershipTypes = payload.membershipTypes || [];
      state.campaignGroups = payload.campaignGroups || [];
      state.campaigns = payload.campaigns || [];
      state.accessSchedules = payload.accessSchedules || [];
      state.resourceTypes = payload.resourceTypes || [];
      state.resources = payload.resources || [];

      state.assessedFees = payload.assessedFees || [];
      state.agreementTemplates = payload.agreementTemplates || [];
      state.agreementPlans = payload.agreementPlans || [];
      state.agreementCategories = payload.agreementCategories || [];
      state.agreementPromotions = payload.agreementPromotions || [];

      state.filterSets = payload.filterSets || [];
      state.tags = payload.tags;

      state.members = payload.members;
    },

    setDropDownItem(state, action) {
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
    updateDropDownItem(state, action) {
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
    removeDropDownItem(state, action) {
      const { option, id } = action.payload;
      if (state[option]) {
        state[option] = state[option].filter((i) => i._id !== id);
      }
    },
  },
});

export const {
  setDropdownData,
  setDropDownItem,
  updateDropDownItem,
  removeDropDownItem,
} = dropdownSlice.actions;
export default dropdownSlice.reducer;
