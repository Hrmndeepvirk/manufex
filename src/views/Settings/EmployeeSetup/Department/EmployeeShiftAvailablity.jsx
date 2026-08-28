import React, { useEffect, useMemo, useState } from "react";
import { useServerTime } from "../../../../hooks/useServerTime";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomFullCalendar from "../../../../shared/calendar/CustomFullCalendar";
import CustomCard from "../../../../shared/cards/CustomCard";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomDialog from "../../../../shared/overlays/CustomDialog";
import CustomForm from "../../../../shared/inputs/CustomForm";
import formValidation from "../../../../utils/formValidations";
import moment from "moment";
import CustomCalendarInput from "../../../../shared/inputs/CustomCalendarInput";
import CustomDropdown from "../../../../shared/inputs/CustomDropdown";
import {
  getDepartmentEmployeeShifts,
  updateEmployeeAvailability,
  copyEmployeeAvailability,
} from "../../../../store/settings/employeeSetup/departmentEmployeeShiftActions";
import CustomTextArea from "../../../../shared/inputs/CustomTextArea";

export default function EmployeeShiftAvailablity() {
  const { getServerDate } = useServerTime();
  const calendarRef = React.useRef();
  const initialState = {
    availability: "",
    note: "",
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [data, setData] = useState(initialState);
  const [data1, setData1] = useState({ employee: "", department: id });
  let { department, employee } = data1;

  const handleChange1 = ({ name, value }) => {
    const formErrors = formValidation(name, value, data1);
    setData1((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  useEffect(() => {
    getShifts();
  }, [dispatch, department, employee]);

  function getShifts() {
    if (department && employee) {
      dispatch(
        getDepartmentEmployeeShifts(department, employee, setLoading, (all) => {
          setShifts(all);
        })
      );
    }
  }

  const onCloseModal = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      setData(initialState);
    }, 300);
  };

  const onSelectEvent = (info) => {
    const id = info.event.id;
    const title = info.event.title;
    const start = info.event.start;
    const end = info.event.end;
    const dayOfWeek = start.getDay();
    const availability = info.event.extendedProps.availability || "";
    const note = info.event.extendedProps.note || "";

    setData({
      id,
      title,
      start,
      end,
      dayOfWeek,
      availability,
      note,
    });
    setModalIsOpen(true);
  };

  const onAddOrUpdateShift = () => {
    if (data?.id) {
      let payload = {
        availability: data.availability,
        note: data.note,
        employee,
      };
      dispatch(
        updateEmployeeAvailability(
          data?.id,
          payload,
          setSubmitLoading,
          (newShift) => {
            let index = shifts.findIndex((shift) => shift._id === data.id);
            if (index !== -1) {
              setShifts((prev) => {
                let updatedShifts = [...prev];
                updatedShifts[index]["availability"] = payload.availability;
                updatedShifts[index]["note"] = payload.note;
                return updatedShifts;
              });
            }
            onCloseModal();
          }
        )
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
        availability: shift.availability,
        note: shift.note,
        shiftKey: shift.shiftKey,
        minutes: shift.minutes,
      },
    };
  };
  const _shifts = useMemo(() => {
    return shifts.map((shift) => formatShiftForCalendar(shift));
  }, [shifts]);

  const renderEventContent = (eventInfo) => {
    const { title, start, end, id, extendedProps } = eventInfo.event;

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
      employeeId: employee,
    };

    dispatch(
      copyEmployeeAvailability(
        department,
        payload,
        setSubmitLoading,
        (newShifts) => {
          getShifts();
          onCloseCopyWeek();
        }
      )
    );
  };

  const availabilityOptions = [
    { title: "Preferred", _id: "preferred_and_available" },
    {
      title: "Not Preferred but Available",
      _id: "not_preferred_but_available",
    },
    { title: "Not Available", _id: "not_available" },
  ];

  return (
    <FormPageLayout backText="Department" hideCancel>
      <CustomCard title="Employee Availablity Calendar">
        <CustomDropdown
          data={data1}
          onChange={handleChange1}
          name="department"
          optionsType="departments"
        />
        <CustomDropdown
          data={data1}
          onChange={handleChange1}
          name="employee"
          optionsType="employees"
        />
      </CustomCard>
      {employee && (
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
      <CustomDialog
        visible={modalIsOpen}
        onHide={onCloseModal}
        title={`Availability for ${data?.title}`}
      >
        <CustomForm
          onSubmit={onAddOrUpdateShift}
          submitLoading={submitLoading}
          onCancel={onCloseModal}
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
        title={"Copy Current Week Shifts"}
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
    </FormPageLayout>
  );
}
function getColorByCondition(shift) {
  let { availability } = shift;

  if (availability === "preferred_and_available") {
    return "#588157"; //Green
  }
  if (availability === "not_preferred_but_available") {
    return "#ffb703"; //yellow
  }
  if (availability === "on_leave") {
    return "#219ebc"; //blue
  }
  return "#dd2d4a";
  return "#ced4da"; // gray
}
