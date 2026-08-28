import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useServerTime } from "../../../../../hooks/useServerTime";
import moment from "moment";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomFullCalendar from "@shared/calendar/CustomFullCalendar";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomTextArea from "@inputs/CustomTextArea";
import FormPageLayout from "@shared/layout/FormPageLayout";
import { getFilteredEmployees } from "@store/helper/helperActions";
import {
  getDepartmentEmployeeShifts,
  updateEmployeeAvailability,
  copyEmployeeAvailability,
} from "@store/settings/employeeSetup/departmentEmployeeShiftActions";
import formValidation from "@utils/formValidations";
import { useResourceRequest } from "../../../../../hooks/useResourceRequest";

const availabilityOptions = [
  { title: "Preferred", _id: "preferred_and_available" },
  { title: "Not Preferred but Available", _id: "not_preferred_but_available" },
  { title: "Not Available", _id: "not_available" },
];

function ShiftAvailability() {
  const { getServerDate } = useServerTime();
  const calendarRef = React.useRef();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user?.profile);
  const departments = useSelector((state) => state.dropdown?.departments ?? []);
  const filteredEmployees = useSelector(
    (state) => state.helper?.filteredEmployees ?? [],
  );

  const [filters, setFilters] = useState({ department: null, employee: null });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [copyWeekModal, setCopyWeekModal] = useState(false);

  const initialState = { availability: "", note: "" };
  const [data, setData] = useState(initialState);

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
      getFilteredEmployees(params, setLoading, (employees) => {
        if (filters.employee) {
          const stillExists = employees.some((e) => e._id === filters.employee);
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

  function getShifts() {
    if (filters.department && filters.employee) {
      dispatch(
        getDepartmentEmployeeShifts(
          filters.department,
          filters.employee,
          setLoading,
          (all) => setShifts(all),
        ),
      );
    }
  }

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
        staffRequired: shift.staffRequired,
        assignedEmployees: shift.assignedEmployees,
        availability: shift.availability,
        note: shift.note,
        shiftKey: shift.shiftKey,
        minutes: shift.minutes,
      },
    };
  };

  const _shifts = useMemo(
    () => shifts.map((shift) => formatShiftForCalendar(shift)),
    [shifts],
  );

  const onCloseModal = () => {
    setModalIsOpen(false);
    setTimeout(() => setData(initialState), 300);
  };

  const onSelectEvent = (info) => {
    const { id, title, start, end, extendedProps } = info.event;
    setData({
      id,
      title,
      start,
      end,
      dayOfWeek: start.getDay(),
      availability: extendedProps.availability || "",
      note: extendedProps.note || "",
    });
    setModalIsOpen(true);
  };

  const onAddOrUpdateShift = () => {
    if (!data?.id) return;
    const payload = {
      availability: data.availability,
      note: data.note,
      employee: filters.employee,
    };
    dispatch(
      updateEmployeeAvailability(
        data.id,
        payload,
        setSubmitLoading,
        (newShift) => {
          const index = shifts.findIndex((shift) => shift._id === data.id);
          if (index !== -1) {
            setShifts((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                availability: payload.availability,
                note: payload.note,
              };
              return updated;
            });
          }
          onCloseModal();
        },
      ),
    );
  };

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString();
  const getDayName = (dayIndex) =>
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayIndex];

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

  // --- Copy Week ---

  const onOpenCopyWeek = () => {
    setCopyWeekModal(true);
    const calendarApi = calendarRef?.current?.getApi();
    const currentEnd = calendarApi?.view?.currentEnd;
    setData({
      copyBy: "shiftKey",
      replaceFrom: currentEnd,
      replaceTo: new Date(moment(currentEnd).add(6, "days")),
    });
  };

  const onCloseCopyWeek = () => {
    setCopyWeekModal(false);
    setTimeout(() => setData(initialState), 300);
  };

  const handleCopyWeek = (e) => {
    e.preventDefault();
    const calendarApi = calendarRef?.current?.getApi();
    const view = calendarApi?.view;
    const startDate = moment(view?.currentStart).format("YYYY-MM-DD");
    const endDate = moment(view?.currentEnd)
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const replaceFrom = moment(data.replaceFrom).format("YYYY-MM-DD");
    const replaceTo = moment(data.replaceTo).format("YYYY-MM-DD");

    dispatch(
      copyEmployeeAvailability(
        filters.department,
        {
          startDate,
          endDate,
          replaceFrom,
          replaceTo,
          employeeId: filters.employee,
        },
        setSubmitLoading,
        () => {
          getShifts();
          onCloseCopyWeek();
        },
      ),
    );
  };

  const { buttons: availabilityRequestButtons } = useResourceRequest({
    permission: "REQUEST-AVAILABILITY-ALL",
    targetCollection: "SHIFT_AVAILABILITY",
    id: data?.id,
    data,
    setData,
    buildChangedData: (d) => ({
      availability: d.availability,
      note: d.note,
    }),
  });

  return (
    <>
      <FormPageLayout backText="Schedule" hideCancel>
        <CustomCard title="Shift Availability">
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
          <div className="c-col-3"></div>
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
          <CustomCard
            title="Shift Planner"
            headers={
              <div
                className="py-1 px-3 border-400 border-round-md border-1 cursor-pointer text-white"
                onClick={onOpenCopyWeek}
              >
                Copy Week
              </div>
            }
          >
            <div className="c-col-12">
              <CustomFullCalendar
                ref={calendarRef}
                loading={loading}
                selectable={false}
                editable={false}
                onEventClick={onSelectEvent}
                events={_shifts}
                eventContent={renderEventContent}
              />
            </div>
          </CustomCard>
        )}
      </FormPageLayout>

      <CustomDialog
        visible={modalIsOpen}
        onHide={onCloseModal}
        title={`Availability for ${data?.title}`}
      >
        <CustomForm
          onSubmit={onAddOrUpdateShift}
          submitLoading={submitLoading}
          onCancel={onCloseModal}
          buttons={availabilityRequestButtons}
        >
          <CustomDropdown
            data={data}
            name="availability"
            options={availabilityOptions}
            onChange={handleChange}
            col={12}
            required
          />
          <CustomTextArea
            data={data}
            name="note"
            onChange={handleChange}
            col={12}
          />
          <div className="c-col-12">
            <div className="flex justify-content-between">
              <div>Start Time: {formatTime(data.start)}</div>
              <div>End Time: {formatTime(data.end)}</div>
            </div>
            <div>Weekday: {getDayName(data.dayOfWeek)}</div>
          </div>
        </CustomForm>
      </CustomDialog>

      <CustomDialog
        visible={copyWeekModal}
        onHide={onCloseCopyWeek}
        title="Copy Current Week Shifts"
      >
        <CustomForm
          onSubmit={handleCopyWeek}
          submitLoading={submitLoading}
          onCancel={onCloseCopyWeek}
        >
          <CustomCalendarInput
            data={data}
            name="replaceFrom"
            onChange={handleChange}
            col={12}
            minDate={getServerDate()}
          />
          <CustomCalendarInput
            data={data}
            name="replaceTo"
            onChange={handleChange}
            col={12}
            minDate={data?.replaceFrom}
          />
        </CustomForm>
      </CustomDialog>
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

export default memo(ShiftAvailability);
