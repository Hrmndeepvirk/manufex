import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomForm from "@inputs/CustomForm";
import CustomInput from "@inputs/CustomInput";
import formValidation, { showFormErrors } from "@formValidations";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import {
  addOrUpdateQuickView,
  deleteQuickView,
} from "../../../store/calendar/quickViewActions";
import CustomMultiSelect from "../../../shared/inputs/CustomMultiSelect";
import { customConfirmDialog } from "../../../shared/overlays/CustomConfirmDialog";

const viewTypes = [
  { title: "Day/Date", _id: "default" },
  { title: "Employees", _id: "employees" },
  { title: "Locations", _id: "locations" },
  { title: "Resources", _id: "resources" },
];
const gridTypes = [
  { title: "Week", _id: "Week" },
  { title: "Day", _id: "Day" },
];

export default function QuickViewDialog({ visible, onHide, editingQuickView }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    icon: "bi bi-grid",
    title: "",
    viewType: "default",
    gridType: "Week",
  });
  const [filters, setFilters] = useState({
    employees: [],
    locations: [],
    departments: [],
    locationTypes: [],
    resourceTypes: [],
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      data.filters = filters;
      dispatch(
        addOrUpdateQuickView(
          data._id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              onHide();
              setData({
                title: "",
                viewType: "default",
                gridType: "Week",
              });
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };

  const employees = useSelector((state) => state.calendar.employees);
  const departments = useSelector((state) => state.calendar.departments);
  const locationTypes = useSelector((state) => state.calendar.locationTypes);
  const resourceTypes = useSelector((state) => state.calendar.resourceTypes);
  const locations = useSelector((state) => state.calendar.locations);
  const resources = useSelector((state) => state.calendar.resources);

  useEffect(() => {
    if (editingQuickView) {
      setData(editingQuickView);
      setFilters(editingQuickView.filters);
    }
  }, [editingQuickView]);

  const employeeOptions = useMemo(() => {
    if (!filters.departments?.length) return employees;
    const selected = new Set(filters.departments);
    const map = new Map();
    departments.forEach((dept) => {
      if (!selected.has(dept._id)) return;
      (dept.employees || []).forEach((emp) => {
        if (!map.has(emp._id)) map.set(emp._id, emp);
      });
    });
    return Array.from(map.values());
  }, [filters.departments, departments, employees]);

  const locationOptions = useMemo(() => {
    if (!filters.locationTypes?.length) return locations;
    const selected = new Set(filters.locationTypes);
    const map = new Map();
    locationTypes.forEach((type) => {
      if (!selected.has(type._id)) return;
      (type.locations || []).forEach((loc) => {
        if (!map.has(loc._id)) map.set(loc._id, loc);
      });
    });
    return Array.from(map.values());
  }, [filters.locationTypes, locationTypes, locations]);

  const resourceOptions = useMemo(() => {
    if (!filters.resourceTypes?.length) return resources;
    const selected = new Set(filters.resourceTypes);
    const map = new Map();
    resourceTypes.forEach((type) => {
      if (!selected.has(type._id)) return;
      (type.resources || []).forEach((res) => {
        if (!map.has(res._id)) map.set(res._id, res);
      });
    });
    return Array.from(map.values());
  }, [filters.resourceTypes, resourceTypes, resources]);

  const handleFiltersChange = ({ name, value }) => {
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "departments") {
        const allowed = new Set(
          departments
            .filter((d) => value.includes(d._id))
            .flatMap((d) => (d.employees || []).map((e) => e._id))
        );
        next.employees = value.length
          ? (prev.employees || []).filter((id) => allowed.has(id))
          : prev.employees;
      } else if (name === "locationTypes") {
        const allowed = new Set(
          locationTypes
            .filter((t) => value.includes(t._id))
            .flatMap((t) => (t.locations || []).map((l) => l._id))
        );
        next.locations = value.length
          ? (prev.locations || []).filter((id) => allowed.has(id))
          : prev.locations;
      } else if (name === "resourceTypes") {
        const allowed = new Set(
          resourceTypes
            .filter((t) => value.includes(t._id))
            .flatMap((t) => (t.resources || []).map((r) => r._id))
        );
        next.resources = value.length
          ? (prev.resources || []).filter((id) => allowed.has(id))
          : prev.resources;
      }
      return next;
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    customConfirmDialog({
      message: "Are you sure you want to delete this quick view?",
      accept: () => {
        dispatch(
          deleteQuickView(editingQuickView._id, () => {
            onHide();
            setData({});
          })
        );
      },
    });
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

  const handleHide = () => {
    setData({
      icon: "bi bi-grid",
      title: "",
      viewType: "default",
      gridType: "Week",
    });
    onHide();
  };

  return (
    <CustomDialog
      title="Create Quick View"
      visible={visible}
      onHide={handleHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLoading={loading}
        onCancel={handleHide}
        onDelete={data._id && handleDelete}
      >
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="icon"
          optionsType="QuickViewIcons"
          valueTemplate={selectedCountryTemplate}
          itemTemplate={countryOptionTemplate}
          col={4}
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          maxLength={30}
          col={8}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="viewType"
          label="Calendar Topbar View"
          options={viewTypes}
          col={6}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="gridType"
          label="Calendar Grid View"
          options={gridTypes}
          col={6}
        />

        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={departments}
          name="departments"
        />
        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={locationTypes}
          name="locationTypes"
        />
        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={resourceTypes}
          name="resourceTypes"
        />
        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={employeeOptions}
          name="employees"
        />
        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={locationOptions}
          name="locations"
        />
        <CustomMultiSelect
          data={filters}
          onChange={handleFiltersChange}
          options={resourceOptions}
          name="resources"
        />
      </CustomForm>
    </CustomDialog>
  );
}
