import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgreementTemplate,
  getAgreementTemplates,
} from "@store/settings/agreementSetup/agreementTemplateActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function AgreementTemplate() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.agreementSetup.agreementTemplates
  );

  const clubs = useSelector((state) => state.dropdown.clubs);

  useEffect(() => {
    dispatch(getAgreementTemplates());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteAgreementTemplate);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    {
      field: "club",
      header: "Clubs",
      body: (row) => {
        if (!Array.isArray(row?.club) || row.club.length === 0) return "-";
        if (!Array.isArray(clubs) || clubs.length === 0)
          return row.club.join(", ");

        const names = row.club
          .map((id) => clubs.find((c) => c._id === id)?.title)
          .filter(Boolean);

        return names.length ? names.join(", ") : "-";
      },
    },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`agreement-template/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Template"
        linkTo="agreement-template"
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
