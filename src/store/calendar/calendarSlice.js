import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scheduleSettings: null,
  membersList: [],
  calendarEvents: [],
  cachedRange: null,

  departments: [],
  employees: [],

  locationTypes: [],
  locations: [],

  resourceTypes: [],
  resources: [],

  quickViews: [],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setScheduleSettings(state, action) {
      state.scheduleSettings = action.payload;
    },
    setMembersList(state, action) {
      state.membersList = action.payload;
    },
    setCalendarEvents(state, action) {
      state.calendarEvents = action.payload;
    },
    appendCalendarEvents(state, action) {
      const incoming = action.payload || [];
      const seen = new Set(state.calendarEvents.map((e) => e._id));
      incoming.forEach((e) => {
        if (!seen.has(e._id)) state.calendarEvents.push(e);
      });
    },
    setCachedRange(state, action) {
      state.cachedRange = action.payload;
    },
    resetCalendarCache(state) {
      state.calendarEvents = [];
      state.cachedRange = null;
    },
    setEmployees(state, action) {
      state.employees = action.payload;
    },
    setDepartments(state, action) {
      state.departments = action.payload;
      state.employees = getUniqueEmployees(action.payload);
    },
    setLocationTypes(state, action) {
      state.locationTypes = action.payload;
      state.locations = action.payload.flatMap((res) => res.locations);
    },
    setResourceTypes(state, action) {
      state.resourceTypes = action.payload;
      state.resources = action.payload.flatMap((res) => res.resources);
    },
    setQuickViews(state, action) {
      state.quickViews = action.payload;
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
  setScheduleSettings,
  setMembersList,
  setCalendarEvents,
  appendCalendarEvents,
  setCachedRange,
  resetCalendarCache,
  setDepartments,
  setLocationTypes,
  setResourceTypes,
  setQuickViews,
  updateItem,
  removeItem,
} = calendarSlice.actions;

export default calendarSlice.reducer;

function getUniqueEmployees(data) {
  const map = new Map();

  data.forEach((dept) => {
    dept.employees.forEach((emp) => {
      if (!map.has(emp._id)) {
        map.set(emp._id, emp);
      }
    });
  });

  return Array.from(map.values());
}
