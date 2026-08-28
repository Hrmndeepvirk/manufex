import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useServerTime } from "../../../hooks/useServerTime";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import { useSelector } from "react-redux";
import useCalendarSchedule from "../hooks/useCalendarSchedule";
import Sidebar from "./Sidebar";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import EventHoverPopup from "../../../shared/overlays/EventHoverPopup";
import CalendarEventCard from "../../../shared/cards/CalendarEventCard";

const viewTypes = [
  { label: "Default", value: "default" },
  { label: "Employees", value: "employees" },
  { label: "Locations", value: "locations" },
  { label: "Resources", value: "resources" },
];
const gridTypes = [
  { label: "Week", value: "Week", icon: "pi pi-th-large" },
  { label: "Day", value: "Day", icon: "pi pi-clock" },
];

function CustomCalendar({
  onOpenEventForm,
  events = [],
  onDateClick = () => {},
  onEventClick = () => {},
  onDragSelect = () => {},
  onViewportChange,
  filters,
  setFilters,
  data,
  setData,
  ...props
}) {
  const { getServerDate } = useServerTime();
  const calendarRef = useRef();
  const getCalendarApi = () => calendarRef.current?.getApi();

  let allLocations = useSelector((state) => state.calendar.locations);
  let allResources = useSelector((state) => state.calendar.resources);
  const allEmployees = useSelector((state) => state.calendar.employees);

  console.log("allEmployees ====>", allEmployees);
  console.log("allResources ====>", allResources);
  console.log("allLocations ====>", allLocations);

  const [quickViewFilters, setQuickViewFilters] = useState(null);

  console.log("quick view filters ====>", quickViewFilters);
  const [selectedResource, setSelectedResource] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getServerDate());
  const hoverPopupRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  const handleEventMouseEnter = (info) => {
    const ext = info?.event?.extendedProps || {};
    const opts = ext?.eventDetails?.popupDisplay || [];
    const hasShowable =
      Array.isArray(opts) && opts.some((o) => o && o !== "NONE");
    if (!hasShowable) return;
    setHoverData({
      event: { ...ext, title: info.event.title },
      options: opts,
      accentColor: ext?.eventDetails?.boxColor,
    });
    hoverPopupRef.current?.show(info.jsEvent, info.el);
  };

  const handleEventMouseLeave = () => {
    hoverPopupRef.current?.hide();
  };

  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [dateRange, setDateRange] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [viewType, setViewType] = useState("default");
  const [gridType, setGridType] = useState("Week");

  const handleViewChange = ({ value }) => {
    setViewType(value);
  };
  const handleGridChange = ({ value }) => {
    setGridType(value);
  };

  useEffect(() => {
    let _calanderView = "timeGrid" + gridType;
    if (viewType !== "default") {
      _calanderView = "resourceTimeGrid" + gridType;
    }
    setCurrentView(_calanderView);
    getCalendarApi().changeView(_calanderView);
  }, [viewType, gridType]);

  useEffect(() => {
    updateRangeText();
  }, [currentView]);

  function updateRangeText() {
    const api = getCalendarApi();
    if (!api) return;

    const view = api.view;
    const start = moment(view.currentStart);
    const end = moment(view.currentEnd).subtract(1, "day");

    let text = "";

    if (currentView.includes("Week")) {
      text = `${start.format("ddd, DD MMM")} - ${end.format(
        "ddd, DD MMM, YYYY",
      )}`;
    } else if (currentView.includes("Day")) {
      text = start.format("dddd, DD MMM YYYY");
    } else {
      text = start.format("MMMM YYYY");
    }
    setDateRange(text);
  }
  const onSelectDate = (e) => {
    setSelectedDate(e.date);
    onDateClick(e.dateStr);
    updateRangeText();
  };
  const goToday = () => {
    getCalendarApi().today();
    setSelectedDate(getServerDate());
    updateRangeText();
  };
  const goPrev = () => {
    getCalendarApi().prev();
    updateRangeText();
  };
  const goNext = () => {
    getCalendarApi().next();
    updateRangeText();
  };

  const jumpToDate = (e) => {
    const api = getCalendarApi();
    api.gotoDate(e.value);
    updateRangeText();

    setSelectedDate(e.value);
    setShowDatePicker(false);
  };

  const handleResourceClick = (info) => {
    setSelectedResource((prev) =>
      prev === info.resource.id ? null : info.resource.id,
    );
  };

  const renderResourceLabel = useCallback(
    (arg) => {
      const isSelected = selectedResource === arg.resource.id;
      const icon = isSelected
        ? `<i class="pi pi-times text-sm my-auto ml-2"></i>`
        : "";

      return {
        html: `<span>${arg.resource.title}${icon}</span>`,
      };
    },
    [selectedResource],
  );

  let resources = useMemo(() => {
    if (viewType === "locations") {
      return allLocations.map((loc) => ({
        id: loc._id,
        title: loc.title,
      }));
    } else if (viewType === "employees") {
      return allEmployees.map((emp) => ({
        id: emp._id,
        title: emp.title,
      }));
    } else if (viewType === "resources") {
      return allResources.map((res) => ({
        id: res._id,
        title: res.title,
      }));
    } else {
      return [];
    }
  }, [viewType, allLocations, allEmployees, allResources]);

  resources = useMemo(() => {
    if (selectedResource) {
      return resources.filter((item) => item.id === selectedResource);
    }

    if (filters && filters.length) {
      const viewTypeIds = filters
        .filter((f) => f.type === viewType)
        .map((f) => f._id);

      if (viewTypeIds.length) {
        return resources.filter((res) => viewTypeIds.includes(res.id));
      }
    }

    if (quickViewFilters) {
      let _filters = quickViewFilters?.filters;
      if (quickViewFilters.viewType === "employees") {
        return resources.filter((res) => _filters?.employees?.includes(res.id));
      }
      if (quickViewFilters.viewType === "locations") {
        return resources.filter((res) => _filters?.locations?.includes(res.id));
      }
      if (quickViewFilters.viewType === "resources") {
        return resources.filter((res) => _filters?.resources?.includes(res.id));
      }
    }
    return resources;
  }, [filters, viewType, quickViewFilters, resources, selectedResource]);

  function getCalendarWidth() {
    if (currentView.includes("resource")) {
      if (currentView.includes("Day") && resources.length > 7) {
        return `${resources?.length * 15}%`;
      }
      if (currentView.includes("Week") && resources.length >= 3) {
        return `${resources?.length * 80}%`;
      }
    }
    return "100%";
  }

  const { calendarBehavior, businessHours } = useCalendarSchedule({
    onDragSelect,
    resourceType: viewType,
  });

  let _events = useMemo(() => {
    if (viewType === "default") {
      return events;
    }
    if (viewType === "employees") {
      return events.map((ev) => ({
        ...ev,
        resourceId: ev.extendedProps.employee,
      }));
    }
    if (viewType === "locations") {
      return events.map((ev) => ({
        ...ev,
        resourceId: ev.extendedProps.location,
      }));
    }
    if (viewType === "resources") {
      return events.map((ev) => ({
        ...ev,
        resourceId: ev.extendedProps.resource,
      }));
    }
  }, [events, viewType]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(() => {
        calendarApi.updateSize();
      }, 300); // match sidebar animation duration
    }
  }, [isSidebarOpen]);

  const membersList = useSelector((state) => state.calendar.membersList);

  console.log("eveyts ==>", _events);

  return (
    <div className="custom-calendar">
      <div className="layout">
        <Sidebar
          handleViewChange={handleViewChange}
          handleGridChange={handleGridChange}
          setQuickViewFilters={setQuickViewFilters}
          onAddEvent={() => onOpenEventForm({ businessHours })}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setFilters={setFilters}
        />
        <div className="content h-full">
          <div className="header">
            <div className="flex align-items-center gap-2 flex-wrap">
              {isSidebarOpen && (
                <PrimaryButton icon="pi pi-bars" onClick={toggleSidebar} />
              )}
              <CustomDropdown
                data={data}
                onChange={({ value }) =>
                  setData((prev) => ({ ...prev, member: value }))
                }
                name="member"
                options={membersList}
                clearable
                hideLabel
              />
              <div className="font-semibold text-lg hidden md:block ml-2">
                {dateRange}
                <i
                  className="pi pi-calendar cursor-pointer ml-2"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                ></i>
                {showDatePicker && (
                  <PrimeCalendar
                    value={selectedDate}
                    onChange={jumpToDate}
                    dateFormat="yy-mm-dd"
                    className="absolute z-5 w-3"
                    showLabel={false}
                    inline
                  />
                )}
              </div>
            </div>

            <div className="flex gap-2 ">
              <div className="view">
                {gridTypes.map((gt) => (
                  <div
                    key={gt.value}
                    onClick={() => handleGridChange({ value: gt.value })}
                    className={`view-item ${
                      gridType === gt.value ? "active" : ""
                    }`}
                  >
                    <i className={gt.icon}></i> {gt.label}
                  </div>
                ))}
              </div>

              <PrimaryButton
                icon="pi pi-chevron-left"
                label="Prev"
                onClick={goPrev}
                severity="secondary"
              />
              <PrimaryButton
                label="Today"
                onClick={goToday}
                severity="secondary"
              />
              <PrimaryButton
                icon="pi pi-chevron-right"
                label="Next"
                onClick={goNext}
                iconPos="right"
                severity="secondary"
              />
            </div>
          </div>
          <div className="w-full px-2 pt-1 h-full overflow-x-auto">
            <div className="h-full" style={{ width: getCalendarWidth() }}>
              <FullCalendar
                {...calendarBehavior}
                slotDuration="00:15:00"
                  slotLabelInterval="00:15:00"                
                //TODO: disable event overlap only in resource views
                eventContent={renderEventContent}
                eventOverlap={true}
                allDaySlot={false}
                ref={calendarRef}
                headerToolbar={false}
                height="100%"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  resourceTimelinePlugin,
                  resourceTimeGridPlugin,
                ]}
                events={_events}
                initialView={currentView}
                resources={resources}
                resourceLabelContent={renderResourceLabel}
                dateClick={onSelectDate}
                eventClick={onEventClick}
                datesSet={(arg) =>
                  onViewportChange?.({
                    start: arg.view.activeStart,
                    end: arg.view.activeEnd,
                  })
                }
                eventMouseEnter={handleEventMouseEnter}
                eventMouseLeave={handleEventMouseLeave}
                selectable={true}
                selectMirror={true}
                resourceLabelDidMount={(info) => {
                  info.el.style.cursor = "pointer";
                  info.el.addEventListener("click", () =>
                    handleResourceClick(info),
                  );
                }}
                eventDidMount={(info) => {
                  info.el.style.backgroundColor = "transparent";
                  info.el.style.border = "none";
                  info.el.style.boxShadow = "none";
                }}
                {...props}
              />
            </div>
          </div>
        </div>
      </div>
      <EventHoverPopup
        ref={hoverPopupRef}
        event={hoverData?.event}
        options={hoverData?.options}
        accentColor={hoverData?.accentColor}
      />
    </div>
  );
}

export default React.memo(CustomCalendar);

function renderEventContent(eventInfo) {
  const { title, extendedProps } = eventInfo.event;
  return (
    <CalendarEventCard
      event={extendedProps}
      title={title}
      timeText={eventInfo.timeText}
    />
  );
}
