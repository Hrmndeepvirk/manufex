import React, { useEffect, useMemo, useState } from "react";
import { useServerTime } from "../../../../hooks/useServerTime";
import CustomFullCalendar from "../../../../shared/calendar/CustomFullCalendar";
import CustomCard from "../../../../shared/cards/CustomCard";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomDialog from "../../../../shared/overlays/CustomDialog";
import CustomForm from "../../../../shared/inputs/CustomForm";
import CustomInput from "../../../../shared/inputs/CustomInput";
import {
  addOrUpdateDepartmentShift,
  copyDepartmentShifts,
  copyDepartmentShiftsAssignment,
  deleteDepartmentShift,
  getDepartmentShifts,
} from "../../../../store/settings/employeeSetup/departmentShiftActions";
import formValidation, {
  showFormErrors,
} from "../../../../utils/formValidations";
import moment from "moment";
import { customConfirmDialog } from "../../../../shared/overlays/CustomConfirmDialog";
import CustomNumberInput from "../../../../shared/inputs/CustomNumberInput";
import CustomCalendarInput from "../../../../shared/inputs/CustomCalendarInput";
import CustomDropdown from "../../../../shared/inputs/CustomDropdown";
import CustomCheckbox from "../../../../shared/inputs/CustomCheckbox";
import CustomMultiSelect from "../../../../shared/inputs/CustomMultiSelect";
import FormPageLayout from "@shared/layout/FormPageLayout";
import WeeklySummary from "../../../../utils/WeeklySummary";

