import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlans } from "../../../store/plan/planActions";
import { useNavigate, useLocation } from "react-router-dom";
import CustomTable from "@shared/table/CustomTable";
import { FilterBar } from "@filters";

export default function MembershipPlans() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedMemberId = location.state?.memberId || null;

  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const data = useSelector((state) => state.plans.plans);
  const { agreementCategories, membershipTypes } = useSelector(
    (state) => state.dropdown,
  );

  const categoryOptions = useMemo(
    () => agreementCategories.map((c) => ({ _id: c.title, title: c.title })),
    [agreementCategories],
  );
  const membershipTypeOptions = useMemo(
    () => membershipTypes.map((m) => ({ _id: m.title, title: m.title })),
    [membershipTypes],
  );

  useEffect(() => {
    dispatch(getPlans(setLoading));
  }, []);

  let columns = [
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
      style: { width: "150px" },
      body: (rowData) => (
        <div className="flex gap-2">
          <span
            onClick={() =>
              navigate(`sell-plans/${rowData._id}?tab=plan`, {
                state: preselectedMemberId
                  ? { memberId: preselectedMemberId }
                  : undefined,
              })
            }
            className="p-1 cursor-pointer"
            title="Sell Plan"
          >
            <i className="bi bi-cart4 text-xl my-auto" />
          </span>
        </div>
      ),
    },
  ];

  const quickFilters = [
    { column: "title", header: "Agreement Name", type: "text", col: 6 },
    {
      column: "category",
      header: "Category",
      type: "dropdown",
      options: categoryOptions,
      col: 6,
    },
  ];

  const advancedFilters = [
    {
      column: "membershipType",
      header: "Membership Type",
      type: "dropdown",
      options: membershipTypeOptions,
      col: 6,
    },
  ];

  return (
    <>
      <FilterBar
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        data={data}
        onFilter={setFilteredData}
      />
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
      />
    </>
  );
}
