import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import { useServerTime } from "../../../hooks/useServerTime";
import CustomDropdown from "@inputs/CustomDropdown";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import { useDispatch } from "react-redux";
import {
  getCalendarEvent,
  repeatEvents,
} from "@store/calendar/calendarEventActions";
import { getEvent } from "@store/calendar/calendarActions";
import CustomTable from "@shared/table/CustomTable";
import { formatEnum } from "@utils/common";
import CustomInput from "@inputs/CustomInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import { WeekDays } from "@utils/dropdownConstants";
import { getRepetitiveEventData } from "../../../store/calendar/calendarEventActions";

export default function RepeatEventForm() {
  const { getServerDate } = useServerTime();
  const { id } = useParams();

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eventSetup, setEventSetup] = useState(null);

  const isRepeated =
    new URLSearchParams(location.search).get("repeated") === "true";

  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [data, setData] = useState({
    eventMembers: [],
    employee: null,
    enrollment: "",
    startDate: "",
    endDate: "",
    duration: "",
    durationList: [],
    startTime: "",
    endTime: "",
    daily: true,
    days: [],
  });

  const TOTAL_WEEK_DAYS = WeekDays.length;

  const mapCalendarEventToForm = (res) => ({
    event: res.event,
    employee: res.employee,
    startTime: res.startTime,
    // startDate: res.eventDate,
    startDate: res.eventDate
      ? new Date(res.eventDate).toISOString().split("T")[0]
      : "",
    duration: res.duration?._id || res.duration,
    durationList: res?.eventDetails?.duration || [],
    enrollment: res.enrollment
      ? `${res.enrollment.current}/${res.enrollment.maximum}`
      : "",
    eventMembers: res.eventMembers || [],
  });

  const mapRepetitiveEventOverrides = (rep) => {
    const days = rep.days || [];

    return {
      employee: rep.employee ?? undefined, // override only if exists
      startDate: rep.startDate,
      endDate: rep.endDate,
      startTime: rep.startTime,
      duration: rep.duration,
      days,
      daily: days.length === TOTAL_WEEK_DAYS,
    };
  };
  useEffect(() => {
    if (!id) return;

    dispatch(
      getCalendarEvent(id, setPageLoading, (res) => {
        const baseData = mapCalendarEventToForm(res);

        // Set base data first
        setData((prev) => ({
          ...prev,
          ...baseData,
        }));

        // If repeated → fetch overrides
        if (isRepeated) {
          dispatch(
            getRepetitiveEventData(id, setScheduleLoading, (success, rep) => {
              if (!success || !rep) return;

              const overrides = mapRepetitiveEventOverrides(rep);

              setData((prev) => ({
                ...prev,
                ...overrides,
              }));
            }),
          );
        }
      }),
    );
  }, [id, isRepeated, dispatch]);

  // Fetch event setup to get level-filtered employees
  useEffect(() => {
    if (data.event) {
      dispatch(
        getEvent(data.event, null, (res) => {
          if (res) setEventSetup(res);
        }),
      );
    }
  }, [data.event]);

  // If current duration isn't in the list, default to first available
  useEffect(() => {
    if (!data.durationList?.length) return;
    const isValid = data.durationList.includes(data.duration);
    if (!isValid) {
      setData((prev) => ({ ...prev, duration: data.durationList[0] }));
    }
  }, [data.durationList]);

  useEffect(() => {
    if (data?.daily) {
      setData((prev) => ({
        ...prev,
        days: WeekDays.map((d) => d._id),
      }));
    }
  }, []);

  const handleChange = ({ name, value }) => {
    let updatedData = { ...data };

    // Daily checkbox toggled
    if (name === "daily") {
      updatedData.daily = value;
      updatedData.days = value ? WeekDays.map((d) => d._id) : [];
    }

    // Days multiselect changed
    else if (name === "days") {
      updatedData.days = value;
      updatedData.daily = value.length === TOTAL_WEEK_DAYS;
    }

    // Normal fields
    else {
      updatedData[name] = value;
    }

    const formErrors = formValidation(name, value, updatedData);
    setData({ ...updatedData, formErrors });
  };

  const memberColumns = [
    { field: "member", header: "Member" },
    { field: "status", header: "Status" },
    { field: "service", header: "Service" },
    { field: "verified", header: "Verified" },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => (
        <div className="flex gap-2 justify-content-center">
          <i
            className="pi pi-trash cursor-pointer "
            onClick={() => handleDeleteMember(rowData)}
            style={{ fontSize: "1.2rem" }}
            title="Delete Member"
          ></i>
        </div>
      ),
    },
  ];

  const durationOptions =
    data?.durationList?.map((item) => ({
      title: `${item} Minutes`,
      _id: item,
    })) || [];

  const mappedMembers = (data.eventMembers || []).map((m) => ({
    memberId: m.member?._id,
    member: m.member?.title || "-",
    status: formatEnum(m.status) || "-",
    service: m.serviceUsed?.title || "-",
    verified: m.isVerified ? "Yes" : "No",
  }));

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      repeatEvents(id, setSubmitLoading, data, (success) => {
        if (success) {
          navigate("/calendar");
        }
      }),
    );
  };

  return (
    <FormPageLayout
      backText="Calendar Event"
      submitLoading={submitLoading}
      onSubmit={handleSubmit}
      pageLoading={scheduleLoading}
    >
      <CustomCard title="Event Details">
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="employee"
          label="Employee / Staff"
          options={eventSetup?.employees}
        />

        <CustomInput name="enrollment" data={data} disabled />
      </CustomCard>

      <CustomTable
        minWidth="auto"
        columns={memberColumns}
        data={mappedMembers}
        loading={pageLoading}
      />

      <CustomCard title="Repetition Schedules">
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="startDate"
          minDate={getServerDate()}
          dateString
          required
        />

        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="endDate"
          dateString
          minDate={data.startDate ? new Date(data.startDate) : null}
          required
        />

        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="startTime"
          timeOnly
          required
        />

        <CustomDropdown
          name="duration"
          data={data}
          onChange={handleChange}
          required
          options={durationOptions}
        />

        <CustomMultiSelect
          name="days"
          onChange={handleChange}
          data={data}
          optionsType="WeekDays"
        />

        <CustomCheckbox
          name="daily"
          label="Repeat Daily"
          onChange={handleChange}
          data={data}
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
