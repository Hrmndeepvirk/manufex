import ListPageLayout from "@shared/layout/ListPageLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDraftPlans } from "../../../store/plan/draftPlansActions";

export default function Drafts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const data = useSelector((state) => state.plans.draftPlans);

  useEffect(() => {
    dispatch(getDraftPlans(setLoading));
  }, []);

  let columns = [
    {
      header: "Name",
      body: (rowData) => rowData?.agreementData?.title,
      sortable: true,
    },
    {
      field: "createdBy",
      header: "Created By",
      optionsKey: "employees",
    },
    {
      field: "createdFrom",
      header: "Created From",
      optionsKey: "employees",
    },
    {
      header: "Actions",
      body: (rowData) => {
        return (
          <i
            className="pi pi-sign-out my-auto cursor-pointer"
            title="Continue"
            onClick={() => {
              navigate(
                `/plans/sell-plans/${rowData?.plan}`,
                { state: { draftId: rowData?._id } }
              );
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <ListPageLayout
        searchable={["title"]}
        tableData={data}
        columns={columns}
        loading={loading}
      />
    </>
  );
}
