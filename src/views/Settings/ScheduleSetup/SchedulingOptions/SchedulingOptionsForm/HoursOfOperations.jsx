import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { WeekDays } from "@utils/dropdownConstants";
import {
  addOrUpdateScheduleOption,
  getSchedulingOptions,
} from "@store/settings/scheduleSetup/schedulingOptionsActions";
import {
  AllowPastBookingsOptions,
  AllowOffHoursBookingsOptions,
} from "../../../../../utils/dropdownConstants";

function HoursOfOperationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const schedulingOptions = useSelector(
    (state) => state.settings.scheduleSetup.schedulingOptions
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    hoursOperation: [
      {
        days: [],
        startTime: null,
        endTime: null,
      },
    ],
    allowWaitlist: false,
    requireComment: false,
    allowOffHoursBookings: "",
    allowPastBookings: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(getSchedulingOptions(setPageLoading));
  }, []);

  useEffect(() => {
    if (schedulingOptions && Object.keys(schedulingOptions).length > 0) {
      setData({
        hoursOperation:
          schedulingOptions.hoursOperation?.length > 0
            ? schedulingOptions.hoursOperation
            : [
                {
                  days: [],
                  startTime: null,
                  endTime: null,
                },
              ],
        allowWaitlist: schedulingOptions.allowWaitlist ?? false,
        requireComment: schedulingOptions.requireComment ?? false,
        isActive: schedulingOptions.isActive ?? true,
        allowPastBookings: schedulingOptions?.allowPastBookings,
        allowOffHoursBookings: schedulingOptions?.allowOffHoursBookings,
      });
    }
  }, [schedulingOptions]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({
      ...prev,
      [name]: value,
      formErrors,
    }));
  };

  const handleScheduleChange = ({ name, value }, index) => {
    setData((prev) => {
      const updated = [...prev.hoursOperation];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, hoursOperation: updated };
    });
  };

  const getFilteredWeekdays = (currentIndex) => {
    let usedDays = [];

    data.hoursOperation.forEach((item, i) => {
      if (i !== currentIndex && Array.isArray(item.days)) {
        usedDays.push(...item.days);
      }
    });

    return WeekDays.filter((item) => !usedDays.includes(item._id));
  };

  const onAddNewSchedule = () => {
    setData((prev) => ({
      ...prev,
      hoursOperation: [
        ...prev.hoursOperation,
        {
          days: [],
          startTime: null,
          endTime: null,
        },
      ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateScheduleOption(
          id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) navigate(-1);
            else setData((prev) => ({ ...prev, formErrors }));
          }
        )
      );
    }
  };

  const totalSelectedDays = data.hoursOperation
    .map((row) => row.days || [])
    .flat().length;

  const allDaysUsed = totalSelectedDays >= WeekDays.length;

  const handleRemoveSchedule = (index) => {
    setData((prev) => ({
      ...prev,
      hoursOperation: prev.hoursOperation.filter((_, i) => i !== index),
    }));
  };

  return (
    <FormPageLayout
      onSubmit={handleSubmit}
      submitLoading={loading}
      backText="Scheduling Options"
      loading={pageLoading}
    >
      <CustomCard title="Hours of Operation">
        {data.hoursOperation.map((item, index) => (
          <React.Fragment key={index}>
            <CustomMultiSelect
              data={item}
              name="days"
              onChange={(e) => handleScheduleChange(e, index)}
              options={getFilteredWeekdays(index)} // object list
              col={3}
            />

            <CustomCalendarInput
              data={item}
              onChange={(e) => handleScheduleChange(e, index)}
              name="startTime"
              timeOnly
            />

            <CustomCalendarInput
              data={item}
              onChange={(e) => handleScheduleChange(e, index)}
              name="endTime"
              timeOnly
            />

            {index === 0 && (
              <div className="c-col-12 md:c-col-1 mt-4">
                <PrimaryButton
                  type="button"
                  label="Add"
                  className="w-full"
                  disabled={allDaysUsed}
                  onClick={onAddNewSchedule}
                />
              </div>
            )}

            {index > 0 && (
              <div className="c-col-12 md:c-col-1 mt-4">
                <PrimaryButton
                  type="button"
                  className="w-full"
                  label="Remove"
                  severity="secondary"
                  onClick={() => handleRemoveSchedule(index)}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </CustomCard>

      <CustomCard title="Booking Rules">
        <CustomDropdown
          data={data}
          onChange={handleChange}
          options={AllowPastBookingsOptions}
          name="allowPastBookings"
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          options={AllowOffHoursBookingsOptions}
          name="allowOffHoursBookings"
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="allowWaitlist"
          booleanOptions
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="requireComment"
          label="Require Comment (Cancel - No Charge)"
          booleanOptions
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(HoursOfOperationForm);
