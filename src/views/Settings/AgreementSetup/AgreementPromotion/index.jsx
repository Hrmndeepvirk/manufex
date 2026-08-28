import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgreementPromotion,
  getAgreementPromotions,
} from "@store/settings/agreementSetup/agreementPromotionActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function AgreementPromotion() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.agreementSetup.agreementPromotions
  );

  useEffect(() => {
    dispatch(getAgreementPromotions());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteAgreementPromotion);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "code" },
    { field: "startDate", isDate: true },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`agreement-promotion/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Promotion"
        linkTo="agreement-promotion"
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
