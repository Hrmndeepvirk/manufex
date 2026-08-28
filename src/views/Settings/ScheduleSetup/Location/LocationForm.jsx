import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";

import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@shared/inputs/CustomDropdown";

import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateLocation,
  getLocation,
} from "@store/settings/scheduleSetup/locationActions";
import { getLocationTypes } from "@store/settings/scheduleSetup/locationTypeActions";
import CustomAddress from "@inputs/CustomAddress";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomLayoutPlan from "../../../../shared/LayoutPlan/customLayoutPlan";
import CustomCard from "../../../../shared/cards/CustomCard";

function LocationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const layoutRef = useRef();
  const locationTypes = useSelector(
    (state) => state.settings.scheduleSetup.locationTypes,
  );
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    clubs: [],
    locationType: "",
    outsideLocation: false,
    address: {},
    setupLayout: false,
    resourcesLayout: [],
    resources: [],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getLocation(id, setPageLoading, (res) => {
          setData({
            title: res.title,
            clubs: res.clubs,
            locationType: res.locationType,
            outsideLocation: res.outsideLocation,
            address: res.address || {},
            description: res.description,
            setupLayout: res.setupLayout,
            resourcesLayout: res.resourcesLayout,
            resources: res.resources || [],
            isActive: res.isActive,
          });
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    if (!locationTypes?.length) {
      dispatch(getLocationTypes());
    }
  }, [dispatch, locationTypes?.length]);

  const locationTypeOptions = React.useMemo(
    () =>
      (locationTypes || []).map((type) => ({
        ...type,
        disabled: !type?.isActive,
      })),
    [locationTypes],
  );

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, ["address"]);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["address"])) {
      dispatch(
        addOrUpdateLocation(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }),
      );
    }
  };

  return (
    <FormPageLayout
      backText="Location"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Location">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="locationType"
          options={locationTypeOptions}
          optionDisabled="disabled"
          required
        />
        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="clubs"
          optionsType="clubs"
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="outsideLocation"
          booleanOptions
        />
        {data?.outsideLocation && (
          <CustomAddress
            data={data}
            onChange={handleChange}
            name="address"
            required
          />
        )}
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="setupLayout"
          label="Does this location have a resource layout?"
          booleanOptions
        />
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
      {data?.setupLayout && (
        <CustomCard
          title="Resource Layout"
          actions
          buttons={[
            {
              label: "Layout Plan",
              onClick: () => layoutRef.current?.openConfig(),
            },
          ]}
        >
          <CustomLayoutPlan
            ref={layoutRef}
            name="resourcesLayout"
            data={data}
            options={data?.resources || []}
            onChange={handleChange}
          />
        </CustomCard>
      )}
    </FormPageLayout>
  );
}

export default React.memo(LocationForm);
