import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { addOrUpdateAccessedSchedule } from "@store/settings/memberSetup/accessedScheduleActions";
import { useDispatch } from "react-redux";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createDefaultSlot = () => ({ startTime: "", endTime: "" });

const createDefaultSchedule = () =>
  WEEKDAYS.map((day) => ({
    day,
    enabled: false,
    slots: [createDefaultSlot()],
  }));

function AccessSchedulesTab({ data, pageLoading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState(createDefaultSchedule);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data?.schedule) {
      const schedules = data.schedule;
      setWeekSchedule((prev) =>
        prev.map((dayObj) => {
          const found = schedules[dayObj.day.toUpperCase()];
          if (found) {
            return {
              ...dayObj,
              enabled: found.enabled ?? false,
              slots:
                found.slots?.length > 0
                  ? found.slots.map((s) => ({
                      startTime: s.startTime || "",
                      endTime: s.endTime || "",
                    }))
                  : [createDefaultSlot()],
            };
          }
          return dayObj;
        }),
      );
    }
  }, [data]);

  const toggleDay = (dayIndex) => {
    setWeekSchedule((prev) =>
      prev.map((dayObj, i) =>
        i === dayIndex ? { ...dayObj, enabled: !dayObj.enabled } : dayObj,
      ),
    );
    clearDayErrors(dayIndex);
  };

  const isInteractiveElement = (target) =>
    !!target?.closest(
      "input, button, textarea, select, .p-inputtext, .p-button, .p-calendar, .p-dropdown, .p-timepicker",
    );

  const handleDayRowClick = (dayIndex, event) => {
    if (isInteractiveElement(event.target)) return;
    toggleDay(dayIndex);
  };

  const handleTimeChange = (dayIndex, slotIndex, field, value) => {
    setWeekSchedule((prev) =>
      prev.map((dayObj, i) =>
        i === dayIndex
          ? {
              ...dayObj,
              slots: dayObj.slots.map((slot, j) =>
                j === slotIndex ? { ...slot, [field]: value } : slot,
              ),
            }
          : dayObj,
      ),
    );
    clearSlotError(dayIndex, slotIndex, field);
  };

  const addSlot = (dayIndex) => {
    setWeekSchedule((prev) =>
      prev.map((dayObj, i) =>
        i === dayIndex
          ? { ...dayObj, slots: [...dayObj.slots, createDefaultSlot()] }
          : dayObj,
      ),
    );
  };

  const removeSlot = (dayIndex, slotIndex) => {
    setWeekSchedule((prev) =>
      prev.map((dayObj, i) =>
        i === dayIndex
          ? { ...dayObj, slots: dayObj.slots.filter((_, j) => j !== slotIndex) }
          : dayObj,
      ),
    );
    clearDayErrors(dayIndex);
  };

  const clearDayErrors = (dayIndex) => {
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${dayIndex}-`)) delete next[key];
      });
      return next;
    });
  };

  const clearSlotError = (dayIndex, slotIndex, field) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${dayIndex}-${slotIndex}-${field}`];
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    weekSchedule.forEach((dayObj, dayIndex) => {
      if (!dayObj.enabled) return;
      dayObj.slots.forEach((slot, slotIndex) => {
        if (!slot.startTime) {
          newErrors[`${dayIndex}-${slotIndex}-startTime`] =
            "Start time is required";
        }
        if (!slot.endTime) {
          newErrors[`${dayIndex}-${slotIndex}-endTime`] =
            "End time is required";
        }
        if (slot.startTime && slot.endTime && slot.endTime <= slot.startTime) {
          newErrors[`${dayIndex}-${slotIndex}-endTime`] =
            "End time must be after start time";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      accessSchedules: weekSchedule.reduce((acc, { day, enabled, slots }) => {
        acc[day.toUpperCase()] = {
          enabled,
          slots: enabled ? slots : [],
        };
        return acc;
      }, {}),
    };

    dispatch(
      addOrUpdateAccessedSchedule(
        id,
        { schedule: payload.accessSchedules },
        setLoading,
        (success, payload) => {
          if (success) {
            navigate(-1);
          } else {
            setErrors(payload || {});
          }
        },
      ),
    );
  };

  return (
    <FormPageLayout
      backText="Accessed Schedule"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Access Schedules">
        <div className="c-col-12">
          <div className="flex flex-column gap-3">
            {weekSchedule.map((dayObj, dayIndex) => (
              <div
                key={dayObj.day}
                className="border-1 border-round p-3"
                style={{ cursor: "pointer" }}
                onClick={(event) => handleDayRowClick(dayIndex, event)}
              >
                <div className="flex align-items-center justify-content-between mb-2">
                  <div className="flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      id={`day-${dayIndex}`}
                      checked={dayObj.enabled}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleDay(dayIndex)}
                    />
                    <label className="font-semibold select-none">
                      {dayObj.day}
                    </label>
                  </div>
                  {dayObj.enabled && (
                    <PrimaryButton
                      label="Add Slot"
                      icon="pi pi-plus"
                      size="small"
                      severity="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        addSlot(dayIndex);
                      }}
                    />
                  )}
                </div>

                {dayObj.enabled && (
                  <div className="flex flex-column gap-2 mt-2">
                    {dayObj.slots.map((slot, slotIndex) => {
                      const startErr =
                        errors[`${dayIndex}-${slotIndex}-startTime`];
                      const endErr = errors[`${dayIndex}-${slotIndex}-endTime`];

                      return (
                        <div
                          key={slotIndex}
                          className="flex align-items-start gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-column">
                            <CustomCalendarInput
                              label="Start Time"
                              name={`startTime-${dayIndex}-${slotIndex}`}
                              value={slot.startTime}
                              onChange={({ value }) =>
                                handleTimeChange(
                                  dayIndex,
                                  slotIndex,
                                  "startTime",
                                  value,
                                )
                              }
                              timeOnly
                              hourFormat="12"
                              col={12}
                              errorMessage={startErr}
                            />
                          </div>

                          <div className="flex flex-column">
                            <CustomCalendarInput
                              label="End Time"
                              name={`endTime-${dayIndex}-${slotIndex}`}
                              value={slot.endTime}
                              onChange={({ value }) =>
                                handleTimeChange(
                                  dayIndex,
                                  slotIndex,
                                  "endTime",
                                  value,
                                )
                              }
                              timeOnly
                              hourFormat="12"
                              col={12}
                              errorMessage={endErr}
                            />
                          </div>

                          {dayObj.slots.length > 1 && (
                            <div
                              className="flex align-items-center"
                              style={{ marginTop: "1.75rem" }}
                            >
                              <i
                                className="pi pi-trash cursor-pointer"
                                style={{ color: "var(--color-danger)" }}
                                title="Remove Slot"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSlot(dayIndex, slotIndex);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(AccessSchedulesTab);
