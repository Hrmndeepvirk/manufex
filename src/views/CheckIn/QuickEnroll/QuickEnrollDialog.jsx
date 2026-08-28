import React, { useEffect, useMemo, useState } from "react";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import CustomSimpleTable from "../../../shared/table/CustomSimpleTable";
import CustomCalendarInput from "@shared/inputs/CustomCalendarInput";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "@store/member/memberActions";
import CustomDialog from "@shared/overlays/CustomDialog";
import {
  enrollMemberFromCheckIn,
  quickEnrollEvents,
  removeMemberFromCheckIn,
} from "../../../store/checkin/checkinActions";
import { getTime } from "@utils/dateTime";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";

export default function QuickEnrollDialog({ member, visible, onHide }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    members: member,
    eventType: "CLASS",
    date: new Date().toISOString().split("T")[0],
  });

  const events = useSelector((state) => state.checkin.quickEnrollEvents);

  useEffect(() => {
    if (formData?.members) {
      dispatch(quickEnrollEvents(formData?.date, formData?.members, () => {}));
    }
  }, [formData]);

  const posColumns = [
    { field: "event", header: "Event", body: (row) => `${row?.event?.title}` },
    // { field: "level", header: "Level" },
    {
      field: "startTime",
      header: "Time",
      body: (row) => `${getTime(row?.startTime)}`,
    },
    {
      field: "location",
      header: "Location",
      body: (row) => `${row?.location?.title}`,
    },
    {
      field: "employee",
      header: "Employee",
      body: (row) => `${row?.employee?.firstName} ${row?.employee?.lastName}`,
    },
    {
      field: "enrollment",
      header: "Enrollment",
      body: (row) => `${row?.enrolledCount}/${row?.event?.defaultMaxAttendes}`,
    },
    { field: "available", header: "Available", body: (row) => `0` },
    {
      header: "Actions",
      body: (row) => {
        return row?.enrolledCount === row?.event?.defaultMaxAttendes ? (
          row?.isMemberEnrolled ? (
            <>
              <span
                title="Remove Member"
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  customConfirmDialog({
                    message: "Are you sure you want to remove this member?",
                    accept: () => {
                      const payload = {
                        calendarEventId: row?._id,
                        memberId: formData?.members,
                      };
                      dispatch(
                        removeMemberFromCheckIn(
                          payload,
                          () => {},
                          (success) => {
                            dispatch(
                              quickEnrollEvents(
                                formData?.date,
                                formData?.members,
                                () => {},
                              ),
                            );
                          },
                        ),
                      );
                    },
                    reject: () => {},
                  });
                }}
              >
                Remove
              </span>
              <span className="text-black"> | Full</span>
            </>
          ) : (
            <>Full</>
          )
        ) : row?.isMemberEnrolled ? (
          <span
            title="Remove Member"
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              customConfirmDialog({
                message: "Are you sure you want to remove this member?",
                accept: () => {
                  const payload = {
                    calendarEventId: row?._id,
                    memberId: formData?.members,
                  };
                  dispatch(
                    removeMemberFromCheckIn(
                      payload,
                      () => {},
                      (success) => {
                        dispatch(
                          quickEnrollEvents(
                            formData?.date,
                            formData?.members,
                            () => {},
                          ),
                        );
                      },
                    ),
                  );
                },
                reject: () => {},
              });
            }}
          >
            Remove
          </span>
        ) : (
          <span
            title="Enroll Member"
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              customConfirmDialog({
                message: "Are you sure you want to enroll this member?",
                accept: () => {
                  const payload = {
                    calendarEventId: row?._id,
                    memberId: formData?.members,
                  };
                  dispatch(
                    enrollMemberFromCheckIn(
                      payload,
                      () => {},
                      (success) => {
                        dispatch(
                          quickEnrollEvents(
                            formData?.date,
                            formData?.members,
                            () => {},
                          ),
                        );
                      },
                    ),
                  );
                },
                reject: () => {},
              });
            }}
          >
            Enroll
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    setFormData((prev) => ({ ...prev, members: member }));
  }, [member]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (visible) {
      dispatch(getMembers());
      setFormData((prev) => ({
        ...prev,
        members: member,
        date: new Date().toISOString().split("T")[0],
      }));
    }
  }, [visible, dispatch, member]);

  const membersData = useSelector((state) => state.member.members);

  const memberOptions = useMemo(() => {
    if (
      !membersData ||
      !Array.isArray(membersData) ||
      membersData.length === 0
    ) {
      return [];
    }

    return membersData.map((m) => ({
      _id: m._id,
      title: `${m.firstName} ${m.lastName}`.trim(),
    }));
  }, [membersData]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (formData.eventType) {
      filtered = filtered.filter(
        (item) => item.event?.eventType === formData?.eventType,
      );
    }
    if (formData.date) {
      filtered = filtered.filter((item) => {
        const eventDate = new Date(item.eventDate).toDateString();
        const selectedDate = new Date(formData.date).toDateString();
        return eventDate === selectedDate;
      });
    }
    return filtered;
  }, [events, formData.eventType, formData.date]);

  return (
    <div>
      <CustomDialog
        title="Quick Enroll"
        visible={visible}
        size="large"
        onHide={() => {
          onHide();
          setFormData({
            eventType: "CLASS",
            date: new Date().toISOString().split("T")[0],
          });
        }}
      >
        <CustomForm>
          <CustomDropdown
            col={4}
            name="members"
            options={memberOptions}
            value={formData.members}
            onChange={(e) => handleChange("members", e.value)}
          />
          <CustomCalendarInput
            name="Date"
            dateString
            col={4}
            required
            data={formData}
            value={formData.date}
            onChange={(e) => handleChange("date", e.value)}
          />
          <CustomDropdown
            col={4}
            name="eventType"
            optionsType="eventTypes"
            value={formData.eventType}
            onChange={(e) => handleChange("eventType", e.value)}
          />
          <div className="c-col-12">
            <CustomSimpleTable columns={posColumns} data={filteredEvents} />
          </div>
        </CustomForm>
      </CustomDialog>
    </div>
  );
}
