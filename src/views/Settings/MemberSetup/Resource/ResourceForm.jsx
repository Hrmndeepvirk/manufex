import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useResourceRequest } from "../../../../hooks/useResourceRequest";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { ResourceAccessibilityOptions } from "@utils/dropdownConstants";
import {
  addOrUpdateResource,
  getResource,
  getResources,
} from "@store/settings/memberSetup/resourceActions";
import assets from "@shared/LayoutPlan/assets";
import CustomMultiSelectEditable from "../../../../shared/inputs/CustomMultiSelectEditable";
import ResourceUtils from "./ResourceUtils";

function ResourceForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const catalogItems = useSelector((state) => state.dropdown.catalogItems);
  const serviceOptions = useMemo(
    () => catalogItems.filter((item) => item.type === "SERVICE"),
    [catalogItems]
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    resourceType: "",
    resource: "",
    locations: [],
    membershipTypes: [],
    usedInEvents: true,
    pastDue: {},
    services: "",
    accessibility: "CHECKIN_EVENT_BOTH",
    isActive: true,
  });

  useEffect(() => {
    dispatch(getResources());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(
        getResource(id, setPageLoading, (res) => {
          setData({
            title: res.title,
            description: res.description,
            resourceType: res.resourceType,
            resource: res.resource,
            locations: res.locations,
            membershipTypes: res.membershipTypes,
            usedInEvents: res.usedInEvents,
            pastDue: res.pastDue,
            services: res.services?.map((s) => s._id || s) || [],
            accessibility: res.accessibility || "CHECKIN_EVENT_BOTH",
            isActive: res.isActive,
          });
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["services"])) {
      dispatch(
        addOrUpdateResource(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const resourceOptionTemplate = (option) => {
    return (
      <div className="flex justify-content-between align-items-center">
        <img src={option.src} style={{ width: "30px" }} />
        <div className="mx-2">{option.title}</div>
      </div>
    );
  };


  const { buttons } = useResourceRequest({
    permission: "REQUEST-RESOURCES",
    targetCollection: "RESOURCE",
    id,
    data,
    setData,
  });

  return (
    <FormPageLayout
      buttons={buttons}
      backText="Resource"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Resource">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomDropdown
          name={"resourceType"}
          onChange={handleChange}
          data={data}
          optionsType={"resourceTypes"}
          required
        />
        <CustomDropdown
          name={"resource"}
          onChange={handleChange}
          data={data}
          options={assets.map((item) => ({
            ...item,
            title: item.name,
            _id: item.name,
          }))}
          itemTemplate={resourceOptionTemplate}
        />
        <CustomMultiSelect
          name={"membershipTypes"}
          onChange={handleChange}
          data={data}
          optionsType={"membershipTypes"}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="usedInEvents"
          booleanOptions
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="accessibility"
          options={ResourceAccessibilityOptions}
        />

        <CustomInputDropdown
          name="pastDue"
          data={data}
          onChange={handleChange}
          valueName="value"
          unitName="type"
          options={[
            { title: "Minutes", _id: "MINUTES" },
            { title: "Hours", _id: "HOURS" },
          ]}
        />

        <CustomMultiSelect
          name={"services"}
          onChange={handleChange}
          data={data}
          options={serviceOptions}
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

      <ResourceUtils
        initialServices={data.locations}
        onServicesChange={(locations) =>
          handleChange({ name: "locations", value: locations })
        }
        errorMessage={data?.formErrors?.locations}
      />
    </FormPageLayout>
  );
}
export default React.memo(ResourceForm);
