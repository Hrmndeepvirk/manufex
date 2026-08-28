import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { getRequests } from "@store/settings/employeeSetup/requestActions";
import { capitalizeDashCase, capitalizeSnakeCase } from "@utils/common";
import { getDateTime } from "@utils/dateTime";

function EmployeeRequests({ statusColors = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const requests = useSelector(
    (state) => state.settings.employeeSetup.requests || [],
  );
  const profile = useSelector((state) => state.user.profile);

  const tableData = requests
    .filter((r) => r.createdBy?._id === profile?._id)
    .map((r) => ({ ...r }));

  const columns = [
    {
      field: "requestType",
      header: "Request Type",
      body: (row) =>
        row.requestType ? capitalizeDashCase(row.requestType) : "-",
    },
    {
      field: "targetCollection",
      header: "Module",
      body: (row) =>
        row.targetCollection
          ? capitalizeSnakeCase(row.targetCollection)
          : "-",
    },
    {
      field: "targetItem",
      header: "Item",
      body: (row) =>
        row.targetItem?.title ||
        row.targetItem?.name ||
        row.targetItemName ||
        "-",
    },
    {
      field: "status",
      header: "Status",
      body: (row) => {
        const status = row.status || "";
        const color =
          statusColors[status.toLowerCase()] || "var(--text-color-primary)";
        return (
          <span className="font-semibold capitalize" style={{ color }}>
            {status || "-"}
          </span>
        );
      },
    },
    {
      field: "createdAt",
      header: "Created At",
      body: (row) => (row.createdAt ? getDateTime(row.createdAt) : "-"),
    },
  ];

  useEffect(() => {
    dispatch(getRequests(setLoading));
  }, [dispatch]);

  return (
    <ListPageLayout
      tableData={tableData}
      columns={columns}
      loading={loading}
      searchable={["requestType", "targetCollection"]}
      onView={(id) => navigate(`/more/request/${id}`)}
    />
  );
}

export default EmployeeRequests;