export default function ShiftCalendar() {
  const { getServerDate } = useServerTime();
  const calendarRef = React.useRef();
  const initialState = {
    title: "",
    start: "",
    end: "",
    dayOfWeek: "",
    staffRequired: 1,
    employees: [],
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignStaff, setAssignStaff] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [viewRange, setViewRange] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState(initialState);

  useEffect(() => {
    getShifts();
  }, [dispatch, id]);

  function getShifts() {
    dispatch(
      getDepartmentShifts(id, setLoading, (all) => {
        setShifts(all);
      }),
    );
  }

  const onCloseModal = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      setData(initialState);
    }, 300);
  };

  const onDragAndCreateEvent = (info) => {
    let start = info.start;
    let end = info.end;
    const minutes = Math.round((end - start) / (1000 * 60));
    start = new Date(info.start);
    setData({
      title: "",
      start: info.startStr,
      end: info.endStr,
      dayOfWeek: start.getDay(),
      staffRequired: 1,
      minutes,
      employees: [],
    });
    setModalIsOpen(true);
  };
  const onSelectEvent = (info) => {
    const id = info.event.id;
    const title = info.event.title;
    const staffRequired = info.event.extendedProps.staffRequired;
    const availableEmployees = info.event.extendedProps.availableEmployees;
    const start = info.event.start;
    const end = info.event.end;
    const dayOfWeek = start.getDay();
    const minutes = Math.round((end - start) / (1000 * 60));
    const employees =
      info.event.extendedProps.assignedEmployees.map(({ _id }) => _id) || [];
    setData({
      id,
      title,
      staffRequired,
      start,
      end,
      dayOfWeek,
      minutes,
      availableEmployees,
      employees,
    });
    setModalIsOpen(true);
  };
  const onMoveOrResizeEvent = (info) => {
    const id = info.event.id;
    const title = info.event.title;
    const start = info.event.start;
    const end = info.event.end;
    const dayOfWeek = start.getDay();
    const minutes = Math.round((end - start) / (1000 * 60));

    let payload = {
      title,
      startTime: moment(start).format("HH:mm"),
      endTime: moment(end).format("HH:mm"),
      date: moment(start).format("YYYY-MM-DD"),
      weekday: dayOfWeek,
      minutes: minutes,
      shiftKey: `${dayOfWeek}-${moment(start).format("HH:mm")}-${moment(
        end,
      ).format("HH:mm")}`,
    };

    dispatch(
      addOrUpdateDepartmentShift(
        id,
        payload,
        () => {},
        (newShift) => {
          setShifts((prev) => [...prev, newShift]);
        },
      ),
    );
  };

  const onAddOrUpdateShift = (e) => {
    e.preventDefault();
    let payload = {
      department: id,
      title: data.title,
      startTime: moment(data.start).format("HH:mm"),
      endTime: moment(data.end).format("HH:mm"),
      date: moment(data.start).format("YYYY-MM-DD"),
      weekday: data.dayOfWeek,
      staffRequired: data.staffRequired,
      minutes: data.minutes,
      shiftKey: `${data.dayOfWeek}-${moment(data.start).format(
        "HH:mm",
      )}-${moment(data.end).format("HH:mm")}`,
    };
    if (assignStaff) {
      payload.assignedEmployees = data.employees;
    }
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateDepartmentShift(
          data?.id,
          payload,
          setSubmitLoading,
          (newShift, formErrors) => {
            if (newShift) {
              setShifts((prev) => [...prev, newShift]);
              onCloseModal();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
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

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

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
        availableEmployees: shift.availableEmployees,
        shiftKey: shift.shiftKey,
        minutes: shift.minutes,
      },
    };
  };
  const _shifts = useMemo(() => {
    return shifts.map((shift) => formatShiftForCalendar(shift));
  }, [shifts]);

  const onDeleteShift = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    customConfirmDialog({
      title: "Are you sure you want to delete this shift?",
      accept: () => {
        dispatch(deleteDepartmentShift(id, () => {}));
        setShifts((prev) => prev.filter((shift) => shift._id !== id));
      },
      reject: () => {},
    });
  };

  const renderEventContent = (eventInfo) => {
    const { title, start, end, id, extendedProps } = eventInfo.event;
    const { assignedEmployees = [], staffRequired = 0 } = extendedProps;

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
        <div className="flex justify-content-between">
          <div style={{ fontWeight: "bold", fontSize: "0.75rem" }}>
            <i
              className="pi pi-clock"
              style={{ marginLeft: "4px", fontSize: "0.75rem" }}
            />{" "}
            {eventInfo.timeText}
          </div>
          {!assignStaff && (
            <i
              className="pi pi-trash"
              onClick={(e) => onDeleteShift(e, id)}
              style={{ marginLeft: "4px" }}
            />
          )}
        </div>

        <div style={{ fontSize: "1rem", margin: "2px 0" }}>{title}</div>
        <div style={{ fontSize: "0.8rem" }}>
          Assigned: ({assignedEmployees.length} / {staffRequired || 0})
        </div>
        {assignedEmployees.length > 0 && (
          <div style={{ marginTop: "4px" }}>
            <div style={{ fontSize: "0.75rem" }}>Assigned Employees:</div>
            {assignedEmployees.map((emp) => {
              // const conflict = hasConflict(shifts, emp._id, { ...extendedProps, start, end, id });
              return (
                <div
                  key={emp._id}
                  style={{ fontSize: "0.75rem", paddingLeft: "8px" }}
                >
                  • {emp.firstName} {emp.lastName}
                  {emp.conflict && (
                    <span
                      title={emp?.conflictMessage}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {emp?.availability === "" ? "⚠️" : "⚠️"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const [copyWeekModal, setCopyWeekModal] = useState(false);

  const onOpenCopyWeek = () => {
    setCopyWeekModal(true);
    const calendarApi = calendarRef?.current?.getApi();
    const view = calendarApi?.view;
    const currentEnd = view?.currentEnd;
    setData(() => ({
      copyBy: "shiftKey",
      replaceFrom: currentEnd,
      replaceTo: new Date(moment(currentEnd).add(6, "days")),
    }));
  };
  const onCloseCopyWeek = () => {
    setCopyWeekModal(false);
    setTimeout(() => {
      setData(initialState);
    }, 300);
  };

  const handleCopyWeek = (e) => {
    e.preventDefault();
    const calendarApi = calendarRef?.current?.getApi();
    const view = calendarApi?.view;
    const currentStart = view?.currentStart; // JS Date object
    const currentEnd = view?.currentEnd; // JS Date object
    const startDate = moment(currentStart).format("YYYY-MM-DD");
    const endDate = moment(currentEnd).subtract(1, "day").format("YYYY-MM-DD");
    const replaceFrom = moment(data.replaceFrom).format("YYYY-MM-DD");
    const replaceTo = moment(data.replaceTo).format("YYYY-MM-DD");

    let payload = {
      startDate,
      endDate,
      replaceFrom,
      replaceTo,
      keepExisting: data.keepExisting,
      keepAssignment: data.keepAssignment,
    };

    console.log(payload);

    if (assignStaff) {
      payload.copyBy = data.copyBy;
      dispatch(
        copyDepartmentShiftsAssignment(id, payload, setSubmitLoading, (all) => {
          getShifts();
          onCloseCopyWeek();
        }),
      );
    } else {
      dispatch(
        copyDepartmentShifts(id, payload, setSubmitLoading, (all) => {
          getShifts();
          onCloseCopyWeek();
        }),
      );
    }
  };

  const applySuggestion = (shift, candidate) => {
    const assignedIds = (shift.assignedEmployees || []).map((emp) =>
      String(emp?._id || emp),
    );
    if (assignedIds.includes(String(candidate.id))) return;

    customConfirmDialog({
      message: `Assign ${candidate.name} to "${shift.title}"?`,
      accept: () => {
        const payload = {
          department: id,
          title: shift.title,
          weekday: shift.weekday,
          startTime: shift.startTime,
          endTime: shift.endTime,
          minutes: shift.minutes,
          date: shift.date,
          shiftKey: shift.shiftKey,
          staffRequired: shift.staffRequired,
          assignedEmployees: [...assignedIds, candidate.id],
        };
        dispatch(
          addOrUpdateDepartmentShift(
            shift._id,
            payload,
            setSubmitLoading,
            (updatedShift) => {
              if (!updatedShift) return;
              setShifts((prev) =>
                prev.map((item) =>
                  item._id === updatedShift._id ? updatedShift : item,
                ),
              );
            },
          ),
        );
      },
    });
  };

  const applySwapSuggestion = (targetShift, swap) => {
    const assignedIds = (targetShift.assignedEmployees || [])
      .map((emp) => String(emp?._id || emp))
      .filter(Boolean);
    if (assignedIds.includes(String(swap.swapOutId))) return;
    customConfirmDialog({
      message: `Swap ${swap.swapOut.firstName} ${swap.swapOut.lastName} into "${targetShift.title}" and assign ${swap.replacement.name} to "${swap.otherShift.title}"?`,
      accept: () => {
        const targetPayload = {
          department: id,
          title: targetShift.title,
          weekday: targetShift.weekday,
          startTime: targetShift.startTime,
          endTime: targetShift.endTime,
          minutes: targetShift.minutes,
          date: targetShift.date,
          shiftKey: targetShift.shiftKey,
          staffRequired: targetShift.staffRequired,
          assignedEmployees: [...assignedIds, swap.swapOutId],
        };

        const otherAssignedIds = (swap.otherShift.assignedEmployees || [])
          .map((emp) => String(emp?._id || emp))
          .filter(Boolean)
          .filter((empId) => empId !== String(swap.swapOutId));
        const otherPayload = {
          department: id,
          title: swap.otherShift.title,
          weekday: swap.otherShift.weekday,
          startTime: swap.otherShift.startTime,
          endTime: swap.otherShift.endTime,
          minutes: swap.otherShift.minutes,
          date: swap.otherShift.date,
          shiftKey: swap.otherShift.shiftKey,
          staffRequired: swap.otherShift.staffRequired,
          assignedEmployees: [...otherAssignedIds, swap.replacement.id],
        };

        dispatch(
          addOrUpdateDepartmentShift(
            targetShift._id,
            targetPayload,
            setSubmitLoading,
            (updatedTarget) => {
              if (!updatedTarget) return;
              dispatch(
                addOrUpdateDepartmentShift(
                  swap.otherShift._id,
                  otherPayload,
                  setSubmitLoading,
                  (updatedOther) => {
                    if (!updatedOther) return;
                    setShifts((prev) =>
                      prev.map((item) => {
                        if (item._id === updatedTarget._id)
                          return updatedTarget;
                        if (item._id === updatedOther._id) return updatedOther;
                        return item;
                      }),
                    );
                  },
                ),
              );
            },
          ),
        );
      },
    });
  };

  const resourceOptionTemplate = (option) => {
    return (
      <div className="flex justify-content-between">
        <div
          className="my-auto mr-2"
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor:
              option.availability === "preferred_and_available"
                ? "#588157"
                : "#ffb703",
          }}
        ></div>
        <div>{option.title}</div>
      </div>
    );
  };

  return (
    <>
      <FormPageLayout backText="Department" hideCancel>
        <WeeklySummary
          shifts={shifts}
          viewRange={viewRange}
          onApplySuggestion={applySuggestion}
          onApplySwap={applySwapSuggestion}
        />

        <CustomCard
          title="Shift Calendar Settings"
          headers={
            <div className="flex gap-2">
              <div
                className="py-1 px-3 border-400 border-round-md border-1 cursor-pointer text-white"
                onClick={onOpenCopyWeek}
              >
                Copy Week
              </div>
              <div className="py-1 px-3 border-400 border-round-md border-1 cursor-pointer text-white">
                <label htmlFor="assign-staff">Assign Staff</label>
                <input
                  checked={assignStaff}
                  onChange={(e) => setAssignStaff(e.target.checked)}
                  className="my-auto"
                  type="checkbox"
                  id="assign-staff"
                />
              </div>
            </div>
          }
        >
          <div className="c-col-12">
            <CustomFullCalendar
              ref={calendarRef}
              loading={loading}
              selectable={!assignStaff}
              editable={!assignStaff}
              onSelect={!assignStaff && onDragAndCreateEvent}
              onEventClick={onSelectEvent}
              onEventDrop={!assignStaff && onMoveOrResizeEvent}
              onEventResize={!assignStaff && onMoveOrResizeEvent}
              events={_shifts}
              eventContent={renderEventContent}
              datesSet={(info) =>
                setViewRange({ start: info.start, end: info.end })
              }
            />
          </div>
        </CustomCard>
      </FormPageLayout>

      <CustomDialog
        visible={!assignStaff && modalIsOpen}
        onHide={onCloseModal}
        title={data?.id ? "Update Shift" : "Create Shift"}
      >
        <CustomForm
          onSubmit={onAddOrUpdateShift}
          submitLoading={submitLoading}
          onCancel={onCloseModal}
        >
          <CustomInput
            data={data}
            name="title"
            onChange={handleChange}
            col={12}
            required
          />
          <CustomNumberInput
            data={data}
            name="staffRequired"
            onChange={handleChange}
            col={12}
          />
          <div className="c-col-12 ">
            <div className="flex justify-content-between">
              <div>Start Time: {formatTime(data.start)}</div>
              <div>End Time: {formatTime(data.end)}</div>
            </div>
            <div>Weekday: {getDayName(data.dayOfWeek)}</div>
          </div>
        </CustomForm>
      </CustomDialog>

      <CustomDialog
        visible={assignStaff && modalIsOpen}
        onHide={onCloseModal}
        title={"Update Shift & Assign Staff"}
      >
        <CustomForm
          onSubmit={onAddOrUpdateShift}
          submitLoading={submitLoading}
          onCancel={onCloseModal}
        >
          <CustomMultiSelect
            data={data}
            name="employees"
            onChange={handleChange}
            options={
              data?.availableEmployees?.map((item) => ({
                title: item.firstName,
                _id: item.employee,
                availability: item?.availability,
              })) || []
            }
            maxSelected={data.staffRequired}
            itemTemplate={resourceOptionTemplate}
            col={12}
          />

          <div className="c-col-12 ">
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
        title={
          assignStaff
            ? "Copy Current Week Shifts Assignments"
            : "Copy Current Week Shifts"
        }
      >
        <CustomForm
          onSubmit={handleCopyWeek}
          submitLoading={submitLoading}
          onCancel={onCloseCopyWeek}
        >
          {assignStaff && (
            <CustomDropdown
              data={data}
              name="copyBy"
              label="Find Shifts Using"
              options={[
                { title: "Shift Time", _id: "shiftKey" },
                { title: "Shift Title", _id: "title" },
              ]}
              onChange={handleChange}
              col={12}
            />
          )}
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

          {!assignStaff && (
            <>
              <CustomCheckbox
                data={data}
                name="keepExisting"
                label="Keep the existing shifts?"
                onChange={handleChange}
                col={12}
              />
              <CustomCheckbox
                data={data}
                name="keepAssignment"
                label="Keep the employee assignment?"
                onChange={handleChange}
                col={12}
              />
            </>
          )}

          <div className="c-col-12 flex gap-1 ml-1 text-yellow-600 mt-2">
            <div>⚠</div>
            {assignStaff ? (
              <>
                <div>
                  Some staff members may be assigned to shifts where they are
                  not marked as available. This could lead to scheduling
                  conflicts. Please review assignments after copying to ensure
                  accuracy.
                </div>
              </>
            ) : (
              <>
                {data.keepExisting ? (
                  <div>
                    Existing shifts will be kept. This may cause overlapping
                    shifts for the same employees.
                  </div>
                ) : (
                  <div>
                    All existing shifts in the selected date range will be
                    deleted. Employees will need to re-mark their availability.
                  </div>
                )}
              </>
            )}
          </div>
        </CustomForm>
      </CustomDialog>
    </>
  );
}
function getColorByCondition(shift) {
  let { staffRequired, assignedEmployees = [] } = shift;

  // If no staff required or no assigned employees, return red
  if (staffRequired <= 0 || assignedEmployees.length === 0) {
    return "#dd2d4a"; //red
  }
  // If assigned employees match staff required, return green
  if (assignedEmployees.length === staffRequired) {
    return "#588157"; //Green
  }
  // If assigned employees are less than staff required, return yellow
  if (
    assignedEmployees.length > 0 &&
    assignedEmployees.length < staffRequired
  ) {
    return "#ffb703"; //yellow
  }
  // If assigned employees exceed staff required, return red
  // This case is redundant but kept for clarity
  if (
    assignedEmployees.length > 0 &&
    assignedEmployees.length > staffRequired
  ) {
    return "#219ebc"; //blue
  }
  return "#ced4da"; // gray
}
