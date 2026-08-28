import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  deleteLocationType,
  getLocationTypes,
} from "../../../../store/settings/scheduleSetup/locationTypeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";


export default function LocationType() {
  
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.scheduleSetup.locationTypes
  );

  useEffect(() => {
    dispatch(getLocationTypes());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteLocationType);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "allowOverbooking", isBoolean: true },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => { 
    navigate(`location-type/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Location Type"
        linkTo="location-type"
        searchable={["title"]}  
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
  
}
