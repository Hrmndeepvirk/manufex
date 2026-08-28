import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { getFilteredEmployees } from "@store/helper/helperActions";
import {
  getEmployeeAvailability,
  saveEmployeeAvailability,
  repeatWeekAvailability,
} from "@store/more/schedule/employeeAvailabilityActions";
import FormPageLayout from "@shared/layout/FormPageLayout";
import {
  BlockedReasonOptions,
  timeOptionsPerHalfHourInterval,
  WeekDays,
} from "@utils/dropdownConstants";
import HorizontalWeeklySkeleton from "@shared/skeletons/HorizontalWeeklySkeleton";

const DAY_NAMES = WeekDays?.map((d) => d._id);

function getEmptyWeekSlots() {
  return Array.from({ length: 7 }, () => ({
    availability: [],
    blocked: [],
  }));
}

function buildSlotsByWeekFromBackend(schedules) {
  const result = {};
  (schedules || []).forEach((schedule) => {
    const weekKey = moment(schedule.date).startOf("week").format("YYYY-MM-DD");
    if (!result[weekKey]) {
      result[weekKey] = getEmptyWeekSlots();
    }
    const dayIndex = new Date(schedule.date).getDay();

    (schedule.availableSlots || []).forEach((slot) => {
      result[weekKey][dayIndex].availability.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        appointments: (slot.appointments || []).map(String),
        classes: (slot.classes || []).map(String),
      });
    });

    (schedule.blockedSlots || []).forEach((slot) => {
      result[weekKey][dayIndex].blocked.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        type: slot.type || "OTHER",
        note: slot.note || "",
      });
    });
  });
  return result;
}

function buildSavePayload(employeeId, slotsByWeek, weekKey) {
  const weekSlots = slotsByWeek[weekKey] || getEmptyWeekSlots();
  const baseDate = moment(weekKey).startOf("week");

  const days = weekSlots.map((daySlot, dayIndex) => {
    const date = moment(baseDate).add(dayIndex, "days").format("YYYY-MM-DD");
    return {
      date,
      day: DAY_NAMES[dayIndex],
      availableSlots: (daySlot.availability || []).map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        appointments: slot.appointments || [],
        classes: slot.classes || [],
      })),
      blockedSlots: (daySlot.blocked || []).map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        type: slot.type || "OTHER",
        note: slot.note || "",
      })),
    };
  });

  return { employeeId, days };
}

