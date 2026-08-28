import React, { useEffect, useState } from "react";
import {
  FilterHeaderItem,
  ItemAccordion,
  ItemsLoading,
  SidebarHeaderItem,
  SidebarQuickViewItem,
} from "./SidebarComponents";
import QuickViewDialog from "./QuickViewDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartmentsList,
  getLocationTypesList,
  getResourceTypesList,
} from "../../../store/calendar/calendarActions";
import { getQuickViews } from "../../../store/calendar/quickViewActions";
import PrimaryButton from "../../../shared/buttons/PrimaryButton";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";

export default function Sidebar({
  isOpen,
  handleViewChange,
  handleGridChange,
  onAddEvent,
  toggleSidebar,
  setQuickViewFilters,
  setFilters,
}) {
  const dispatch = useDispatch();
  const [view, setView] = useState(null);
  const [editingQuickView, setEditingQuickView] = useState(null);
  const [addNewQuickViewVisible, setAddNewQuickViewVisible] = useState(false);
  const [defaultViewId, setDefaultViewId] = useState(() =>
    localStorage.getItem("calendarDefaultView")
  );

  const quickViews = useSelector((state) => state.calendar.quickViews);
  const departments = useSelector((state) => state.calendar.departments);
  const locationTypes = useSelector((state) => state.calendar.locationTypes);
  const resourceTypes = useSelector((state) => state.calendar.resourceTypes);

  useEffect(() => {
    const defaultView = localStorage.getItem("calendarDefaultView");
    if (defaultView) {
      setView(defaultView);
    } else {
      const storedView = localStorage.getItem("calendarSidebarView");
      if (storedView) {
        setView(storedView);
      }
    }
  }, []);

  const handleSetDefault = (id) => {
    if (defaultViewId === id) {
      localStorage.removeItem("calendarDefaultView");
      setDefaultViewId(null);
    } else {
      localStorage.setItem("calendarDefaultView", id);
      setDefaultViewId(id);
    }
  };

  useEffect(() => {
    if (view) {
      let _view = quickViews.find((qv) => qv._id == view);
      if (_view) {
        setQuickViewFilters(_view);
        handleViewChange({ value: _view.viewType });
        handleGridChange({ value: _view.gridType });
      }
    }
  }, [view, quickViews]);

  useEffect(() => {
    if (view) {
      localStorage.setItem("calendarSidebarView", view);
    } else {
      localStorage.removeItem("calendarSidebarView");
    }
  }, [view]);

  const [loadingQuickViews, setLoadingQuickViews] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingLocationTypes, setLoadingLocationTypes] = useState(false);
  const [loadingResourceTypes, setLoadingResourceTypes] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleFilterToggle = (type, _id, title) => {
    if (!_id || !title) return;
    setAppliedFilters((prev) => {
      const exists = prev.find((f) => f.type === type && f._id === _id);
      if (exists) {
        return prev.filter((f) => !(f.type === type && f._id === _id));
      }
      return [...prev, { type, _id, title }];
    });
  };

  const clearFilter = (type, _id) => {
    setAppliedFilters((prev) =>
      prev.filter((f) => !(f.type === type && f._id === _id))
    );
  };

  const isFilterApplied = (type, _id) =>
    appliedFilters.some((f) => f.type === type && f._id === _id);

  useEffect(() => {
    dispatch(getQuickViews(setLoadingQuickViews));
    dispatch(getDepartmentsList(setLoadingDepartments));
    dispatch(getLocationTypesList(setLoadingLocationTypes));
    dispatch(getResourceTypesList(setLoadingResourceTypes));
  }, []);

  const onHide = () => {
    setAddNewQuickViewVisible(false);
    setEditingQuickView(null);
  };

  const clearFilters = () => {
    setAppliedFilters([]);
  };

  useEffect(() => {
    if (setFilters) {
      setFilters(appliedFilters);
    }
  }, [appliedFilters?.length]);

  return (
    <>
      <QuickViewDialog
        visible={addNewQuickViewVisible}
        onHide={onHide}
        editingQuickView={editingQuickView}
      />
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {!isOpen && (
          <>
            <PrimaryButton
              className="mb-2"
              icon="pi pi-bars"
              onClick={toggleSidebar}
            />
            {/* <CustomDropdown
              data={data}
              onChange={handleChange}
              name="member"
              options={membersList}
              loading={membersLoading}
              required={isRequired("member")}
              col={12}
              clearable
            /> */}
            <PrimaryButton icon="pi pi-plus" onClick={onAddEvent} />
          </>
        )}

        {isOpen && (
          <>
            <div className="flex flex-column">
              <PrimaryButton
                label="Event"
                icon="pi pi-plus"
                onClick={onAddEvent}
              />
            </div>

            <div className="views mt-2 mb-3">
              <SidebarHeaderItem
                icon="pi-bolt"
                label="QUICK VIEWS"
                onClick={() => setAddNewQuickViewVisible(true)}
              />
              {loadingQuickViews ? (
                <ItemsLoading />
              ) : (
                quickViews.map((item) => (
                  <SidebarQuickViewItem
                    key={item._id}
                    icon={item.icon}
                    label={item.title}
                    active={item._id == view}
                    isDefault={item._id === defaultViewId}
                    onClick={() => setView(item._id)}
                    onSetDefault={() => handleSetDefault(item._id)}
                    onEdit={() => {
                      setAddNewQuickViewVisible(true);
                      setEditingQuickView(item);
                    }}
                  />
                ))
              )}
            </div>

            <SidebarHeaderItem
              icon="pi-sliders-h"
              label="FILTERS"
              buttonIcon="pi pi-times-circle"
              onClick={appliedFilters?.length > 0 && clearFilters}
            />
            <div className="filters">
              {appliedFilters.length > 0 && (
                <div className="applied-filters mb-3">
                  {appliedFilters.map((f) => (
                    <div
                      key={`${f.type}-${f._id}`}
                      className="applied-filter-tag"
                    >
                      <span className="label">{f.title}</span>
                      <i
                        className="pi pi-times remove-icon"
                        onClick={() => clearFilter(f.type, f._id)}
                      ></i>
                    </div>
                  ))}
                </div>
              )}

              <FilterHeaderItem icon="pi-building" label="DEPARTMENT" />
              {loadingDepartments ? (
                <ItemsLoading padding />
              ) : (
                departments.map((item) => (
                  <ItemAccordion
                    key={item._id || item.title}
                    label={item.title}
                  >
                    {item?.employees?.map((emp) => (
                      <div
                        key={emp?._id || emp?.title}
                        className={`item ${
                          isFilterApplied("employees", emp?._id) ? "active" : ""
                        }`}
                        onClick={() =>
                          handleFilterToggle("employees", emp?._id, emp?.title)
                        }
                      >
                        {emp?.title}
                      </div>
                    ))}
                  </ItemAccordion>
                ))
              )}

              <FilterHeaderItem icon="pi-map-marker" label="LOCATION TYPES" />
              {loadingLocationTypes ? (
                <ItemsLoading padding />
              ) : (
                locationTypes.map((item) => (
                  <ItemAccordion
                    key={item._id || item.title}
                    label={item.title}
                  >
                    {item?.locations?.map((loc) => (
                      <div
                        key={loc?._id || loc?.title}
                        className={`item ${
                          isFilterApplied("locations", loc?._id) ? "active" : ""
                        }`}
                        onClick={() =>
                          handleFilterToggle("locations", loc?._id, loc?.title)
                        }
                      >
                        {loc?.title}
                      </div>
                    ))}
                  </ItemAccordion>
                ))
              )}
              <FilterHeaderItem
                icon="pi-objects-column"
                label="RESOURCE TYPES"
              />
              {loadingResourceTypes ? (
                <ItemsLoading padding />
              ) : (
                resourceTypes.map((item) => (
                  <ItemAccordion
                    key={item._id || item.title}
                    label={item.title}
                  >
                    {item?.resources?.map((res) => (
                      <div
                        key={res?._id || res?.title}
                        className={`item ${
                          isFilterApplied("resources", res?._id) ? "active" : ""
                        }`}
                        onClick={() =>
                          handleFilterToggle("resources", res?._id, res?.title)
                        }
                      >
                        {res?.title}
                      </div>
                    ))}
                  </ItemAccordion>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
