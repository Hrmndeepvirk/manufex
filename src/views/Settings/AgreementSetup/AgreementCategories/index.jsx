import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgreementCategory,
  getAgreementCategories,
} from "../../../../store/settings/agreementSetup/agreementCategoryActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function AgreementCategory() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.agreementSetup.agreementCategories
  );

  useEffect(() => {
    dispatch(getAgreementCategories());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteAgreementCategory);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "subCategories" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`agreement-categories/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Category"
        linkTo="agreement-categories"
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
