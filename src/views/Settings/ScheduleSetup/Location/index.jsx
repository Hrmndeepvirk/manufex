import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteLocation,
  getLocations,
} from "../../../../store/settings/scheduleSetup/locationActions";
import { getLocationTypes } from "../../../../store/settings/scheduleSetup/locationTypeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Location() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.scheduleSetup.locations);
  const locationTypes = useSelector(
    (state) => state.settings.scheduleSetup.locationTypes,
  );

  useEffect(() => {
    dispatch(getLocations());
  }, [dispatch]);

  useEffect(() => {
    if (!locationTypes?.length) {
      dispatch(getLocationTypes());
    }
  }, [dispatch, locationTypes?.length]);

  const tableData = useMemo(() => {
    return (data || []).map((location) => {
      const matchedLocationType = locationTypes?.find(
        (type) => type?._id === location?.locationType,
      );

      return {
        ...location,
        locationTypeTitle: matchedLocationType?.title || "-",
      };
    });
  }, [data, locationTypes]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteLocation);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "locationType", optionsKey: "locationTypes" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`location/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Location"
        linkTo="location"
        searchable={["title", "locationTypeTitle"]}
        tableData={tableData}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
}
