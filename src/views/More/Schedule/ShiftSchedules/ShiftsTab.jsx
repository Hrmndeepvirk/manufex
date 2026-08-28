import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredEmployees } from "@store/helper/helperActions";
import CustomFullCalendar from "@shared/calendar/CustomFullCalendar";
import { getDepartmentEmployeeShifts } from "@store/settings/employeeSetup/departmentEmployeeShiftActions";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import WeeklySummary from "../../../../utils/WeeklySummary";
import ShiftDetailsDialog from "./ShiftDetailsDialog";

export default function ShiftsTab() {
  const calendarRef = useRef();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user?.profile);
  const departments = useSelector((state) => state.dropdown?.departments ?? []);
  const employees = useSelector((state) => state.dropdown?.employees ?? []);
  const filteredEmployees = useSelector(
    (state) => state.helper?.filteredEmployees ?? [],
  );

  const [filters, setFilters] = useState({ department: null, employee: null });
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [viewRange, setViewRange] = useState(null);

  const [shiftDialog, setShiftDialog] = useState({ open: false, shift: null });

  // Cache employee -> departments mapping
  const empDeptMapRef = useRef({});
  const initializedRef = useRef(false);
  const myDepartmentsRef = useRef(null);

  useEffect(() => {
    (filteredEmployees || []).forEach((emp) => {
      if (emp.departments?.length) {
        empDeptMapRef.current[emp._id] = emp.departments;
      }
    });
  }, [filteredEmployees]);

  // Fetch employees when department changes
  useEffect(() => {
    const params = {};
    if (filters.department) params.department = filters.department;
    dispatch(
      getFilteredEmployees(params, setLoading, (emps) => {
        if (filters.employee) {
          const stillExists = emps.some((e) => e._id === filters.employee);
          if (!stillExists) {
            setFilters((prev) => ({ ...prev, employee: null }));
          }
        }
      }),
    );
  }, [dispatch, filters.department]);

  // Fetch shifts when both department and employee are selected
  useEffect(() => {
    if (!filters.department || !filters.employee) {
      setShifts([]);
      return;
    }
    dispatch(
      getDepartmentEmployeeShifts(
        filters.department,
        filters.employee,
        setLoading,
        (all) => setShifts(all),
      ),
    );
  }, [dispatch, filters.department, filters.employee]);

  // Pre-select logged-in employee
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

  const setMyEmployee = () => {
    if (!profile?._id) return;
    const firstDept = myDepartmentsRef.current?.[0] || null;
    setFilters({ department: firstDept, employee: profile._id });
  };

  const employeeOptions = useMemo(() => {
    return (filteredEmployees || []).map((emp) => ({
      _id: emp._id,
      title: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
    }));
  }, [filteredEmployees]);

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
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "NA";
  }

  // --- Calendar handlers ---

  const formatShiftForCalendar = (shift) => {
    const start = `${shift.date}T${shift.startTime}`;
    const end = `${shift.date}T${shift.endTime}`;
    return {
      id: shift._id,
      title: shift.title,
      start,
      end,
      color: getColorByCondition(shift),
      extendedProps: {
        shiftId: shift._id,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        staffRequired: shift.staffRequired,
        assignedEmployees: shift.assignedEmployees,
        availability: shift.availability,
        note: shift.note,
        shiftKey: shift.shiftKey,
        minutes: shift.minutes,
        department: filters.department,
        departmentTitle: selectedDepartmentTitle,
      },
    };
  };

  const _shifts = useMemo(
    () => shifts.map((shift) => formatShiftForCalendar(shift)),
    [shifts, selectedDepartmentTitle, filters.department],
  );

  const onSelectEvent = (info) => {
    const { id, title, extendedProps } = info.event;
    setShiftDialog({
      open: true,
      shift: {
        _id: id,
        title,
        date: extendedProps.date,
        startTime: extendedProps.startTime,
        endTime: extendedProps.endTime,
        staffRequired: extendedProps.staffRequired,
        assignedEmployees: extendedProps.assignedEmployees,
        availability: extendedProps.availability,
        note: extendedProps.note,
        department: extendedProps.department,
        departmentTitle: extendedProps.departmentTitle,
      },
    });
  };

  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;
    return (
      <div
        style={{
          padding: "5px",
          fontSize: "0.85rem",
          lineHeight: 1.5,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "0.75rem" }}>
          <i
            className="pi pi-clock"
            style={{ marginLeft: "4px", fontSize: "0.75rem" }}
          />{" "}
          {eventInfo.timeText}
        </div>
        <div style={{ fontSize: "1rem", margin: "2px 0" }}>{title}</div>
        {extendedProps.note && (
          <div style={{ fontSize: "0.75rem" }}>Note: {extendedProps.note}</div>
        )}
      </div>
    );
  };

  const _shiftsForSummary = useMemo(() => {
    if (!shifts?.length || !employees?.length) return shifts;

    const employeeMap = new Map(employees.map((emp) => [String(emp._id), emp]));

    return shifts.map((shift) => ({
      ...shift,
      assignedEmployees: (shift.assignedEmployees || []).map((emp) => {
        const id = String(emp?._id || emp);
        return employeeMap.get(id) || emp;
      }),
    }));
  }, [shifts, employees]);

  return (
    <>
      <CustomCard title="Shift Schedule">
        <CustomDropdown
          name="department"
          data={filters}
          onChange={({ name, value }) =>
            setFilters((prev) => ({ ...prev, [name]: value }))
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
                  `${selectedEmployee?.firstName || ""} ${selectedEmployee?.lastName || ""}`.trim()}
              </span>
              <span className="text-600 text-sm">
                {selectedDepartmentTitle || "Department"}
              </span>
            </div>
          </div>
        )}
      </CustomCard>

      {filters.department && filters.employee && (
        <>
          <CustomCard title="Assigned Shifts">
            <div className="c-col-12">
              <CustomFullCalendar
                ref={calendarRef}
                loading={loading}
                selectable={false}
                editable={false}
                onEventClick={onSelectEvent}
                events={_shifts}
                eventContent={renderEventContent}
                datesSet={(info) =>
                  setViewRange({ start: info.start, end: info.end })
                }
              />
            </div>
          </CustomCard>
          <WeeklySummary shifts={_shiftsForSummary} viewRange={viewRange} />
        </>
      )}

      <ShiftDetailsDialog
        visible={shiftDialog.open}
        shift={shiftDialog.shift}
        onHide={() => setShiftDialog({ open: false, shift: null })}
      />
    </>
  );
}

function getColorByCondition(shift) {
  const { availability } = shift;
  if (availability === "preferred_and_available") return "#588157";
  if (availability === "not_preferred_but_available") return "#ffb703";
  if (availability === "on_leave") return "#219ebc";
  return "#dd2d4a";
}
