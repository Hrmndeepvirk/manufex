import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomTable from "@shared/table/CustomTable";
import { getPlans } from "@store/plan/planActions";

const SellAgreementDialog = ({
  visible,
  onHide,
  memberId,
  memberAgreements,
  navigate,
}) => {
  const dispatch = useDispatch();
  const [plansLoading, setPlansLoading] = useState(false);
  const plans = useSelector((state) => state.plans.plans);

  useEffect(() => {
    if (visible) {
      dispatch(getPlans(setPlansLoading));
    }
  }, [visible]);

  const enrolledPlanIds = (memberAgreements || [])
    .filter((a) =>
      ["ACTIVE", "SCHEDULED", "FREEZE", "HOLD"].includes(a?.status),
    )
    .map((a) => a?.membershipPlan?._id)
    .filter(Boolean);

  const availablePlans = (plans || []).filter(
    (plan) => !enrolledPlanIds.includes(plan._id),
  );

  const columns = [
    {
      field: "title",
      header: "Name",
      sortable: true,
    },
    {
      field: "category",
      header: "Category",
    },
    {
      field: "timePeriod",
      header: "Duration",
    },
    {
      field: "actions",
      header: "Actions",
      style: { width: "120px" },
      body: (rowData) => (
        <span
          onClick={() => {
            onHide();
            navigate(`/plans/sell-plans/${rowData._id}?tab=plan`, {
              state: { memberId },
            });
          }}
          className="p-1 cursor-pointer"
          title="Sell Plan"
        >
          <i className="bi bi-cart4 text-xl" />
        </span>
      ),
    },
  ];

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      title="Select Agreement to Sell"
      size="large"
    >
      <CustomTable
        data={availablePlans}
        columns={columns}
        loading={plansLoading}
      />
    </CustomDialog>
  );
};

export default SellAgreementDialog;
