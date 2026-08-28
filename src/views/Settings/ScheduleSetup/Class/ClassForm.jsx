import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";
import { useServerTime } from "../../../../hooks/useServerTime";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import { formatEnum } from "@utils/common";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import formValidation, { showFormErrors } from "@formValidations";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import {
  addOrUpdateClass,
  createClassEvents,
  editClassEvents,
  getClass,
  getEmployeePays,
  getEventData,
} from "../../../../store/settings/scheduleSetup/classActions";

function ClassForm() {
  const { getServerDate } = useServerTime();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);
  const [availableOnline, setAvailableOnline] = useState(false);
  const [durations, setDurations] = useState([]);
  const [payTypes, setPayTypes] = useState({});
  const [allowWaitList, setAllowWaitList] = useState(false);

  const events = useSelector((state) => state.dropdown.eventSetups);
  const employees = useSelector((state) => state.dropdown.employees);
  const classesTypes = events?.filter((e) => e.eventType === "CLASS");

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [data, setData] = useState({
    description: "",
    event: null,
    classMeet: "ONE_TIME",
    classLocation: null,
    eventDate: "",
    resource: null,
    startDate: "",
    totalCapacity: 0,
    days: [],
    day: "",
    staff: null,
    employeePayType: null,
    endDate: "",
    schedules: {},
    assistants: [],
    signUpNowAndPayLater: false,
    attendForFree: false,
    onlineCapacity: 0,
    signUpOnline: false,
    waitlistPeople: 0,
  });

  const allSelectedStaff = useMemo(() => {
    const ids = [];

    if (data?.staff) ids.push(data.staff);

    data?.assistants?.forEach((a) => {
      if (a.staff) ids.push(a.staff);
    });

    return [...new Set(ids)];
  }, [data.staff, data.assistants]);

  useEffect(() => {
    if (data.event) {
      dispatch(
        getEventData(data.event, setLoading, (success, eventData) => {
          if (success) {
            setLocations(eventData.locations);
            setAvailableOnline(eventData?.availableOnline);
            setData((prev) => ({
              ...prev,
              totalCapacity: prev.totalCapacity || eventData.defaultMaxAttendes,
            }));
            setDurations(eventData?.duration);
            setAllowWaitList(eventData?.waitList);
          }
        }),
      );
    }
  }, [data.event]);

  useEffect(() => {
    if (!allSelectedStaff.length) return;

    allSelectedStaff.forEach((empId) => {
      if (payTypes[empId]) return;

      dispatch(
        getEmployeePays(empId, setEmployeeLoading, (success, res) => {
          if (success) {
            setPayTypes((prev) => ({ ...prev, [empId]: res }));
          }
        }),
      );
    });
  }, [allSelectedStaff]);

  useEffect(() => {
    if (!data?.days?.length) return;

    setData((prev) => {
      const updated = { ...prev.schedules };

      data.days.forEach((day) => {
        if (!updated[day]) {
          updated[day] = { startTime: null, duration: null };
        }
      });

      // remove unselected days
      Object.keys(updated).forEach((key) => {
        if (!data.days.includes(key)) {
          delete updated[key];
        }
      });

      return { ...prev, schedules: updated };
    });
  }, [data.days]);

  const durationOptions = durations.map((item) => ({
    title: `${item} minutes`,
    _id: item,
  }));

  const getPayTypeOptions = (empId) =>
    payTypes[empId]?.map((item) => ({
      title: formatEnum(item?.payType),
      _id: item?._id,
    })) || [];

  useEffect(() => {
    if (id) {
      dispatch(
        getClass(id, setLoading, (res) => {
          setData({
            event: res?.event,
            classMeet: res?.classMeet,
            day: res?.day,
            startTime: res?.startTime,
            eventDate: res?.eventDate,
            startDate: res?.startDate,
            endDate: res?.endDate,
            duration: Number(res?.duration),
            classLocation: res?.location,
            days: res?.days,
            schedules: res?.schedules,
            resource: res?.resource,
            staff: res?.employee,
            employeePayType: res?.employeePayType,
            totalCapacity: res?.totalCapacity,
            waitlistPeople: res?.waitlistPeople,
            onlineCapacity: res?.onlineCapacity,
            signUpOnline: res?.signUpOnline,
            attendForFree: res?.attendForFree,
            signUpNowAndPayLater: res?.signUpNowAndPayLater,
            date: res?.date,
            assistants:
              res?.assistants?.map((a) => ({
                staff: a.employee,
                payType: a.payType,
              })) || [],
          });
        }),
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);

    if (name === "classMeet") {
      setData((prev) => ({
        ...prev,
        classMeet: value,

        eventDate: "",
        startTime: null,
        duration: null,
        day: null,
        days: [],
        date: null,
        schedules: {},

        formErrors: {},
      }));
      return;
    }

    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleScheduleChange = (day, { name, value }) => {
    setData((prev) => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [day]: {
          ...prev.schedules[day],
          [name]: value,
        },
      },
    }));
  };

  // Assistants handlers
  const handleAddAssistant = () => {
    setData((prev) => ({
      ...prev,
      assistants: [...(prev.assistants || []), { staff: null, payType: null }],
    }));
  };

  const handleRemoveAssistant = (index) => {
    setData((prev) => ({
      ...prev,
      assistants: prev.assistants.filter((_, i) => i !== index),
    }));
  };

  const handleAssistantChange = (index, { name, value }) => {
    setData((prev) => {
      const updated = [...prev.assistants];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, assistants: updated };
    });
  };

  // submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let payload;

    // Custom Payloads according to class Types
    switch (data?.classMeet) {
      case "ONE_TIME":
        payload = {
          event: data?.event,
          eventDate: data?.eventDate,
          startTime: data?.startTime,
          duration: data?.duration,
          location: data?.classLocation,
          resource: data?.resource,
          employee: data?.staff,
          employeePayType: data?.employeePayType,
          totalCapacity: data?.totalCapacity,
          assistants: data?.assistants?.map((a) => ({
            employee: a?.staff,
            payType: a?.payType,
          })),
          signUpNowAndPayLater: data?.signUpNowAndPayLater,
          attendForFree: data?.attendForFree,
          signUpOnline: data?.signUpOnline,
          onlineCapacity: data?.onlineCapacity,
          waitlistPeople: data?.waitlistPeople,
        };
        break;

      case "WEEKLY":
        payload = {
          event: data?.event,
          day: data?.day,
          startDate: data?.startDate,
          endDate: data?.endDate,
          startTime: data?.startTime,
          duration: data?.duration,
          location: data?.classLocation,
          resource: data?.resource,
          employee: data?.staff,
          employeePayType: data?.employeePayType,
          totalCapacity: data?.totalCapacity,
          assistants: data?.assistants?.map((a) => ({
            employee: a?.staff,
            payType: a?.payType,
          })),
          signUpNowAndPayLater: data?.signUpNowAndPayLater,
          attendForFree: data?.attendForFree,
          signUpOnline: data?.signUpOnline,
          onlineCapacity: data?.onlineCapacity,
          waitlistPeople: data?.waitlistPeople,
        };
        break;

      case "CUSTOM":
      case "BIWEEKLY":
        payload = {
          event: data?.event,
          days: data?.days,
          startDate: data?.startDate,
          endDate: data?.endDate,
          location: data?.classLocation,
          resource: data?.resource,
          employee: data?.staff,
          employeePayType: data?.employeePayType,
          totalCapacity: data?.totalCapacity,
          assistants: data?.assistants?.map((a) => ({
            employee: a?.staff,
            payType: a?.payType,
          })),
          schedules: data?.schedules,
          signUpNowAndPayLater: data?.signUpNowAndPayLater,
          attendForFree: data?.attendForFree,
          signUpOnline: data?.signUpOnline,
          onlineCapacity: data?.onlineCapacity,
          waitlistPeople: data?.waitlistPeople,
        };
        break;

      case "MONTHLY":
        payload = {
          event: data?.event,
          startDate: data?.startDate,
          endDate: data?.endDate,
          date: data?.date,
          duration: data?.duration,
          startTime: data?.startTime,
          location: data?.classLocation,
          resource: data?.resource,
          employee: data?.staff,
          employeePayType: data?.employeePayType,
          assistants: data?.assistants?.map((a) => ({
            employee: a?.staff,
            payType: a?.payType,
          })),
          totalCapacity: data?.totalCapacity,
          signUpNowAndPayLater: data?.signUpNowAndPayLater,
          attendForFree: data?.attendForFree,
          signUpOnline: data?.signUpOnline,
          onlineCapacity: data?.onlineCapacity,
          waitlistPeople: data?.waitlistPeople,
        };
        break;

      default:
        return;
    }

    if (!id) {
      dispatch(
        createClassEvents(
          data?.classMeet,
          setSubmitLoading,
          payload,
          (success, res) => {
            if (success) {
              navigate(-1);
            } else {
            }
          },
        ),
      );
    } else {
      customConfirmDialog({
        message:
          data?.classMeet !== "ONE_TIME"
            ? "Changes you made will reset your settings for the upcoming events. Are you sure you want to edit this class?"
            : "Are you sure you want to edit this class?",
        accept: () => {
          dispatch(
            editClassEvents(id, setSubmitLoading, payload, (success, res) => {
              if (success) {
                navigate(-1);
              } else {
              }
            }),
          );
        },
        reject: () => {},
      });
    }
  };

  // Selected staff
  const selectedStaffIds = React.useMemo(() => {
    const ids = [];

    if (data?.staff) ids.push(data.staff);

    if (data?.assistants?.length) {
      data.assistants.forEach((a) => {
        if (a.staff) ids.push(a.staff);
      });
    }

    return ids;
  }, [data.staff, data.assistants]);

  const filterStaffOptions = (options, currentValue) => {
    return options?.filter((opt) => {
      // allow currently selected value
      if (opt._id === currentValue) return true;

      // block already selected ones
      return !selectedStaffIds.includes(opt._id);
    });
  };


  const { buttons } = useResourceRequest({
    permission: "REQUEST-CLASSES",
    targetCollection: "CLASS",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Classes"
      onSubmit={handleSubmit}
      submitLoading={submitLoading}
    >
      <CustomCard title="When and Where">
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="event"
          disabled={id}
          loading={loading}
          options={classesTypes}
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="classMeet"
          disabled={id}
          optionsType="ClassMeetTypes"
        />
        {data?.classMeet === "ONE_TIME" && (
          <>
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="eventDate"
              minDate={getServerDate()}
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startTime"
              timeOnly
            />
            <CustomDropdown
              name="duration"
              data={data}
              options={durationOptions}
              onChange={handleChange}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="classLocation"
              options={locations}
            />
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="resource"
              optionsType="resources"
            />
          </>
        )}

        {data?.classMeet === "WEEKLY" && (
          <>
            <CustomDropdown
              name="day"
              data={data}
              onChange={handleChange}
              optionsType="WeekDays"
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startDate"
              minDate={getServerDate()}
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="endDate"
              minDate={data?.startDate ? new Date(data?.startDate) : null}
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startTime"
              timeOnly
            />
            <CustomDropdown
              name="duration"
              data={data}
              options={durationOptions}
              onChange={handleChange}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="classLocation"
              options={locations}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="resource"
              optionsType="resources"
            />
          </>
        )}

        {data?.classMeet === "BIWEEKLY" && (
          <>
            <CustomMultiSelect
              name="days"
              data={data}
              onChange={handleChange}
              optionsType="WeekDays"
              selectionLimit={2}
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startDate"
              minDate={getServerDate()}
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="endDate"
              dateString
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="classLocation"
              options={locations}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="resource"
              optionsType="resources"
            />
            <div className="c-col-8"></div>

            {!!data?.days?.length &&
              data?.days?.map((item) => (
                <React.Fragment key={item}>
                  <CustomCalendarInput
                    data={data.schedules[item]}
                    onChange={(e) => handleScheduleChange(item, e)}
                    name="startTime"
                    label={`Start Time For ${formatEnum(item)} Class`}
                    timeOnly
                    col={3}
                  />

                  <CustomDropdown
                    name="duration"
                    data={data.schedules[item]}
                    onChange={(e) => handleScheduleChange(item, e)}
                    label={`Duration For ${formatEnum(item)} Class`}
                    options={durationOptions}
                    col={3}
                    selectionLimit={2}
                  />
                </React.Fragment>
              ))}
          </>
        )}

        {data?.classMeet === "MONTHLY" && (
          <>
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startDate"
              minDate={getServerDate()}
              label="Start Interval"
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="endDate"
              minDate={data?.startDate ? new Date(data?.startDate) : null}
              label="End Internal"
              dateString
            />
            <CustomDropdown
              name="date"
              data={data}
              onChange={handleChange}
              optionsType="monthDaysOptions"
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startTime"
              timeOnly
            />
            <CustomDropdown
              name="duration"
              data={data}
              onChange={handleChange}
              options={durationOptions}
            />
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="classLocation"
              options={locations}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="resource"
              optionsType="resources"
            />
          </>
        )}

        {data?.classMeet === "CUSTOM" && (
          <>
            <CustomMultiSelect
              name="days"
              data={data}
              onChange={handleChange}
              optionsType="WeekDays"
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="startDate"
              // minDate={getServerDate()}
              dateString
            />
            <CustomCalendarInput
              data={data}
              onChange={handleChange}
              name="endDate"
              minDate={data?.startDate ? new Date(data?.startDate) : null}
              dateString
            />
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="classLocation"
              options={locations}
            />

            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="resource"
              optionsType="resources"
            />
            <div className="c-col-8"></div>

            {!!data?.days?.length &&
              data?.days?.map((item) => (
                <React.Fragment key={item}>
                  <CustomCalendarInput
                    data={data.schedules[item]}
                    onChange={(e) => handleScheduleChange(item, e)}
                    name="startTime"
                    label={`Start Time For ${formatEnum(item)} Class`}
                    timeOnly
                    col={3}
                  />

                  <CustomDropdown
                    name="duration"
                    data={data.schedules[item]}
                    onChange={(e) => handleScheduleChange(item, e)}
                    label={`Duration For ${formatEnum(item)} Class`}
                    options={durationOptions}
                    col={3}
                    selectionLimit={2}
                  />
                </React.Fragment>
              ))}
          </>
        )}
      </CustomCard>

      <CustomCard
        title="Instructor"
        actions
        addTitle="Add Assistant"
        onAdd={handleAddAssistant}
      >
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="staff"
          loading={employeeLoading}
          options={filterStaffOptions(employees, data?.staff)}
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="employeePayType"
          options={getPayTypeOptions(data.staff)}
        />

        <div className="c-grid c-col-12">
          {data?.assistants?.map((assistant, index) => (
            <>
              <CustomDropdown
                data={assistant}
                onChange={(e) => handleAssistantChange(index, e)}
                name="staff"
                loading={employeeLoading}
                options={filterStaffOptions(employees, assistant?.staff)}
                label={`Assistant`}
              />

              <CustomDropdown
                data={assistant}
                onChange={(e) => handleAssistantChange(index, e)}
                name="payType"
                options={getPayTypeOptions(assistant.staff)}
              />

              <PrimaryButton
                onClick={() => handleRemoveAssistant(index)}
                className="mt-4"
                label="Remove"
                severity="secondary"
              />
            </>
          ))}
        </div>
      </CustomCard>

      <CustomCard title="Participants">
        <CustomNumberInput
          name="totalCapacity"
          data={data}
          onChange={handleChange}
        />

        {allowWaitList && (
          <CustomNumberInput
            name="waitlistPeople"
            data={data}
            onChange={handleChange}
          />
        )}
      </CustomCard>

      {availableOnline && (
        <>
          <CustomCard title="Online Scheduling">
            <CustomCheckbox
              data={data}
              onChange={handleChange}
              name="signUpOnline"
              label="Allow clients to sign up for this online"
              col={12}
            />
            {data?.signUpOnline && (
              <CustomNumberInput
                name="onlineCapacity"
                data={data}
                onChange={handleChange}
              />
            )}
          </CustomCard>
        </>
      )}

      <CustomCard title="Pricing">
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="signUpNowAndPayLater"
          label="Allow clients to sign up now and pay later"
          col={12}
        />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="attendForFree"
          label="Clients can attend this class for free"
          col={12}
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(ClassForm);
