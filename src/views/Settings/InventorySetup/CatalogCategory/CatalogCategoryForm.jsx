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
  addOrUpdateCatalogCategory,
  getCatalogCategory,

} from "../../../../store/settings/inventory/catalogCategoryActions";
import {
  getCatalogSubCategories,
  deleteCatalogSubCategory,
} from "../../../../store/settings/inventory/catalogSubCategoryActions";
import {
  clearCatalogSubCategories,
} from "../../../../store/settings/inventory/inventorySlice";

const getDefaultData = (categoryId = null) => ({
  title: "",
  description: "",
  displayInPos: true,
  posButtonLabel: "",
  availableCategory: null,
  category: categoryId,
  icon: "bi bi-grid",
  isActive: true,
});

function CatalogCategoryForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const subCategories = useSelector(
    (state) => state.settings.inventory.catalogSubCategories
  );

  const [data, setData] = useState(getDefaultData(id || null));

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

  const onEdit = (subCategoryId) => {
    navigate(
      `/settings/inventory-setup/catalog-category/${id}/catalog-sub-category/${subCategoryId}`
    );
  };

  const onDelete = (subCategoryId) => {
    dispatch(deleteCatalogSubCategory(subCategoryId, id));
  };

  useEffect(() => {
    let ignore = false;

    if (id) {
      dispatch(clearCatalogSubCategories());
      dispatch(
        getCatalogCategory(id, setPageLoading, (res) => {
          if (ignore) return;
          setData({
            title: res.title || "",
            description: res.description || "",
            displayInPos: res.displayInPos,
            posButtonLabel: res.posButtonLabel || "",
            availableCategory: res.availableCategory || null,
            isActive: res.isActive,
            icon: res.icon || "bi bi-grid",
          });
        }, () => ignore)
      );
      dispatch(getCatalogSubCategories(id, setSubCategoryLoading, () => ignore));
    } else {
      dispatch(clearCatalogSubCategories());
      setData(getDefaultData(null));
    }

    return () => {
      ignore = true;
    };
  }, [id, dispatch]);

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

    if (!showFormErrors(data, setData, ["category"])) {
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

    const payload = {
      ...data,
      category: id || undefined,
    };
    dispatch(
      addOrUpdateCatalogCategory(
        id,
        payload,
        setLoading,
        (success, formErrors) => {
          if (success) navigate(-1);
          else setData((prev) => ({ ...prev, formErrors }));
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
      backText="Catalog Categories"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Catalog Category Details">
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
          name="availableCategory"

          optionsType="catalogCategories"
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

      {id && (
        <ListPageLayout
          buttonLabel="Add Sub Catalog Category"
          linkTo={`/settings/inventory-setup/catalog-category/${id}/catalog-sub-category/new`}
          searchable={["title"]}
          tableData={subCategories}
          columns={columns}
          loading={subCategoryLoading}
          onDelete={onDelete}
          onEdit={onEdit}
        />

      )}
    </FormPageLayout>
  );
}

export default React.memo(CatalogCategoryForm);
