import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAvailability,
  getAvailabilities,
} from "@store/settings/employeeSetup/availabilityActions";

export default function Availability() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.employeeSetup.availability
  );

  useEffect(() => {
    dispatch(getAvailabilities());
  }, [dispatch]);

  let columns = [
    {
      field: "employee",
      header: "Employee",
      optionsKey: "employees",
    },
    { field: "club", header: "Club", optionsKey: "clubs" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`availability/${id}`);
  };

  const onDelete = (id) => {
    dispatch(deleteAvailability(id));
  };

  return (
    
    <ListPageLayout
      buttonLabel="Add Availability"
      linkTo={"availability"}
      searchable={["employee"]}
      tableData={data}
      columns={columns}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
}