function CalendarAvailability() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user?.profile);

  const [filters, setFilters] = useState({ department: null, employee: null });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [repeatWeekLoading, setRepeatWeekLoading] = useState(false);
  const [weekStart, setWeekStart] = useState(moment().startOf("week"));
  const [slotsByWeek, setSlotsByWeek] = useState({});
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const [repeatEndDate, setRepeatEndDate] = useState(null);

  const filteredEmployees = useSelector(
    (state) => state.helper?.filteredEmployees ?? [],
  );
  const departments = useSelector((state) => state.dropdown?.departments ?? []);

  // Fetch employees when department changes
  useEffect(() => {
    const params = {};
    if (filters.department) params.department = filters.department;
    dispatch(
      getFilteredEmployees(params, setLoading, (employees) => {
        // If an employee is selected, retain them only if they exist in the new list
        if (filters.employee) {
          const stillExists = employees.some((e) => e._id === filters.employee);
          if (!stillExists) {
            setFilters((prev) => ({ ...prev, employee: null }));
          }
        }
      }),
    );
  }, [dispatch, filters.department]);

  // Fetch availability when employee changes
  useEffect(() => {
    if (!filters.employee) {
      setSlotsByWeek({});
      return;
    }
    dispatch(
      getEmployeeAvailability(filters.employee, {}, setLoading, (schedules) => {
        setSlotsByWeek(buildSlotsByWeekFromBackend(schedules));
      }),
    );
  }, [dispatch, filters.employee]);

  // Pre-select logged-in employee on page load
  const initializedRef = useRef(false);
  const myDepartmentsRef = useRef(null);

  // Cache employee -> departments mapping (since dept-filtered API doesn't return departments)
  const empDeptMapRef = useRef({});
  useEffect(() => {
    (filteredEmployees || []).forEach((emp) => {
      if (emp.departments?.length) {
        empDeptMapRef.current[emp._id] = emp.departments;
      }
    });
  }, [filteredEmployees]);

  const setMyEmployee = () => {
    if (!profile?._id) return;
    const firstDept = myDepartmentsRef.current?.[0] || null;
    setFilters({ department: firstDept, employee: profile._id });
  };

  useEffect(() => {
    if (initializedRef.current) return;
    if (!profile?._id || !filteredEmployees?.length) return;
    const emp = filteredEmployees.find((e) => e._id === profile._id);
    if (emp?.departments?.length) {
      myDepartmentsRef.current = emp.departments;
      setFilters({ department: emp.departments[0], employee: profile._id });
      initializedRef.current = true;
    }
  }, [profile, filteredEmployees]);

  const employeeOptions = useMemo(() => {
    return (filteredEmployees || []).map((emp) => ({
      _id: emp._id,
      title: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
    }));
  }, [filteredEmployees]);

  // Filter departments based on selected employee (bidirectional filtering)
  const departmentOptions = useMemo(() => {
    if (!filters.employee) return departments || [];
    const cachedDepts = empDeptMapRef.current[filters.employee];
    if (cachedDepts?.length) {
      return (departments || []).filter((dept) =>
        cachedDepts.includes(dept._id),
      );
    }
    return departments || [];
  }, [departments, filters.employee]);

  const selectedEmployee = useMemo(() => {
    if (!filters.employee) return null;
    return (filteredEmployees || []).find(
      (emp) => emp._id === filters.employee,
    );
  }, [filteredEmployees, filters.employee]);

  const appointmentServiceOptions = useMemo(() => {
    return selectedEmployee?.appointments || [];
  }, [selectedEmployee]);

  const classServiceOptions = useMemo(() => {
    return selectedEmployee?.classes || [];
  }, [selectedEmployee]);

  const weekLabel = useMemo(() => {
    const start = moment(weekStart);
    const end = moment(weekStart).add(6, "days");
    return `${start.format("MMMM D")} - ${end.format("MMMM D, YYYY")}`;
  }, [weekStart]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days")),
    [weekStart],
  );

  const currentWeekKey = useMemo(
    () => moment(weekStart).format("YYYY-MM-DD"),
    [weekStart],
  );

  const slotsByDay = useMemo(() => {
    return slotsByWeek[currentWeekKey] || getEmptyWeekSlots();
  }, [slotsByWeek, currentWeekKey]);

  const addSlot = (dayIndex) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        availability: [
          ...(next[dayIndex]?.availability || []),
          {
            startTime: "09:00",
            endTime: "17:00",
            appointments: [],
            classes: [],
          },
        ],
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  const addBlockedSlot = (dayIndex) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        blocked: [
          ...(next[dayIndex]?.blocked || []),
          {
            startTime: "12:00",
            endTime: "13:00",
            type: "MEETING",
            note: "",
          },
        ],
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  const removeAvailabilitySlot = (dayIndex, slotIndex) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        availability: (next[dayIndex]?.availability || []).filter(
          (_, i) => i !== slotIndex,
        ),
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  const removeBlockedSlot = (dayIndex, slotIndex) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        blocked: (next[dayIndex]?.blocked || []).filter(
          (_, i) => i !== slotIndex,
        ),
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  // Shift the other time by 1 hour to ensure endTime > startTime
  const adjustTimeSlot = (slot, updates) => {
    const merged = { ...slot, ...updates };
    if (merged.startTime >= merged.endTime) {
      if (updates.endTime) {
        // User changed endTime — push startTime 1 hour back
        const [h, m] = updates.endTime.split(":").map(Number);
        merged.startTime = `${String(Math.max(h - 1, 0)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      } else if (updates.startTime) {
        // User changed startTime — push endTime 1 hour forward
        const [h, m] = updates.startTime.split(":").map(Number);
        merged.endTime = `${String(Math.min(h + 1, 23)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }
    }
    return merged;
  };

  const updateAvailabilitySlot = (dayIndex, slotIndex, updates) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        availability: (next[dayIndex]?.availability || []).map((slot, i) =>
          i === slotIndex ? adjustTimeSlot(slot, updates) : slot,
        ),
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  const updateBlockedSlot = (dayIndex, slotIndex, updates) => {
    setSlotsByWeek((prev) => {
      const current = prev[currentWeekKey] || getEmptyWeekSlots();
      const next = [...current];
      next[dayIndex] = {
        ...next[dayIndex],
        blocked: (next[dayIndex]?.blocked || []).map((slot, i) =>
          i === slotIndex ? adjustTimeSlot(slot, updates) : slot,
        ),
      };
      return { ...prev, [currentWeekKey]: next };
    });
  };

  const handleSave = () => {
    if (!filters.employee) return;
    const payload = buildSavePayload(
      filters.employee,
      slotsByWeek,
      currentWeekKey,
    );
    dispatch(saveEmployeeAvailability(payload, setSaving));
  };

  const handleRepeatWeek = (e) => {
    e.preventDefault();
    if (!repeatEndDate || !filters.employee) return;

    const sourceStartDate = moment(weekStart).format("YYYY-MM-DD");
    const sourceEndDate = moment(weekStart).add(6, "days").format("YYYY-MM-DD");
    const targetEnd = moment(repeatEndDate).format("YYYY-MM-DD");

    dispatch(
      repeatWeekAvailability(
        filters.employee,
        { sourceStartDate, sourceEndDate, targetEndDate: targetEnd },
        setRepeatWeekLoading,
        () => {
          dispatch(
            getEmployeeAvailability(filters.employee, {}, null, (schedules) => {
              setSlotsByWeek(buildSlotsByWeekFromBackend(schedules));
            }),
          );
          setRepeatDialogOpen(false);
          setRepeatEndDate(null);
        },
      ),
    );
  };

  const TIME_OPTIONS = useMemo(() => timeOptionsPerHalfHourInterval(), []);

  const selectedDepartmentTitle = useMemo(() => {
    if (!filters.department) return "";
    return (
      departmentOptions.find((dept) => dept._id === filters.department)
        ?.title || ""
    );
  }, [departmentOptions, filters.department]);

  function getInitials(employee) {
    const first = employee?.firstName || employee?.title?.split(" ")[0] || "";
    const last = employee?.lastName || employee?.title?.split(" ")[1] || "";
    const initials = `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
    return initials || "NA";
  }

  return (
    <>
      {/* REPETITION DIALOG */}
      <CustomDialog
        visible={repeatDialogOpen}
        onHide={() => setRepeatDialogOpen(false)}
        title="Repeat Week Availability"
      >
        <CustomForm
          onSubmit={handleRepeatWeek}
          submitLabel="Repeat"
          submitLoading={repeatWeekLoading}
          onCancel={() => setRepeatDialogOpen(false)}
        >
          <CustomCalendarInput
            name="repeatEndDate"
            value={repeatEndDate}
            onChange={({ value }) => setRepeatEndDate(value)}
            dateString
            required
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      {/* ACTUAL RETURN */}

      <FormPageLayout backText={"Schedule"} hideCancel>
        <CustomCard title="Employee Availability">
          <CustomDropdown
            name="department"
            data={filters}
            onChange={({ name, value }) =>
              setFilters((prev) => ({
                ...prev,
                [name]: value,
              }))
            }
            col={3}
            options={departmentOptions}
            clearable
            hideLabel
          />

          <CustomDropdown
            name="employee"
            data={filters}
            onChange={({ name, value }) => {
              if (!value) {
                setFilters((prev) => ({ ...prev, employee: null }));
                return;
              }
              const empDepts = empDeptMapRef.current[value] || [];
              setFilters((prev) => ({
                ...prev,
                employee: value,
                department:
                  prev.department && empDepts.includes(prev.department)
                    ? prev.department
                    : empDepts[0] || prev.department,
              }));
            }}
            col={3}
            options={employeeOptions}
            placeholder="Select Employee"
            clearable
            hideLabel
          />

          <div className="c-col-3">
            <PrimaryButton
              label="Use My Employee"
              severity="secondary"
              icon="pi pi-user"
              onClick={setMyEmployee}
            />
          </div>
          {selectedEmployee && (
            <div className="flex align-items-end justify-content-end gap-2 c-col-3">
              <div
                className="border-circle bg-primary text-white flex align-items-center justify-content-center font-semibold"
                style={{ width: "36px", height: "36px" }}
              >
                {getInitials(selectedEmployee)}
              </div>
              <div className="flex flex-column">
                <span className="font-semibold">
                  {selectedEmployee?.title ||
                    `${selectedEmployee?.firstName || ""} ${
                      selectedEmployee?.lastName || ""
                    }`.trim()}
                </span>
                <span className="text-600 text-sm">
                  {selectedDepartmentTitle || "Department"}
                </span>
              </div>
            </div>
          )}
        </CustomCard>

        {filters.employee && (
          <CustomCard title="Add Shifts">
            <div className="c-col-12 flex align-items-center justify-content-between">
              <div className="flex align-items-center gap-4">
                <PrimaryButton
                  icon="pi pi-chevron-left"
                  severity="secondary"
                  onClick={() =>
                    setWeekStart(moment(weekStart).subtract(7, "days"))
                  }
                />
                <div className="font-semibold">{weekLabel}</div>
                <PrimaryButton
                  icon="pi pi-chevron-right"
                  severity="secondary"
                  onClick={() => setWeekStart(moment(weekStart).add(7, "days"))}
                />
              </div>
              <div className="flex gap-2">
                <PrimaryButton
                  icon="pi pi-copy"
                  label="Repeat Week"
                  severity="secondary"
                  onClick={() => setRepeatDialogOpen(true)}
                />
                <PrimaryButton
                  icon="pi pi-save"
                  label="Save Availability"
                  severity="secondary"
                  loading={saving}
                  onClick={handleSave}
                />
              </div>
            </div>

            <div className="c-col-12 flex flex-column gap-2">
              {loading ? (
                <HorizontalWeeklySkeleton />
              ) : (
                days.map((day, dayIndex) => {
                  const daySlots = slotsByDay[dayIndex] || {
                    availability: [],
                    blocked: [],
                  };
                  const availabilitySlots = daySlots.availability || [];
                  const blockedSlots = daySlots.blocked || [];
                  return (
                    <div
                      key={day.format("YYYY-MM-DD")}
                      className="border-1 border-round-lg p-3 surface-0 calendar-availaility-day"
                    >
                      <div className="flex align-items-center justify-content-between">
                        <div className="flex flex-column gap-1">
                          <div className="day">{day.format("dddd")}</div>
                          <div className="">{day.format("MMMM D")}</div>
                        </div>
                        <div className="flex gap-2">
                          <PrimaryButton
                            icon="pi pi-plus"
                            label="Add Slot"
                            severity="secondary"
                            onClick={() => addSlot(dayIndex)}
                          />
                          <PrimaryButton
                            icon="pi pi-ban"
                            label="Add Blocked Time"
                            severity="secondary"
                            onClick={() => addBlockedSlot(dayIndex)}
                          />
                        </div>
                      </div>

                      {availabilitySlots.length === 0 ? (
                        <div className="text-600 text-sm mt-2">
                          Not Available
                        </div>
                      ) : (
                        <div className="mt-2 flex flex-column gap-2">
                          {availabilitySlots.map((slot, slotIndex) => (
                            <div
                              key={`${dayIndex}-${slotIndex}`}
                              className="flex align-items-center gap-2 flex-wrap border-1 border-gray-300 border-round-md p-2 surface-50"
                            >
                              <select
                                className="p-inputtext p-component"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateAvailabilitySlot(dayIndex, slotIndex, {
                                    startTime: e.target.value,
                                  })
                                }
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option
                                    key={`start-${t.value}`}
                                    value={t.value}
                                  >
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                              <span className="text-600">to</span>
                              <select
                                className="p-inputtext p-component"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateAvailabilitySlot(dayIndex, slotIndex, {
                                    endTime: e.target.value,
                                  })
                                }
                              >
                                {TIME_OPTIONS.map((t) => (
                                  <option
                                    key={`end-${t.value}`}
                                    value={t.value}
                                  >
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                              <CustomMultiSelect
                                value={slot.appointments || []}
                                onChange={({ value }) =>
                                  updateAvailabilitySlot(dayIndex, slotIndex, {
                                    appointments: value || [],
                                  })
                                }
                                options={appointmentServiceOptions}
                                name={`appointments-${dayIndex}-${slotIndex}`}
                                placeholder="Select Appointments"
                                hideLabel
                              />
                              <CustomMultiSelect
                                value={slot.classes || []}
                                onChange={({ value }) =>
                                  updateAvailabilitySlot(dayIndex, slotIndex, {
                                    classes: value || [],
                                  })
                                }
                                options={classServiceOptions}
                                name={`classes-${dayIndex}-${slotIndex}`}
                                placeholder="Select Classes"
                                hideLabel
                              />
                              <PrimaryButton
                                icon="pi pi-trash"
                                severity="secondary"
                                onClick={() =>
                                  removeAvailabilitySlot(dayIndex, slotIndex)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="text-600 text-sm mb-2">
                          Blocked Time (overrides availability)
                        </div>
                        {blockedSlots.length === 0 ? (
                          <div className="text-600 text-sm">
                            No blocked time
                          </div>
                        ) : (
                          <div className="flex flex-column gap-2">
                            {blockedSlots.map((slot, slotIndex) => (
                              <div
                                key={`blocked-${dayIndex}-${slotIndex}`}
                                className="flex align-items-center gap-2 flex-wrap border-1 border-gray-300 border-round-md p-2 surface-50"
                              >
                                <select
                                  className="p-inputtext p-component"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateBlockedSlot(dayIndex, slotIndex, {
                                      startTime: e.target.value,
                                    })
                                  }
                                >
                                  {TIME_OPTIONS.map((t) => (
                                    <option
                                      key={`b-start-${t.value}`}
                                      value={t.value}
                                    >
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                                <span className="text-600">to</span>
                                <select
                                  className="p-inputtext p-component"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateBlockedSlot(dayIndex, slotIndex, {
                                      endTime: e.target.value,
                                    })
                                  }
                                >
                                  {TIME_OPTIONS.map((t) => (
                                    <option
                                      key={`b-end-${t.value}`}
                                      value={t.value}
                                    >
                                      {t.label}
                                    </option>
                                  ))}
                                </select>
                                <CustomDropdown
                                  value={slot.type}
                                  onChange={({ value }) =>
                                    updateBlockedSlot(dayIndex, slotIndex, {
                                      type: value,
                                    })
                                  }
                                  options={BlockedReasonOptions}
                                  name={`type-${dayIndex}-${slotIndex}`}
                                  placeholder="Reason"
                                  hideLabel
                                />
                                <input
                                  className="p-inputtext p-component"
                                  placeholder="Note"
                                  value={slot.note || ""}
                                  onChange={(e) =>
                                    updateBlockedSlot(dayIndex, slotIndex, {
                                      note: e.target.value,
                                    })
                                  }
                                />
                                <PrimaryButton
                                  icon="pi pi-trash"
                                  severity="secondary"
                                  onClick={() =>
                                    removeBlockedSlot(dayIndex, slotIndex)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CustomCard>
        )}
      </FormPageLayout>
    </>
  );
}

export default memo(CalendarAvailability);
