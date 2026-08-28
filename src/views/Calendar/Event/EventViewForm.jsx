import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation from "@formValidations";
import {
  getCalendarEvent,
  deleteMemberFromEvent,
  deleteCalendarEvent,
  getCalendarEventMembers,
  editCalendarEventMember,
  editCalendarEvent,
  verifyCompletion,
  revertCompletion,
  bookResource,
  unbookResource,
} from "../../../store/calendar/calendarEventActions";
import CustomTable from "../../../shared/table/CustomTable";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import AddMemberDialog from "./AddMember/AddMemberDialog";
import { formatEnum, debounce } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import CustomInput from "../../../shared/inputs/CustomInput";
import CustomForm from "@inputs/CustomForm";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomRadioButton from "../../../shared/inputs/CustomRadioButton";
import MemberVerificationDialog from "./MemberVerificationDialog";
import { calendarEventStatusOptions } from "../../../utils/dropdownConstants";
import EmployeeVerificationDialog from "./EmployeeVerificationDialog";
import CustomLayoutPlan from "../../../shared/LayoutPlan/customLayoutPlan";
import {
  getEvent,
  getEmployeeDaySummary,
  getLocationDayEvents,
} from "@store/calendar/calendarActions";
import { getMemberPendingEventServices } from "@store/member/memberActions";
import { getConflictWarnings } from "./ConflictMessages";
import { useCan } from "../../../hooks/useCan";
import { createRequest } from "@store/settings/employeeSetup/requestActions";
import { setToast } from "@store/common/commonSlice";

function EventViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedMember, setSelectedMember] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState({});

  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [showMemberVerificationDialog, setShowMemberVerificationDialog] =
    useState(false);

  const [showEmployeeVerificationDialog, setEmployeeVerificationDialog] =
    useState(false);

  const [resourceBookings, setResourceBookings] = useState([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingMember, setBookingMember] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [eventSetup, setEventSetup] = useState(null);
  const [employeeSummary, setEmployeeSummary] = useState(null);
  const [locationEvents, setLocationEvents] = useState(null);

  const [memberDetailsLoading, setMemberDetailsLoading] = useState(false);
  const [data, setData] = useState({
    event: null,
    eventDate: null,
    startTime: null,
    duration: null,
    endTime: null,
    employee: null,
    resource: null,
    location: null,
    eventMembers: [],
    parentEvent: null,
    isRepeated: false,
    durationList: [],
    employeeDetails: {},
    availableLocations: [],
    employeeVerified: false,
    employeeVerifiedAt: null,
    memberVerified: false,
    locationDetails: null,
  });

  // TODO: Add a check here for Cancel Charge, and Cancel No Charge
  const isCompleted = data?.status === "COMPLETED";

  const [revertLoading, setRevertLoading] = useState(false);
  const [deletionType, setDeletionType] = useState("THIS");
  const [deletionLoading, setDeletionLoading] = useState(false);

  const pendingChangesRef = useRef({});
  const debouncedEdit = useRef(
    debounce(() => {
      const changes = pendingChangesRef.current;
      pendingChangesRef.current = {};
      dispatch(
        editCalendarEvent(
          id,
          () => {},
          changes,
          () => {},
        ),
      );
    }),
  ).current;

  useEffect(() => {
    if (id) {
      dispatch(
        getCalendarEvent(id, setLoading, (res) => {
          setData({
            event: res.event,
            eventDate: res.eventDate,
            startTime: res.startTime,
            eventDetails: res?.eventDetails,
            endTime: res.endTime,
            employee: res.employee,
            employeeDetails: res.employeeDetails,
            resource: res.resource,
            location: res.location?._id || res?.location,
            eventMembers: res.eventMembers || [],
            parentEvent: res.parentEvent || null,
            isRepeated: res.isRepeated,
            enrollment: `${res.enrollment.current}/${res.enrollment.maximum}`,
            status: res?.status,
            duration: res.duration?._id || res.duration,
            durationList: res?.eventDetails?.duration,
            availableLocations: res?.eventDetails?.availableLocations,
            employeeVerified: res?.employeeVerified,
            employeeVerifiedAt: res?.employeeVerifiedAt,
            memberVerified: res?.memberVerified,
            locationDetails: res?.locationDetails,
            parentClass: res?.parentClass,
          });
          setResourceBookings(res?.resourceBookings || []);
        }),
      );
    }
  }, [id, dispatch]);

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

  // Fetch employee day summary when employee + date are set
  useEffect(() => {
    if (data.employee && data.eventDate) {
      const dateOnly = String(data.eventDate).split("T")[0];
      dispatch(
        getEmployeeDaySummary(
          data.employee,
          dateOnly,
          null,
          (res) => {
            if (res) setEmployeeSummary(res);
          },
          id,
        ),
      );
    } else {
      setEmployeeSummary(null);
    }
  }, [data.employee, data.eventDate]);

  // Fetch location day events when location + date are set
  useEffect(() => {
    if (data.location && data.eventDate) {
      const dateOnly = String(data.eventDate).split("T")[0];
      dispatch(
        getLocationDayEvents(
          data.location,
          dateOnly,
          null,
          (res) => {
            if (res) setLocationEvents(res);
          },
          id,
        ),
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
      eventType: data.eventDetails?.eventType,
    });
  }, [
    employeeSummary,
    locationEvents,
    data.startTime,
    data.duration,
    data.event,
    data.eventDetails?.eventType,
  ]);

  const handleChange = ({ name, value }) => {
    if (name === "status" && value === "COMPLETED") {
      customConfirmDialog({
        message: "Are you sure you want to complete this Event?",
        accept: () => {
          dispatch(
            verifyCompletion(
              id,
              () => {},
              (success) => {
                if (success) {
                  dispatch(
                    editCalendarEvent(
                      id,
                      () => {},
                      { status: value },
                      (success) => {
                        if (success) {
                          let formErrors = formValidation(name, value, data);
                          setData((prev) => ({
                            ...prev,
                            [name]: value,
                            formErrors,
                          }));
                        }
                      },
                    ),
                  );
                }
              },
            ),
          );
        },
        reject: () => {},
      });

      return;
    }

    // Update local state immediately so conflict warnings fire right away
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));

    // Accumulate pending changes and debounce the API save
    pendingChangesRef.current = { ...pendingChangesRef.current, [name]: value };
    debouncedEdit();
  };

  const handleSuccess = () => {
    dispatch(
      getCalendarEvent(id, setLoading, (res) => {
        setData({
          event: res.event,
          eventDate: res.eventDate,
          startTime: res.startTime,
          duration: res.duration?._id || res.duration,
          endTime: res.endTime,
          employee: res.employee,
          resource: res.resource,
          location: res.location,
          eventMembers: res.eventMembers || [],
          status: res?.status,
        });
      }),
    );
  };

  const handleDeleteMember = (row) => {
    const deleteData = {
      calendarEventId: id,
      memberId: row.memberId,
    };

    customConfirmDialog({
      message: "Are you sure you want to remove this member?",
      accept: () => {
        dispatch(
          deleteMemberFromEvent(
            deleteData,
            () => {},
            (success, errors) => {
              if (success) {
                setmembers((prev) =>
                  prev.filter((m) => m.member?._id !== row.memberId),
                );
                setData((prev) => ({
                  ...prev,
                  eventMembers: prev.eventMembers?.filter(
                    (m) => m.member?._id !== row.memberId,
                  ),
                  enrollment: `${members.length - 1}/${data?.eventDetails?.defaultMaxAttendes}`,
                }));
              } else {
                console.error("Failed to delete member:", errors);
              }
            },
          ),
        );
      },
      reject: () => {},
    });
  };

  const onBuyFromPos = (row) => {
    dispatch(
      getMemberPendingEventServices(row.memberId, null, (pending) => {
        const list = Array.isArray(pending) ? pending : [];
        const items = (requiredServices || [])
          .map((svc) => {
            const id = typeof svc === "string" ? svc : svc?._id;
            if (!id) return null;
            const count = list.filter((e) =>
              (e.missingServices || []).some((s) => s._id === id),
            ).length;
            return { _id: id, quantity: count > 0 ? count : 1 };
          })
          .filter(Boolean);
        navigate("/point-of-sale", {
          state: { member: row.memberId, catalogItems: items },
        });
      }),
    );
  };

  const handleMemberDetailsChange = ({ name, value }, row) => {
    const payload = {
      [name]: value,
    };

    dispatch(
      editCalendarEventMember(
        row?.calendarEventMember,
        setMemberDetailsLoading,
        payload,
        (success, data) => {
          if (success) {
            setmembers((prev) =>
              prev.map((m) =>
                m.member._id === row.memberId
                  ? {
                      ...m,
                      [name === "serviceUsed" ? "serviceUsed" : name]: value,
                    }
                  : m,
              ),
            );
          }
        },
      ),
    );
  };

  // Compute distinct resource types from the layout
  const resourceTypes = useMemo(() => {
    const layout = data?.locationDetails?.resourcesLayout || [];
    if (!layout.length) return [];
    const typeMap = {};
    layout.forEach((item) => {
      if (!typeMap[item.name]) {
        typeMap[item.name] = [];
      }
      typeMap[item.name].push(item.shortName);
    });
    return Object.entries(typeMap).map(([name, shortNames]) => ({
      name,
      shortNames,
    }));
  }, [data?.locationDetails?.resourcesLayout]);

  const toId = (val) => (val?._id ? String(val._id) : String(val || ""));

  const getResourceOptionsForMember = (resourceType, memberId) => {
    return resourceType.shortNames
      .filter((sn) => {
        const booking = resourceBookings.find((b) => b.shortName === sn);
        return !booking || toId(booking.member) === toId(memberId);
      })
      .map((sn) => ({ _id: sn, title: sn }));
  };

  const getMemberResourceBooking = (memberId, resourceTypeName) => {
    const booking = resourceBookings.find(
      (b) =>
        toId(b.member) === toId(memberId) &&
        b.resourceType === resourceTypeName,
    );
    return booking?.shortName || "";
  };

  const handleTableResourceChange = (memberId, resourceTypeName, shortName) => {
    const currentBooking = resourceBookings.find(
      (b) =>
        toId(b.member) === toId(memberId) &&
        b.resourceType === resourceTypeName,
    );

    if (!shortName && currentBooking) {
      dispatch(
        unbookResource(
          id,
          { shortName: currentBooking.shortName },
          setBookingLoading,
          (success, updatedBookings) => {
            if (success) setResourceBookings(updatedBookings);
          },
        ),
      );
      return;
    }

    if (currentBooking && currentBooking.shortName !== shortName) {
      dispatch(
        unbookResource(
          id,
          { shortName: currentBooking.shortName },
          setBookingLoading,
          (success, updatedBookings) => {
            if (success) {
              setResourceBookings(updatedBookings);
              dispatch(
                bookResource(
                  id,
                  { shortName, resourceType: resourceTypeName, memberId },
                  setBookingLoading,
                  (bookSuccess, bookData) => {
                    if (bookSuccess) setResourceBookings(bookData);
                  },
                ),
              );
            }
          },
        ),
      );
      return;
    }

    if (!currentBooking && shortName) {
      dispatch(
        bookResource(
          id,
          { shortName, resourceType: resourceTypeName, memberId },
          setBookingLoading,
          (success, updatedBookings) => {
            if (success) setResourceBookings(updatedBookings);
          },
        ),
      );
    }
  };

  const memberColumns = [
    { field: "member", header: "Member" },
    {
      field: "status",
      header: "Status",
      body: (row) => {
        return (
          <div style={{ maxWidth: "400px" }}>
            <CustomDropdown
              key={`status-${row.memberId}-${row.status}`}
              options={[
                { title: "Pending", _id: "PENDING" },
                { title: "Attended", _id: "ATTENDED" },
              ]}
              name="status"
              placeholder="Select Status"
              value={row?.status}
              onChange={(e) => handleMemberDetailsChange(e, row)}
              hideLabel
              loading={memberDetailsLoading}
              col={3}
              disabled={isCompleted}
            />
          </div>
        );
      },
    },
    {
      field: "serviceUsed",
      header: "Service",
      body: (row) => {
        if (row.isFree) {
          return "Free Event";
        } else if (row.availableServices.length > 0) {
          const serviceItemTemplate = (option) => {
            if (!option) return null;
            if (option.isSubstitute) {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{option.title}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      background: "var(--color-warning)",
                      color: "#fff",
                      borderRadius: "4px",
                      padding: "1px 5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    substitute
                  </span>
                </div>
              );
            }
            return <span>{option.title}</span>;
          };

          return (
            <div style={{ maxWidth: "400px" }}>
              <CustomDropdown
                key={`service-${row.memberId}-${row.service}`}
                options={row.availableServices}
                name="serviceUsed"
                value={row.service}
                loading={memberDetailsLoading}
                placeholder="Select Service"
                onChange={(e) => handleMemberDetailsChange(e, row)}
                hideLabel
                col={3}
                disabled={isCompleted}
                itemTemplate={serviceItemTemplate}
              />
            </div>
          );
        } else {
          return (
            <>
              <span className={`text-red-500 ${isCompleted && "opacity-50"}`}>
                No Service Found
              </span>
              <span
                className={`text-blue-500 cursor-pointer ${isCompleted && "opacity-50 pointer-events-none"}`}
                onClick={() => onBuyFromPos(row)}
              >
                {" "}
                POS
              </span>
            </>
          );
        }
      },
    },
    // Dynamic resource type columns
    ...resourceTypes.map((rt) => ({
      field: `resource_${rt.name}`,
      header: rt.name.replace(/([A-Z])/g, " $1").trim(),
      body: (row) => {
        const currentValue = getMemberResourceBooking(row.memberId, rt.name);
        const options = getResourceOptionsForMember(rt, row.memberId);
        return (
          <div style={{ maxWidth: "200px" }}>
            <CustomDropdown
              key={`resource-${rt.name}-${row.memberId}-${currentValue}`}
              options={options}
              name={`resource_${rt.name}`}
              placeholder="Select"
              value={currentValue || ""}
              onChange={(e) =>
                handleTableResourceChange(row.memberId, rt.name, e.value)
              }
              hideLabel
              col={3}
              disabled={isCompleted}
              loading={bookingLoading}
            />
          </div>
        );
      },
    })),

    {
      field: "verified",
      header: "Verified",
      body: (row) =>
        row.verified ? (
          <i
            title={`Member Verified at ${row.memberVerifiedAt ? getDateTime(row.memberVerifiedAt) : ""}`}
            className="cursor-pointer pi pi-check-circle text-green-500"
          ></i>
        ) : (
          <i
            title={isCompleted ? "Event Completed" : "Verify Member"}
            className={`pi pi-times-circle text-red-500 ${isCompleted ? "opacity-50" : "cursor-pointer"}`}
            onClick={() => {
              if (isCompleted) return;
              setSelectedMember(row);
              setShowMemberVerificationDialog(true);
            }}
          ></i>
        ),
    },

    ...(!isCompleted
      ? [
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
        ]
      : []),
  ];

  const handleRemoveEvent = () => {
    setShowDeleteEventDialog(true);
  };

  const handleDeletionTypeChange = ({ name, value }) => {
    setDeletionType(value);
  };

  const handleHide = () => {
    setShowDeleteEventDialog(false);
  };

  const handleDeletionSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(
        deleteCalendarEvent(id, deletionType, setDeletionLoading, () => {
          navigate("/calendar");
        }),
      );
    }
  };

  let durationOptions =
    data?.durationList &&
    data.durationList.map((item) => ({
      title: `${item} Minutes`,
      _id: item,
    }));

  let _availableLocations = data?.availableLocations;

  const requiredServices = useMemo(() => {
    let duration = data?.duration;
    let { requiredServices, eventType } = data?.eventDetails || {};
    let { classLevels, appointmentLevels } = data?.employeeDetails || {};
    let _services = requiredServices || [];

    if (eventType === "CLASS" && classLevels?.length > 0) {
      _services = _services.filter((service) =>
        classLevels.includes(service.eventLevel),
      );
    } else if (eventType === "APPOINTMENT" && appointmentLevels?.length > 0) {
      _services = _services.filter((service) =>
        appointmentLevels.includes(service.eventLevel),
      );
    }

    _services = _services.filter((service) => service.duration === duration);

    return _services.flatMap((service) => service.services);
  }, [data]);

  const [members, setmembers] = useState([]);

  useEffect(() => {
    if (id && requiredServices) {
      dispatch(
        getCalendarEventMembers(
          id,
          requiredServices,
          setMemberLoading,
          (res) => {
            const isFree = requiredServices.length === 0;
            if (!isFree && !isCompleted) {
              const updated = res.map((m) => {
                const available = m?.member?.memberServices || [];
                if (!m.serviceUsed && available.length > 0) {
                  const firstService = available[0]._id;
                  dispatch(
                    editCalendarEventMember(
                      m._id,
                      () => {},
                      { serviceUsed: firstService },
                      () => {},
                    ),
                  );
                  return { ...m, serviceUsed: firstService };
                }
                return m;
              });
              setmembers(updated);
            } else {
              setmembers(res);
            }
          },
        ),
      );
    }
  }, [id, requiredServices, dispatch]);

  const handleVerificationSuccess = (member) => {
    setmembers((prev) =>
      prev.map((m) =>
        m.member?._id === member.memberId
          ? { ...m, isVerified: true, memberVerifiedAt: new Date().toISOString() }
          : m,
      ),
    );
  };

  const handleEmployeeVerificationSuccess = () => {
    setData((prev) => ({
      ...prev,
      employeeVerified: true,
      employeeVerifiedAt: new Date().toISOString(),
    }));
  };

  const handleRevertEvent = () => {
    customConfirmDialog({
      message:
        "Reverting this event will undo the changes made during completion, service deductions. Are you sure you want to proceed?",
      accept: () => {
        dispatch(
          revertCompletion(id, setRevertLoading, (success) => {
            if (success) {
              dispatch(
                getCalendarEvent(id, setLoading, (res) => {
                  setData((prev) => ({
                    ...prev,
                    status: res?.status,
                    employeeVerified: res?.employeeVerified,
                    memberVerified: res?.memberVerified,
                    enrollment: `${res.enrollment.current}/${res.enrollment.maximum}`,
                  }));
                }),
              );
              dispatch(
                getCalendarEventMembers(
                  id,
                  requiredServices,
                  setMemberLoading,
                  (res) => {
                    setmembers(res);
                  },
                ),
              );
            }
          }),
        );
      },
      reject: () => {},
    });
  };

  const handleAddMembersSuccess = () => {
    dispatch(
      getCalendarEventMembers(id, requiredServices, setMemberLoading, (res) => {
        setmembers(res);
      }),
    );
    dispatch(
      getCalendarEvent(
        id,
        () => {},
        (res) => {
          setData((prev) => ({
            ...prev,
            eventMembers: res.eventMembers || [],
            enrollment: `${res.enrollment.current}/${res.enrollment.maximum}`,
          }));
        },
      ),
    );
  };

  const mappedMembers = useMemo(() => {
    const isFree = requiredServices.length === 0;

    return members.map((m) => ({
      calendarEventMember: m._id || null,
      memberId: m.member?._id,
      member: m.member?.title || "-",
      status: m.status || "-",
      service: m.serviceUsed || null,
      verified: m.isVerified,
      memberVerifiedAt: m.memberVerifiedAt || null,
      availableServices: m?.member?.memberServices || [],
      isFree,
      requiredServices,
    }));
  }, [members, requiredServices]);

  // Conditionally rendered event status Options
  let statusOptions = () => {
    let _calendarEventStatusOptions = calendarEventStatusOptions;
    if (!data?.eventDetails?.cancelC && !data?.eventDetails?.cancelNc) {
      _calendarEventStatusOptions = calendarEventStatusOptions?.filter(
        (value) =>
          value?._id !== "CANCEL_NO_CHARGE" && value?._id !== "CANCEL_CHARGE",
      );
    }

    if (!data?.eventDetails?.cancelC && data?.eventDetails?.cancelNc) {
      _calendarEventStatusOptions = calendarEventStatusOptions?.filter(
        (value) => value?._id !== "CANCEL_CHARGE",
      );
    }

    if (!data?.eventDetails?.cancelNc && data?.eventDetails?.cancelC) {
      _calendarEventStatusOptions = calendarEventStatusOptions?.filter(
        (value) => value?._id !== "CANCEL_NO_CHARGE",
      );
    }

    return _calendarEventStatusOptions;
  };

  // List of things required to complete this event
  const isRequired = (field) => {
    return data?.eventDetails?.requiredToComplete?.includes(field);
  };

  // Compute distinct resource types and their available shortNames from the layout
  const handleResourceClick = (resource) => {
    if (isCompleted) return;
    setSelectedResource(resource);
    setBookingMember(null);
    setShowBookingDialog(true);
  };

  const availableMembersForBooking = useMemo(() => {
    if (!selectedResource) return [];
    return mappedMembers.filter((m) => {
      const alreadyHasType = resourceBookings.some(
        (b) =>
          toId(b.member) === toId(m.memberId) &&
          b.resourceType === selectedResource.name,
      );
      return !alreadyHasType;
    });
  }, [selectedResource, mappedMembers, resourceBookings]);

  const handleBookResource = () => {
    if (!bookingMember || !selectedResource) return;
    dispatch(
      bookResource(
        id,
        {
          shortName: selectedResource.shortName,
          resourceType: selectedResource.name,
          memberId: bookingMember,
        },
        setBookingLoading,
        (success, data) => {
          if (success) {
            setResourceBookings(data);
            setShowBookingDialog(false);
            setSelectedResource(null);
            setBookingMember(null);
          }
        },
      ),
    );
  };

  const handleResourceUnassign = (resource) => {
    if (isCompleted) return;
    customConfirmDialog({
      message: `Are you sure you want to unassign ${resource.displayName} from ${resource.shortName}?`,
      accept: () => {
        dispatch(
          unbookResource(
            id,
            { shortName: resource.shortName },
            setBookingLoading,
            (success, data) => {
              if (success) {
                setResourceBookings(data);
              }
            },
          ),
        );
      },
      reject: () => {},
    });
  };

  const canInstructorEvents = useCan("REQUEST-INSTRUCTOR-EVENTS");
  const canCancelOutside = useCan("REQUEST-CANCEL-EVENT-OUTSIDE");
  const canCompletedEvent = useCan("REQUEST-COMPLETED-EVENT");
  const canRequestEdit = canInstructorEvents || canCancelOutside || canCompletedEvent;

  const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);
  const [requestEditData, setRequestEditData] = useState({});
  const [requestEditLoading, setRequestEditLoading] = useState(false);

  const resolveRequestType = () => {
    if (canInstructorEvents) return "REQUEST-INSTRUCTOR-EVENTS";
    if (canCancelOutside) return "REQUEST-CANCEL-EVENT-OUTSIDE";
    if (canCompletedEvent) return "REQUEST-COMPLETED-EVENT";
    return null;
  };

  const openRequestEditDialog = () => {
    setRequestEditData({
      employee: data?.employee || null,
      eventDate: data?.eventDate || null,
      startTime: data?.startTime || null,
      duration: data?.duration || null,
      location: data?.location || null,
      status: data?.status || null,
      statusReason: data?.statusReason || "",
    });
    setShowRequestEditDialog(true);
  };

  const closeRequestEditDialog = () => {
    setShowRequestEditDialog(false);
    setRequestEditData({});
  };

  const handleRequestEditChange = ({ name, value }) => {
    setRequestEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestEditSubmit = (e) => {
    e.preventDefault();
    const requestType = resolveRequestType();
    if (!requestType) return;

    customConfirmDialog({
      message:
        "Submit these changes as an edit request? They will not apply until an approver reviews them.",
      accept: () => {
        const payload = {
          requestType,
          targetCollection: "CALENDAR_EVENT",
          targetItem: id,
          changedData: {
            employee: requestEditData.employee,
            eventDate: requestEditData.eventDate,
            startTime: requestEditData.startTime,
            duration: requestEditData.duration,
            location: requestEditData.location,
            status: requestEditData.status,
            statusReason: requestEditData.statusReason,
          },
        };
        dispatch(
          createRequest(payload, setRequestEditLoading, (success) => {
            if (success) {
              dispatch(
                setToast({
                  title: "Request Submitted",
                  description:
                    "Your edit request is awaiting approver review.",
                  type: "success",
                  life: 3000,
                }),
              );
              closeRequestEditDialog();
            }
          }),
        );
      },
      reject: () => {},
    });
  };

  const allEventRequestButtons = canRequestEdit
    ? [
        {
          label: requestEditLoading ? "Submitting..." : "Request Edit",
          onClick: openRequestEditDialog,
        },
      ]
    : [];

  return (
    <>
      {/* Deletion of events dialog */}
      <CustomDialog
        visible={showDeleteEventDialog}
        title="Delete Event"
        onHide={handleHide}
      >
        <CustomForm
          onSubmit={handleDeletionSubmit}
          onCancel={handleHide}
          submitLoading={deletionLoading}
          submitLabel="Delete"
        >
          {data?.parentEvent === null ? (
            data?.isRepeated ? (
              <>
                <CustomRadioButton
                  name="type"
                  value={deletionType}
                  col={12}
                  hideLabel
                  onChange={handleDeletionTypeChange}
                  options={[
                    { title: "This Event", _id: "THIS" },
                    { title: "All Events", _id: "ALL" },
                    {
                      title: "This and Following Events",
                      _id: "THIS_AND_FOLLOWING",
                    },
                  ]}
                />
              </>
            ) : (
              <>
                <div className="c-col-12">
                  Do you want to delete this record?
                </div>
              </>
            )
          ) : (
            <>
              <CustomRadioButton
                name="type"
                value={deletionType}
                col={12}
                hideLabel
                onChange={handleDeletionTypeChange}
                options={[
                  { title: "This Event", _id: "THIS" },
                  { title: "All Events", _id: "ALL" },
                  {
                    title: "This and Following Events",
                    _id: "THIS_AND_FOLLOWING",
                  },
                ]}
              />
            </>
          )}
        </CustomForm>
      </CustomDialog>

      {/* Event Actions - Repeat, Remove, Add Members and more */}
      {!isCompleted && (
        <div className="flex gap-2 p-2 justify-content-start">
          <PrimaryButton
            label="Repeat Event"
            icon="bi bi-repeat"
            severity="secondary"
            onClick={() => {
              if (
                data?.parentClass === null ||
                data?.parentClass === undefined
              ) {
                data?.parentEvent === null
                  ? navigate(`repeat-event`)
                  : navigate(
                      `/calendar/event/${data?.parentEvent}/repeat-event?repeated=true`,
                    );
              } else {
                navigate(`/settings/schedule-setup/class/${data?.parentClass}`);
              }
            }}
          />
          <PrimaryButton
            label="Add Member"
            severity="secondary"
            icon="pi pi-plus"
            onClick={() => setShowAddMemberDialog(true)}
          />
          <PrimaryButton
            label="Remove Event"
            severity="secondary"
            icon="pi pi-trash"
            onClick={handleRemoveEvent}
          />
        </div>
      )}

      {/* Dialog to verify member for given event */}
      <MemberVerificationDialog
        selectedMember={selectedMember}
        visible={showMemberVerificationDialog}
        onHide={() => {
          setSelectedMember({});
          setShowMemberVerificationDialog(false);
        }}
        onSuccess={handleVerificationSuccess}
      />

      {/* Resource Booking Dialog */}
      <CustomDialog
        visible={showBookingDialog}
        onHide={() => setShowBookingDialog(false)}
        title={`Book Resource: ${selectedResource?.shortName || ""}`}
      >
        <div className="c-grid">
          <CustomDropdown
            col={12}
            name="bookingMember"
            label="Select Member"
            options={availableMembersForBooking.map((m) => ({
              title: m.member,
              _id: m.memberId,
            }))}
            value={bookingMember}
            onChange={(e) => setBookingMember(e.value)}
          />
          <div className="c-col-12 flex justify-content-end">
            <PrimaryButton
              label="Book"
              onClick={handleBookResource}
              loading={bookingLoading}
              disabled={!bookingMember}
            />
          </div>
        </div>
      </CustomDialog>

      {/* Employee Verification Dialog */}
      <EmployeeVerificationDialog
        id={id}
        selectedEmployee={selectedEmployee}
        visible={showEmployeeVerificationDialog}
        onHide={() => {
          setSelectedEmployee({});
          setEmployeeVerificationDialog(false);
        }}
        onSuccess={handleEmployeeVerificationSuccess}
      />

      {/* Request Edit Dialog */}
      <CustomDialog
        title="Request Edit Event"
        visible={showRequestEditDialog}
        onHide={closeRequestEditDialog}
      >
        <CustomForm
          onSubmit={handleRequestEditSubmit}
          submitLoading={requestEditLoading}
          submitLabel="Submit Request"
          onCancel={closeRequestEditDialog}
        >
          <CustomDropdown
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="employee"
            label="Employee / Staff"
            options={eventSetup?.employees}
            col={6}
          />
          <CustomCalendarInput
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="eventDate"
            dateString
            col={6}
          />
          <CustomCalendarInput
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="startTime"
            timeOnly
            col={6}
          />
          <CustomDropdown
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="duration"
            options={durationOptions}
            col={6}
          />
          <CustomDropdown
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="location"
            options={_availableLocations}
            col={6}
          />
          <CustomDropdown
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="status"
            options={statusOptions()}
            col={6}
          />
          <CustomTextArea
            data={requestEditData}
            onChange={handleRequestEditChange}
            name="statusReason"
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      {/* Main Event Form */}
      <FormPageLayout backText="Calendar" hideCancel pageLoading={loading} buttons={allEventRequestButtons}>
        {/* List of members to add */}
        <AddMemberDialog
          visible={showAddMemberDialog}
          onHide={() => setShowAddMemberDialog(false)}
          calendarEventId={id}
          max={data?.eventDetails?.defaultMaxAttendes}
          enrolled={members.length}
          onSuccess={handleAddMembersSuccess}
          excludedMemberIds={mappedMembers.map((m) => m.memberId)}
        />

        {/* Event Basic Details */}
        <CustomCard
          title={`Event Details (${data?.eventDetails?.title})`}
          buttons={
            isCompleted
              ? [
                  {
                    label: "Event Completed",
                    className: "bg-green-500 pointer-events-none text-white",
                  },
                  // {
                  //   label: revertLoading ? "Reverting..." : "Revert Event",
                  //   className: `bg-red-500 text-white ${revertLoading ? "pointer-events-none opacity-50" : ""}`,
                  //   onClick: handleRevertEvent,
                  // },
                ]
              : []
          }
          actions
        >
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="employee"
            label="Employee / Staff"
            required={isRequired("employee")}
            options={eventSetup?.employees}
            disabled={isCompleted}
            extraHeaders={
              isRequired("employeeVerification") ? (
                data?.employeeVerified ? (
                  <i
                    title={`Employee Verified at ${data?.employeeVerifiedAt ? getDateTime(data.employeeVerifiedAt) : ""}`}
                    className="pi pi-check-circle text-green-500"
                  ></i>
                ) : (
                  <i
                    title={isCompleted ? "Event Completed" : "Verify Employee"}
                    className={`pi pi-times-circle text-red-500 ${isCompleted ? "opacity-50" : "cursor-pointer"}`}
                    onClick={() => {
                      if (isCompleted) return;
                      setSelectedEmployee(data?.employee);
                      setEmployeeVerificationDialog(true);
                    }}
                  ></i>
                )
              ) : (
                false
              )
            }
          />
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="eventDate"
            dateString
            required
            disabled={isCompleted}
          />

          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="startTime"
            required
            timeOnly
            disabled={isCompleted}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="duration"
            required
            options={durationOptions}
            disabled={isCompleted}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="location"
            required={isRequired("location")}
            options={_availableLocations}
            disabled={isCompleted}
          />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="enrollment"
            // required
            disabled
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="status"
            options={statusOptions()}
            disabled={isCompleted}
          />
          <CustomTextArea
            data={data}
            onChange={handleChange}
            name="statusReason"
            disabled={isCompleted}
          />
          {conflictWarnings.map((warning, i) => (
            <div
              key={i}
              className="text-yellow-600 bg-yellow-100 px-2 py-1 border-round-sm c-col-12"
            >
              {`⚠️ ${warning.message}`}
            </div>
          ))}
        </CustomCard>

        {/* Table for enrolled Members */}
        <CustomTable
          minWidth="auto"
          columns={memberColumns}
          data={mappedMembers}
          loading={memberLoading}
        />

        {data?.locationDetails?.setupLayout &&
          data?.locationDetails?.resourcesLayout?.length > 0 && (
            <CustomCard title="Resource Layout">
              <CustomLayoutPlan
                name="resourcesLayout"
                value={data.locationDetails.resourcesLayout}
                restrict
                resourceBookings={resourceBookings}
                members={mappedMembers}
                onResourceClick={!isCompleted ? handleResourceClick : undefined}
                onResourceUnassign={!isCompleted ? handleResourceUnassign : undefined}
              />
            </CustomCard>
          )}
      </FormPageLayout>
    </>
  );
}

export default React.memo(EventViewForm);
