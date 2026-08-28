import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import ListPageLayout from "@shared/layout/ListPageLayout";

import {
  addOrUpdateCatalogSubCategory,
  getCatalogSubCategory,
} from "../../../../store/settings/inventory/catalogSubCategoryActions";
import {
  getCatalogSubCategoryGroups,
  deleteCatalogSubCategoryGroup,
} from "../../../../store/settings/inventory/catalogSubCategoryGroupActions";
import { clearCatalogSubCategoryGroups } from "../../../../store/settings/inventory/inventorySlice";

const getDefaultData = (categoryId) => ({
  title: "",
  description: "",
  displayInPos: true,
  posButtonLabel: "",
  category: categoryId || null,
  icon: "bi bi-grid",
  isActive: true,
});

function CatalogSubCategoryForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, categoryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);

  const groups = useSelector(
    (state) => state.settings.inventory.catalogSubCategoryGroups
  );

  const [data, setData] = useState(getDefaultData(categoryId));

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "posButtonLabel" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (groupId) => {
    navigate(
      `/settings/inventory-setup/catalog-category/${categoryId}/catalog-sub-category/${id}/catalog-sub-category-group/${groupId}`
    );
  };


  const onDelete = (groupId) => {
    dispatch(deleteCatalogSubCategoryGroup(groupId, id));
  };

  useEffect(() => {
    let ignore = false;

    dispatch(clearCatalogSubCategoryGroups());

    if (id === "new") {
      setPageLoading(false);
      setData(getDefaultData(categoryId));
      return () => {
        ignore = true;
      };
    }

    if (id) {
      dispatch(
        getCatalogSubCategory(id, setPageLoading, (res) => {
          if (ignore) return;
          setData({
            title: res.title || "",
            description: res.description || "",
            displayInPos: res.displayInPos,
            posButtonLabel: res.posButtonLabel || "",
            category: res.category || categoryId || null,
            isActive: res.isActive,
            icon: res.icon || "bi bi-grid",
          });
        }, () => ignore)
      );

      dispatch(
        getCatalogSubCategoryGroups(id, setGroupLoading, () => ignore)
      );
    } else {
      setData(getDefaultData(categoryId));
    }

    return () => {
      ignore = true;
    };
  }, [id, categoryId, dispatch]);

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
      addOrUpdateCatalogSubCategory(
        id !== "new" ? id : null,
        data,
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

  const selectedCountryTemplate = (option, props) => {
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

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={option._id}></i>
        <div className="ml-2">{option.title}</div>
      </div>
    );
  };

  return (
    <FormPageLayout
      backText="Catalog Sub Categories"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Catalog Sub-Category Details">
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
          valueTemplate={selectedCountryTemplate}
          itemTemplate={countryOptionTemplate}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="category"
          optionsType="catalogCategories"
          required
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

      {id && id !== "new" && (
        <ListPageLayout
          buttonLabel="Add  Category Group"
          linkTo={`/settings/inventory-setup/catalog-category/${categoryId}/catalog-sub-category/${id}/catalog-sub-category-group/new`}
          searchable={["title"]}
          tableData={groups}
          columns={columns}
          loading={groupLoading}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </FormPageLayout>
  );
}

export default React.memo(CatalogSubCategoryForm);
