import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import CustomTextArea from "@inputs/CustomTextArea";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateEventSetup,
  getEventSetup,
} from "@store/settings/scheduleSetup/eventSetupActions";
import { EventOccurancesTypes } from "@utils/dropdownConstants";

function Online({ onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    eventNotification: false,
    message: "",
    cancelLink: false,

    timeBeforeEventReminder: { value: 0, type: "MINUTES" },
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getEventSetup(id, setPageLoading, (res) => {
          setData({
            eventNotification: res?.eventNotification,
            message: res?.message,
            cancelLink: res?.cancelLink,
            timeBeforeEventReminder: res?.timeBeforeEventReminder,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateEventSetup(id, data, setLoading, (success, formErrors) => {
          if (success) {
            if (next) {
              onSaveSuccess?.();
            } else {
              navigate(-1);
            }
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
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
      <CustomCard title="Allow Booking an Appointment">
        <CustomInputDropdown
          name="appointmentAtLeast"
          options={EventOccurancesTypes}
          onChange={handleChange}
          data={data}
          numericOnly
          col={3}
        />
        <CustomInputDropdown
          name="appointmentUntil"
          options={EventOccurancesTypes}
          onChange={handleChange}
          data={data}
          numericOnly
          col={3}

        />
      </CustomCard>

      <CustomCard title="Cancellation">
        <CustomDropdown
          name="cancelOnline"
          booleanOptions
          onChange={handleChange}
          data={data}
        />
        <CustomInputDropdown
          name="timeBeforeEvent"
          options={EventOccurancesTypes}
          onChange={handleChange}
          data={data}
          numericOnly
          col={3}

        />
      </CustomCard>
      <CustomCard title="Terms and Conditions">
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="termAndCondition"
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(Online);
