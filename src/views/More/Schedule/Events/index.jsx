import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomTable from "@shared/table/CustomTable";
import { FilterBar } from "@filters";
import { getCalendarEvents } from "@store/calendar/calendarEventActions";
import {
  getScheduleSettings,
  getDepartmentsList,
  getLocationTypesList,
  getMembersList,
} from "@store/calendar/calendarActions";
import {
  eventTypes,
  durationOptions,
  WeekDays,
  calendarEventStatusOptions,
} from "../../../../utils/dropdownConstants";
import { getDate, getTime } from "@utils/dateTime";
import { formatEnum } from "@utils/common";

const PERSIST_KEY = "schedule-events";
const PERSIST_STORAGE_KEY = `filterbar:${PERSIST_KEY}`;
const LEGACY_RESTRICT_STORAGE_KEY = `${PERSIST_STORAGE_KEY}:restrict`;

if (typeof window !== "undefined" && window.sessionStorage) {
  try {
    window.sessionStorage.removeItem(LEGACY_RESTRICT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function ScheduleEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterValues, setFilterValues] = useState(null);

  useState(() => {
    const preset = location.state?.filterPreset;
    if (!preset || typeof window === "undefined" || !window.sessionStorage) {
      return null;
    }
    try {
      const existing = JSON.parse(
        window.sessionStorage.getItem(PERSIST_STORAGE_KEY) || "{}",
      );
      window.sessionStorage.setItem(
        PERSIST_STORAGE_KEY,
        JSON.stringify({ ...existing, ...preset }),
      );
    } catch {
      /* ignore */
    }
    return null;
  });

  const [restrictedEventIds, setRestrictedEventIds] = useState(() => {
    const fromState = location.state?.calendarEventIds;
    if (!Array.isArray(fromState)) return null;
    const cleaned = fromState.filter(Boolean);
    return cleaned.length ? cleaned : null;
  });

  useEffect(() => {
    if (location.state?.filterPreset || location.state?.calendarEventIds) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  const handleClearAll = () => {
    setRestrictedEventIds(null);
  };

  const {
    calendarEvents,
    scheduleSettings,
    departments,
    employees,
    locations,
    membersList,
    locationTypes,
  } = useSelector((state) => state.calendar);

  const eventCategories = useMemo(
    () => scheduleSettings?.eventCategories || [],
    [scheduleSettings],
  );

  const eventNames = useMemo(
    () => scheduleSettings?.eventSetups || [],
    [scheduleSettings],
  );

  const levels = useMemo(
    () => scheduleSettings?.levels || [],
    [scheduleSettings],
  );

  useEffect(() => {
    dispatch(getCalendarEvents(null, { setLoading }));
    dispatch(getScheduleSettings());
    dispatch(getDepartmentsList());
    dispatch(getLocationTypesList());
    dispatch(getMembersList());
  }, [dispatch]);

  const today = useMemo(() => moment().format("YYYY-MM-DD"), []);

  const eventRows = useMemo(() => {
    return (calendarEvents || []).map((event) => {
      const eventDateOnly = event.eventDate?.split("T")[0] || "";
      const locId =
        typeof event.location === "object"
          ? event.location?._id
          : event.location;
      const matchedLocationType = locationTypes.find((lt) =>
        (lt.locations || []).some((l) => l._id === locId),
      );
      const memberIds =
        event.eventMembers?.map((m) => m.member?._id || m.member) || [];
      const current = event.enrollment?.current || 0;
      const maximum = event.enrollment?.maximum;

      return {
        _id: event._id,
        event: event.eventDetails?.title || "-",
        dateTime: event.eventDate
          ? `${getDate(event.eventDate)} ${event.startTime ? getTime(event.startTime) : ""}`
          : "-",
        employeeName: event.employeeDetails?.title || "-",
        locationName: event.locationDetails?.title || "-",
        eventStatusLabel: event.status ? formatEnum(event.status) : "-",
        fundingStatusLabel: event.hasPendingFunding ? "Pending" : "-",
        membersLabel: event.enrollment ? `${current}/${maximum}` : "-",
        attendance:
          event.eventMembers?.filter((m) => m.status === "ATTENDED").length ||
          0,
        eventDate: eventDateOnly,
        eventType: event.eventDetails?.eventType,
        eventCategory: event.eventDetails?.eventCategory,
        eventName: event.event,
        level: event.eventDetails?.level,
        day: eventDateOnly
          ? moment(eventDateOnly).format("dddd").toUpperCase()
          : "",
        duration: event.duration,
        fundingStatus: event.status || "",
        department: event.employeeDetails?.department,
        employee: event.employee,
        members: memberIds,
        locationType: matchedLocationType?._id,
        location: locId,
        missingEmployee: !event.employee,
        missingLocation: !event.location,
        overbooked:
          maximum !== undefined && maximum !== null ? current > maximum : false,
        isPastCompleted:
          !!eventDateOnly &&
          eventDateOnly < today &&
          event.status === "COMPLETED",
      };
    });
  }, [calendarEvents, locationTypes, today]);

  const visibleEventRows = useMemo(() => {
    if (restrictedEventIds?.length) {
      const allowed = new Set(restrictedEventIds);
      return eventRows.filter((row) => allowed.has(row._id));
    }
    if (filterValues?.startDate) return eventRows;
    return eventRows.filter((row) => !row.isPastCompleted);
  }, [eventRows, restrictedEventIds, filterValues?.startDate]);

  const cascadingLocations = useMemo(() => {
    const selectedType = filterValues?.locationType;
    if (!selectedType) return locations;
    return (
      locationTypes.find((lt) => lt._id === selectedType)?.locations || []
    );
  }, [filterValues?.locationType, locationTypes, locations]);

  const quickFilters = useMemo(
    () => [
      {
        column: "eventName",
        header: "Event Name",
        type: "dropdown",
        options: eventNames,
        col: 4,
      },
      {
        column: "employee",
        header: "Employee",
        type: "dropdown",
        options: employees,
        col: 4,
      },
      {
        column: "location",
        header: "Location",
        type: "dropdown",
        options: cascadingLocations,
        col: 4,
      },
    ],
    [eventNames, employees, cascadingLocations],
  );

  const advancedFilters = useMemo(
    () => [
      {
        column: "startDate",
        header: "Start Date",
        type: "dateFrom",
        targetColumn: "eventDate",
        dateString: true,
        col: 3,
      },
      {
        column: "endDate",
        header: "End Date",
        type: "dateTo",
        targetColumn: "eventDate",
        dateString: true,
        col: 3,
      },
      { column: "club", header: "Club", type: "dropdown", options: [], col: 3 },
      {
        column: "eventType",
        header: "Event Type",
        type: "dropdown",
        options: eventTypes,
        col: 3,
      },
      {
        column: "eventCategory",
        header: "Event Category",
        type: "dropdown",
        options: eventCategories,
        col: 3,
      },
      {
        column: "level",
        header: "Level",
        type: "dropdown",
        options: levels,
        col: 3,
      },
      {
        column: "day",
        header: "Day",
        type: "dropdown",
        options: WeekDays,
        col: 3,
      },
      {
        column: "duration",
        header: "Duration",
        type: "dropdown",
        options: durationOptions,
        col: 3,
      },
      {
        column: "fundingStatus",
        header: "Funding Status",
        type: "dropdown",
        options: calendarEventStatusOptions,
        col: 3,
      },
      { 
        column: "department",
        header: "Department",
        type: "dropdown",
        options: departments,
        col: 3,
      },
      {
        column: "members",
        header: "Members",
        type: "multiselect",
        options: membersList,
        col: 3,
      },
      {
        column: "locationType",
        header: "Location Type",
        type: "dropdown",
        options: locationTypes,
        col: 3,
      },
      {
        column: "missingEmployee",
        header: "Missing Employee",
        type: "checkbox",
        col: 3,
      },
      {
        column: "missingLocation",
        header: "Missing Location",
        type: "checkbox",
        col: 3,
      },
      {
        column: "overbooked",
        header: "Overbooked",
        type: "checkbox",
        col: 3,
      },
    ],
    [
      eventCategories,
      levels,
      departments,
      membersList,
      locationTypes,
    ],
  );

  const columns = [
    {
      field: "event",
      header: "Event",
      sortable: true,
      body: (row) => (
        <span
          className="text-primary cursor-pointer"
          onClick={() => navigate(`/calendar/event/${row._id}`)}
        >
          {row.event}
        </span>
      ),
    },
    {
      field: "dateTime",
      header: "Date / Time",
      sortable: true,
    },
    {
      field: "employeeName",
      header: "Employee",
      sortable: true,
    },
    {
      field: "locationName",
      header: "Location",
      sortable: true,
    },
    {
      field: "eventStatusLabel",
      header: "Status",
      sortable: true,
    },
    {
      field: "fundingStatusLabel",
      header: "Funding Status",
      sortable: true,
    },
    {
      field: "membersLabel",
      header: "Member(s)",
    },
    {
      field: "attendance",
      header: "Attendance",
    },
  ];

  return (
    <FormPageLayout backText="Schedule" backTo="/more/schedule" hideCancel>
      <div className="schedule-events">
        <FilterBar
          persist
          persistKey={PERSIST_KEY}
          quickFilters={quickFilters}
          advancedFilters={advancedFilters}
          data={visibleEventRows}
          onFilter={setFilteredRows}
          onFilterValuesChange={setFilterValues}
          onClear={handleClearAll}
        />

        <CustomTable
          data={filteredRows}
          columns={columns}
          loading={loading}
        />
      </div>
    </FormPageLayout>
  );
}

export default React.memo(ScheduleEvents);
