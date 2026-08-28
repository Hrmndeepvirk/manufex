import React, { use, useEffect, useMemo, useState } from "react";
import { useServerTime } from "../../../hooks/useServerTime";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import {
  getEvent,
  getMembersList,
  getEmployeeDaySummary,
  getLocationDayEvents,
} from "@store/calendar/calendarActions";
import { getConflictWarnings } from "./ConflictMessages";
import UserProfile from "@shared/userCards/UserProfile";
import { addMinutes } from "@utils/dateTime";
import {
  requiredFieldsValidation,
  showFormErrors,
} from "@utils/formValidations";
import { addCalendarEvent } from "../../../store/calendar/calendarEventActions";

function EventForm({ visible, onHide, eventData, state, data, setData }) {
  const { getServerDate } = useServerTime();
  const dispatch = useDispatch();
  const eventSetups = useSelector((state) => state.dropdown.eventSetups);
  const membersList = useSelector((state) => state.calendar.membersList);
  const resourcesList = useSelector((state) => state.dropdown.resources);
  const locationList = useSelector((state) => state.dropdown.locations);
  const employeeList = useSelector((state) => state.dropdown.employees);

  const [offHoursWarning, setOffHoursWarning] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const [eventSetup, setEventSetup] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState(null);
  const [locationEvents, setLocationEvents] = useState(null);

  const retainSelected = (options = [], selected, key = "_id") => {
    if (!selected) return options;
    const exists = options.some((o) => o[key] === selected);
    return exists ? options : options;
  };

  const isValidSelection = (options = [], selected, key = "_id") => {
    if (!selected) return true;
    return options.some((o) => o[key] === selected);
  };

  const _employeeOptions = useMemo(() => {
    const opts =
      eventSetup === null ? employeeList : eventSetup?.employees || [];
    return retainSelected(opts, data.employee);
  }, [eventSetup, employeeList, data.employee]);

  const _locationOptions = useMemo(() => {
    const opts = eventSetup ? eventSetup.locations || [] : locationList || [];
    return retainSelected(opts, data.location);
  }, [eventSetup, locationList, data.location]);

  const _selectedMember = useMemo(
    () => membersList.find((m) => m._id === data.member),
    [membersList, data.member],
  );

  const _resourceOptions = useMemo(() => {
    if (!data.location || !resourcesList?.length) return [];

    return resourcesList.filter((res) =>
      res.locations?.some((loc) => loc._id === data.location) &&
      res.accessibility !== "SHOW_IN_CHECKIN",
    );
  }, [data.location, resourcesList]);

  useEffect(() => {
    if (!isValidSelection(_employeeOptions, data.employee)) {
      setData((p) => ({ ...p, employee: null }));
    }

    if (!isValidSelection(_locationOptions, data.location)) {
      setData((p) => ({ ...p, location: null }));
    }

    if (!isValidSelection(_resourceOptions, data.resource)) {
      setData((p) => ({ ...p, resource: null }));
    }
  }, [_employeeOptions, _locationOptions, _resourceOptions]);

  useEffect(() => {
    if (eventData) {
      setData((prev) => ({
        ...prev,
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        employee:
          eventData.resourceType === "employees" ? eventData.resource : null,
        resource:
          eventData.resourceType === "resources" ? eventData.resource : null,
        location:
          eventData.resourceType === "locations" ? eventData.resource : null,
      }));
      setOffHoursWarning(eventData.softWarning || false);
    }
  }, [eventData]);

  useEffect(() => {
    if (state) {
      setData((prev) => ({
        ...prev,
        member: state?.member || null,
      }));
    }
  }, [state]);

  useEffect(() => {
    dispatch(getMembersList(setMembersLoading));
  }, []);

  useEffect(() => {
    if (data.event) {
      dispatch(
        getEvent(data.event, setEventLoading, (res) => {
          if (res) {
            setEventSetup(res);
          }
        }),
      );
    }
  }, [data.event, eventSetups]);

  let requiredToCreate = useMemo(() => {
    let required = ["event", "eventDate", "startTime", "duration"];
    if (eventSetup) {
      required = [...required, ...(eventSetup.requiredToCreate || [])];
    }
    return required;
  }, [eventSetup]);

  function handleChange({ name, value }) {
    const formErrors = requiredFieldsValidation(
      name,
      value,
      data,
      requiredToCreate,
    );
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  }

  // useEffect(() => {
  //   if (data.event) {
  //     setData((prev) => ({
  //       ...prev,
  //       // employee: null,
  //       // resource: null,
  //       // location: null,
  //       // duration: null,
  //     }));
  //   }
  // }, [data.event]);

  const _eventSetupOptions = useMemo(() => {
    let options = eventSetups.filter((es) => es.eventType === data.eventType);

    if (data.eventCategory) {
      options = options.filter(
        (es) => String(es.eventCategory) === String(data.eventCategory),
      );
    }

    if (data.employee) {
      const emp = employeeList?.find((e) => e._id === data.employee);
      if (emp) {
        const empLevels =
          data.eventType === "APPOINTMENT"
            ? (emp.appointmentLevels || []).map(String)
            : (emp.classLevels || []).map(String);
        options = options.filter((es) =>
          (es.levels || []).some((lvl) => empLevels.includes(String(lvl))),
        );
      }
    }

    if (data.location) {
      const loc = locationList?.find((l) => l._id === data.location);
      if (loc?.locationType) {
        options = options.filter(
          (es) => String(es.locationType) === String(loc.locationType),
        );
      }
    }

    return options;
  }, [
    eventSetups,
    data.eventType,
    data.eventCategory,
    data.employee,
    data.location,
    employeeList,
    locationList,
  ]);

  useEffect(() => {
    if (data.event && !_eventSetupOptions.some((es) => es._id === data.event)) {
      setData((p) => ({ ...p, event: null }));
      setEventSetup(null);
    }
  }, [_eventSetupOptions]);

  const _durationOptions = useMemo(() => {
    if (eventSetup) {
      return eventSetup.duration.map((d) => ({
        title: `${d} minutes`,
        _id: d,
      }));
    }
    return [];
  }, [eventSetup]);

  useEffect(() => {
    if (eventSetup?.duration.length) {
      setData((prev) => ({ ...prev, duration: eventSetup?.duration[0] }));
    }
  }, [eventSetup]);

  useEffect(() => {
    if (eventSetup?.location) {
      setData((prev) => ({ ...prev, location: eventSetup?.location }));
    }
  }, [eventSetup]);

  const _endTime = useMemo(() => {
    if (data.startTime && data.duration) {
      return addMinutes(data.startTime, data.duration);
    }
    return null;
  }, [data.startTime, data.duration]);

  // Fetch employee day summary when employee + date are set
  useEffect(() => {
    if (data.employee && data.eventDate) {
      dispatch(
        getEmployeeDaySummary(data.employee, data.eventDate, null, (res) => {
          if (res) setEmployeeSummary(res);
        }),
      );
    } else {
      setEmployeeSummary(null);
    }
  }, [data.employee, data.eventDate]);

  // Fetch location day events when location + date are set
  useEffect(() => {
    if (data.location && data.eventDate) {
      dispatch(
        getLocationDayEvents(data.location, data.eventDate, null, (res) => {
          if (res) setLocationEvents(res);
        }),
      );
    } else {
      setLocationEvents(null);
    }
  }, [data.location, data.eventDate]);

  // Compute conflict warnings
  const conflictWarnings = useMemo(() => {
    return getConflictWarnings({
      employeeSummary,
      locationEvents,
      startTime: data.startTime,
      duration: data.duration,
      eventSetupId: data.event,
      eventType: data.eventType,
    });
  }, [
    employeeSummary,
    locationEvents,
    data.startTime,
    data.duration,
    data.event,
    data.eventType,
  ]);

  useEffect(() => {
    if (eventData?.businessHours && data.eventDate) {
      if (data.startTime) {
        const withinHours = isWithinBusinessHours(
          data.eventDate,
          data.startTime,
          eventData.businessHours,
        );
        setOffHoursWarning(!withinHours);
      }
      if (_endTime) {
        const withinHours = isWithinBusinessHours(
          data.eventDate,
          _endTime,
          eventData.businessHours,
        );
        setOffHoursWarning(!withinHours);
      }
    }
  }, [_endTime, data.startTime, data.eventDate, eventData?.businessHours]);

  const isRequired = (field) => {
    return eventSetup?.requiredToCreate?.includes(field);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, [], requiredToCreate)) {
      dispatch(
        addCalendarEvent(data, setLoading, (success, errors) => {
          if (success) {
            _onHide();
          } else {
            setData((prev) => ({ ...prev, formErrors: errors }));
          }
        }),
      );
    }
  };

  const _onHide = () => {
    setData((prev) => ({
      ...prev,
      // member: null,
      eventType: "APPOINTMENT",
      event: null,
      eventDate: null,
      startTime: null,
      duration: null,
      endTime: null,
      eventCategory: null,
      employee: null,
      resource: null,
      location: null,
    }));
    setEventSetup(null);
    setEmployeeSummary(null);
    setLocationEvents(null);
    onHide();
  };

  return (
    <CustomDialog
      title="Let's Schedule Your Event."
      visible={visible}
      onHide={_onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Book Now"
        submitLoading={loading}
        onCancel={_onHide}
      >
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="member"
          filter
          options={membersList}
          loading={membersLoading}
          required={isRequired("member")}
          col={12}
          clearable
        />
        {_selectedMember && (
          <div className="c-col-12">
            <UserProfile user={_selectedMember} />
          </div>
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="eventType"
          optionsType={"eventTypes"}
          col={5}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="eventCategory"
          optionsType={"eventCategories"}
          filter
          clearable
          col={7}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="event"
          options={_eventSetupOptions}
          required
          col={12}
          loading={eventLoading}
        />
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="eventDate"
          dateString
          required
          col={7}
          minDate={getStartOfToday(getServerDate())}
        />
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="startTime"
          required
          timeOnly
          col={5}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="duration"
          options={null || _durationOptions}
          required
          col={7}
        />
        <CustomCalendarInput
          onChange={handleChange}
          name="endTime"
          value={_endTime}
          timeOnly
          disabled
          col={5}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="employee"
          label="Employee / Staff"
          options={eventSetup === null ? employeeList : eventSetup?.employees}
          required={isRequired("employee")}
          col={12}
          clearable
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="location"
          required={isRequired("location")}
          options={eventSetup === null ? locationList : _locationOptions}
          col={12}
          clearable
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="resource"
          required={eventSetup?.requiredToCreate?.resource}
          options={_resourceOptions}
          col={12}
          clearable
        />
        {offHoursWarning && (
          <div className="text-yellow-600 bg-yellow-100 px-2 py-1 border-round-sm c-col-12">
            ⚠️ Selected time is outside operating hours.
          </div>
        )}
        {conflictWarnings.map((warning, i) => (
          <div
            key={i}
            className="text-yellow-600 bg-yellow-100 px-2 py-1 border-round-sm c-col-12"
          >
            {`⚠️ ${warning.message}`}
          </div>
        ))}
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(EventForm);

function getStartOfToday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isWithinBusinessHours(date, time, businessHours) {
  const day = new Date(date).getDay(); // 0–6
  const matched = businessHours.find((h) => h.daysOfWeek.includes(day));
  if (!matched) return false;
  return time >= matched.startTime && time < matched.endTime;
}
