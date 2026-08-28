import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomPickList from "@inputs/CustomPickList";
import CustomTextArea from "@inputs/CustomTextArea";
import formValidation, { showFormErrors } from "@formValidations";
import { durationOptions } from "@utils/dropdownConstants";
import {
  addOrUpdateEventSetup,
  getEventSetup,
} from "@store/settings/scheduleSetup/eventSetupActions";
import { getEventCategories } from "@store/settings/scheduleSetup/eventCategoryActions";
import CustomMultiSelect from "../../../../../shared/inputs/CustomMultiSelect";

function General({ onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const locations = useSelector((state) => state.dropdown.locations);
  const eventCategories = useSelector(
    (state) => state.settings.scheduleSetup.eventCategories,
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    eventType: "CLASS",
    internalUse: false,

    eventCategory: null,
    locationType: null,
    location: null,
    defaultMaxAttendes: null,
    eventCommissionType: "NONE",
    availableOnline: false,
    trackAttendees: false,
    waitList: false,
    maximumWaitlist: 0,
    waitListExpirationIn: 0,
    waitListExpirationTime: "HOURS",
    waitListExpiration: "NONE",
    isActive: true,

    requiredToCreate: [],
    requiredToComplete: [],
    autoComplete: false,

    // Bookings & Cancellation
    overBooking: false,
    cancelNc: false,
    cancelC: false,
    rebook: false,

    // Durations
    duration: [],
    preparationTime: 0,
    recoveryTime: 0,
  });

  const filteredLocations = React.useMemo(() => {
    if (!data?.locationType) return [];
    return (locations || []).filter(
      (loc) => loc.locationType === data.locationType,
    );
  }, [locations, data.locationType]);

  const eventCategoryOptions = React.useMemo(
    () =>
      (eventCategories || []).map((category) => ({
        ...category,
        disabled: !category?.isActive,
      })),
    [eventCategories],
  );

  useEffect(() => {
    if (id) {
      dispatch(
        getEventSetup(id, setPageLoading, (res) => {
          setData({
            title: res?.title || "",
            description: res?.description || "",
            eventType: res?.eventType || "",
            internalUse: res?.internalUse ?? false,
            eventCategory: res?.eventCategory || null,
            locationType: res?.locationType || "",
            defaultMaxAttendes: res?.defaultMaxAttendes || "",
            eventCommissionType: res?.eventCommissionType || "",
            availableOnline: res?.availableOnline ?? false,
            trackAttendees: res?.trackAttendees ?? false,
            location: res?.location,
            waitList: res?.waitList ?? false,
            maximumWaitlist: res?.maximumWaitlist || "",
            waitListExpirationIn: res?.waitListExpirationIn || "",
            waitListExpirationTime: res?.waitListExpirationTime || "",
            waitListExpiration: res?.waitListExpiration || "",
            isActive: res?.isActive ?? true,      
            requiredToCreate: res?.requiredToCreate || [],
            requiredToComplete: res?.requiredToComplete || [],
            autoComplete: res?.autoComplete ?? false,

            // Bookings & Cancellation
            overBooking: res?.overBooking ?? false,
            cancelNc: res?.cancelNc ?? false,
            cancelC: res?.cancelC ?? false,
            rebook: res?.rebook ?? false,

            // Durations
            duration: res?.duration || [],
            preparationTime: res?.preparationTime ?? 0,
            recoveryTime: res?.recoveryTime ?? 0,
          });
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    if (!eventCategories?.length) {
      dispatch(getEventCategories());
    }
  }, [dispatch, eventCategories?.length]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateEventSetup(id, data, setLoading, (res, payload) => {
          if (res) {
            if (next) {
              onSaveSuccess?.(payload?._id);
            } else {
              navigate(-1);
            }
          } else {
            setData((prev) => ({ ...prev, payload }));
          }
        }),
      );
    }
  };

  return (
    <FormPageLayout
      onSubmit={handleSubmit}
      onSubmitNextTab={handleSubmit}
      submitLoading={loading}
      backText="Event Setup"
      pageLoading={pageLoading}
    >
      <CustomCard title="General">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomDropdown
          name="eventType"
          optionsType={"eventTypes"}
          onChange={handleChange}
          data={data}
          disabled={!!id}
        />
        <CustomDropdown
          name="eventCategory"
          options={eventCategoryOptions}
          optionDisabled="disabled"
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="internalUse"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="locationType"
          optionsType={"locationTypes"}
          onChange={handleChange}
          required
          data={data}
        />
        <CustomDropdown
          name="location"
          options={filteredLocations}
          onChange={handleChange}
          required
          data={data}
        />
        <CustomNumberInput
          name="defaultMaxAttendes"
          onChange={handleChange}
          data={data}
          required
        />
        <CustomDropdown
          name="eventCommissionType"
          optionsType={"eventCommissionTypes"}
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="availableOnline"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="trackAttendees"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="waitList"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        {data?.waitList && (
          <>
            <CustomDropdown
              name="maximumWaitlist"
              onChange={handleChange}
              optionsType="maximumWaitListTypes"
              data={data}
            />
            <CustomNumberInput
              name="waitListExpirationIn"
              onChange={handleChange}
              data={data}
            />
            <CustomDropdown
              name="waitListExpirationTime"
              optionsType={"waitListExpirationTimeTypes"}
              onChange={handleChange}
              data={data}
            />
            <CustomDropdown
              name="waitListExpiration"
              optionsType="waitListExpirationTypes"
              //   label={`Expires ${data?.CustomNumberInput}-${data?.waitListExpirationTime} before`}
              onChange={handleChange}
              data={data}
            />
          </>
        )}
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
        <CustomCheckbox
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Active"
          col={12}
        />
      </CustomCard>

      <CustomCard title="Required to Create/Complete Event">
        <CustomMultiSelect
          name="requiredToCreate"
          onChange={handleChange}
          data={data}
          optionsType="RequiredToCreateOptions"
        />
        <CustomMultiSelect
          name="requiredToComplete"
          onChange={handleChange}
          data={data}
          optionsType="RequiredToCompleteOptions"
        />
        <CustomDropdown
          name="autoComplete"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
      </CustomCard>

      <CustomCard title="Bookings & Cancellation">
        <CustomDropdown
          name="overBooking"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="cancelNc"
          label={"Cancel (No Charge)"}
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="cancelC"
          label={"Cancel (Charge)"}
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomDropdown
          name="rebook"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
      </CustomCard>

      <CustomCard title="Durations">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="duration"
          options={durationOptions}
          required
          hideLabel
          showTargetControls
        />
        <CustomNumberInput
          name="preparationTime"
          label="Preparation Time (in minutes)"
          onChange={handleChange}
          data={data}
          col={6}
        />
        <CustomNumberInput
          name="recoveryTime"
          label="Recovery Time (in minutes)"
          onChange={handleChange}
          data={data}
          col={6}
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(General);
