import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  availability: [],
  timesheets: [],
  jobTitles: [],
  departments: [],
  securityRoles: [],
  reportSecurity: [],
  notes: [],
  employeeCertificates: [],
  employeeDepartments: [],
  classSetup: [],
  substituteOptions: [],
  appointmentPays: [],
  appointmentBonus: [],
  salesBonus: [],
  itemCommission: [],
  employeeTimesheets: [],
  requests: [],
};

const slice = createSlice({
  name: "employeeSetup",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setAvailability: (state, action) => {
      state.availability = action.payload;
    },
    setTimesheets: (state, action) => {
      state.timesheets = action.payload;
    },
    setJobTitles: (state, action) => {
      state.jobTitles = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setSecurityRoles: (state, action) => {
      state.securityRoles = action.payload;
    },
    setReportSecurity: (state, action) => {
      state.reportSecurity = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setEmployeeCertificates: (state, action) => {
      state.employeeCertificates = action.payload;
    },
    setEmployeeDepartments: (state, action) => {
      state.employeeDepartments = action.payload;
    },
    setClassSetup: (state, action) => {
      state.classSetup = action.payload;
    },
    setSubstituteOptions: (state, action) => {
      state.substituteOptions = action.payload;
    },
    setAppointmentPays: (state, action) => {
      state.appointmentPays = action.payload;
    },
    setAppointmentBonus: (state, action) => {
      state.appointmentBonus = action.payload;
    },
    setSalesBonus: (state, action) => {
      state.salesBonus = action.payload;
    },
    setItemCommission: (state, action) => {
      state.itemCommission = action.payload;
    },
    setEmployeeTimesheets: (state, action) => {
      state.employeeTimesheets = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    updateItem(state, action) {
      const { option, item } = action.payload;
      if (state[option]) {
        const index = state[option].findIndex((i) => i._id === item._id);
        if (index !== -1) {
          state[option][index] = item;
        } else {
          state[option].unshift(item);
        }
      }
      if (option === "timesheets") {
        const index = state.employeeTimesheets.findIndex(
          (i) => i._id === item._id,
        );
        if (index !== -1) {
          state.employeeTimesheets[index] = item;
        } else {
          state.employeeTimesheets.push(item);
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
  setEmployees,
  setAvailability,
  setTimesheets,
  setJobTitles,
  setSubstituteOptions,
  setDepartments,
  setSecurityRoles,
  setReportSecurity,
  setEmployeeTimesheets,
  setNotes,
  setEmployeeCertificates,
  setEmployeeDepartments,
  setClassSetup,
  setAppointmentBonus,
  setAppointmentPays,
  updateItem,
  setSalesBonus,
  setItemCommission,
  setRequests,
  removeItem,
} = slice.actions;
export default slice.reducer;
