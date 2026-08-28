import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  copyAgreementPlan,
  deleteAgreementPlan,
  getAgreementPlans,
} from "@store/settings/agreementSetup/agreementPlanActions";

export default function AgreementPlan() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const data = useSelector(
    (state) => state.settings.agreementSetup.agreementPlans
  );

  useEffect(() => {
    dispatch(getAgreementPlans(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`agreement-plan/${id}`);
  };

  const onCopy = (id) => {
    dispatch(copyAgreementPlan(id, setCopyLoading, () => {}));
  };

  const onDelete = (id) => {
    dispatch(deleteAgreementPlan(id));
  };

  return (
    <ListPageLayout
      buttonLabel="Add Plan"
      linkTo="agreement-plan"
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onCopy={onCopy}
      onEdit={onEdit}
      onDelete={onDelete}
      loading={loading}
    />
  );
}
