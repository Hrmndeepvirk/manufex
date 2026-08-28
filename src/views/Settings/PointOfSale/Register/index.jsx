import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRegister,
  getRegisters,
} from "../../../../store/settings/pointOfSale/registerActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Register() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.pointOfSale.registers);

  useEffect(() => {
    dispatch(getRegisters());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteRegister);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "club", optionsKey: "clubs" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`register/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Register"
        linkTo="register"
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
