import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";

import {
  addOrUpdateCatalogSubCategoryGroup,
  getCatalogSubCategoryGroup,
} from "../../../../store/settings/inventory/catalogSubCategoryGroupActions";

const getDefaultData = (subCategoryId) => ({
  title: "",
  description: "",
  displayInPos: true,
  posButtonLabel: "",
  subCategory: subCategoryId || null,
  icon: "bi bi-grid",
  isActive: true,
});

function CatalogSubCategoryGroupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, subCategoryId } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [data, setData] = useState(getDefaultData(subCategoryId));
  const getResolvedSubCategoryId = () => subCategoryId || data.subCategory || null;

  useEffect(() => {
    let ignore = false;

    if (id === "new") {
      setPageLoading(false);
      setData(getDefaultData(subCategoryId));
      return () => {
        ignore = true;
      };
    }

    if (id) {
      dispatch(
          getCatalogSubCategoryGroup(id, setPageLoading, (res) => {
          if (ignore) return;
          setData({
            title: res.title || "",
            description: res.description || "",
            displayInPos: res.displayInPos,
            posButtonLabel: res.posButtonLabel || "",
            subCategory: subCategoryId || res.subCategory?._id || res.subCategory || null,
            isActive: res.isActive,
            icon: res.icon || "bi bi-grid",
          });
        }, () => ignore)
      );
    } else {
      setData(getDefaultData(subCategoryId));
    }

    return () => {
      ignore = true;
    };
  }, [id, subCategoryId, dispatch]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    if (name === "posButtonLabel" && value?.trim()) {
      formErrors = { ...formErrors, posButtonLabel: "" };
    }
    if (name === "displayInPos" && !value && data.formErrors?.posButtonLabel) {
      formErrors = { ...formErrors, posButtonLabel: "" };
    }
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resolvedSubCategoryId = getResolvedSubCategoryId();

    if (!resolvedSubCategoryId) {
      alert("Sub-category missing from route.");
      return;
    }

    if (!showFormErrors(data, setData)) {
      return;
    }

    if (data.displayInPos && !data.posButtonLabel?.trim()) {
      setData((prev) => ({
        ...prev,
        formErrors: {
          ...prev.formErrors,
          posButtonLabel: "Pos Button Label is required!",
        },
      }));
      setTimeout(() => {
        const element = document.getElementById("error-element");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    dispatch(
      addOrUpdateCatalogSubCategoryGroup(
        id !== "new" ? id : null,
        {
          ...data,
          subCategory: resolvedSubCategoryId,
        },
        setLoading,
        (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }
      )
    );
  };

  const selectedIconTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <i className={option._id}></i>
          <div className="ml-2">{option.title}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const iconOptionTemplate = (option) => (
    <div className="flex align-items-center">
      <i className={option._id}></i>
      <div className="ml-2">{option.title}</div>
    </div>
  );

  return (
    <FormPageLayout
      backText="Catalog Sub Category Groups"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Catalog Sub-Category Group Details">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="displayInPos"
          booleanOptions
        />

        <CustomInput
          data={data}
          onChange={handleChange}
          name="posButtonLabel"
          required={data.displayInPos}
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="icon"
          optionsType="InventoryCategoryIcons"
          valueTemplate={selectedIconTemplate}
          itemTemplate={iconOptionTemplate}
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
        />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(CatalogSubCategoryGroupForm);
