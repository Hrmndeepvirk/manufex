import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAccessedFee,
  getAccessedFees,
} from "@store/settings/agreementSetup/accessedFeeActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function AccessedFee() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.agreementSetup.assessedFees
  );

  useEffect(() => {
    dispatch(getAccessedFees());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteAccessedFee);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "type", header: "Type", optionsKey: "AccessedFeeTypes" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`assessed-fee/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Accessed Fee"
        linkTo="assessed-fee"
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
