import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQueuedReports,
  deleteQueuedReport,
} from "@store/reports/queuedReportsActions";
import { Tag } from "primereact/tag";
import CustomTable from "@shared/table/CustomTable";
import { PrimaryButtonSmall } from "@buttons/PrimaryButton";
import { FilterBar } from "@filters";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import {
  USER_TYPE_OPTIONS,
  getRuleTypeOptions,
} from "../ManageReports/ruleConfig";

const STATUS_CONFIG = {
  PENDING: { severity: "warning", label: "Pending" },
  RUNNING: { severity: "info", label: "Running" },
  COMPLETED: { severity: "success", label: "Completed" },
  FAILED: { severity: "danger", label: "Failed" },
};

const statusOptions = [
  { _id: "PENDING", title: "Pending" },
  { _id: "RUNNING", title: "Running" },
  { _id: "COMPLETED", title: "Completed" },
  { _id: "FAILED", title: "Failed" },
];

const formatTypeOptions = [
  { _id: "PDF", title: "PDF" },
  { _id: "CSV", title: "CSV" },
];

const allRuleTypeOptions = [
  ...new Map(
    [...getRuleTypeOptions("MEMBER"), ...getRuleTypeOptions("EMPLOYEE")].map(
      (o) => [o._id, o],
    ),
  ).values(),
];

export default function QueuedReports() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const rawData = useSelector((state) => state.queuedReports.queuedReports);

  useEffect(() => {
    dispatch(getQueuedReports(setLoading));
  }, [dispatch]);

  const data = useMemo(
    () =>
      (rawData || []).map((item) => ({
        ...item,
        _formatType: item.snapshot?.formatType || "",
        _userType: item.snapshot?.masterRule?.userType || "",
        _ruleType: item.snapshot?.masterRule?.type || "",
      })),
    [rawData],
  );

  const quickFilters = [
    { column: "reportName", header: "Report Name", type: "text", col: 3 },
    {
      column: "status",
      header: "Status",
      type: "dropdown",
      options: statusOptions,
      col: 3,
    },
    {
      column: "_formatType",
      header: "Format",
      type: "dropdown",
      options: formatTypeOptions,
      col: 3,
    },
    {
      column: "_userType",
      header: "User Type",
      type: "dropdown",
      options: USER_TYPE_OPTIONS,
      col: 3,
    },
  ];

  const advancedFilters = [
    {
      column: "_ruleType",
      header: "Rule Type",
      type: "dropdown",
      options: allRuleTypeOptions,
      col: 4,
    },
    { column: "createdAt", header: "From Date", type: "dateFrom", col: 4 },
    {
      column: "createdAtTo",
      header: "To Date",
      type: "dateTo",
      targetColumn: "createdAt",
      col: 4,
    },
  ];

  const statusTemplate = (rowData) => {
    const config = STATUS_CONFIG[rowData.status] || {
      severity: "info",
      label: rowData.status,
    };
    const tag = <Tag value={config.label} severity={config.severity} />;
    if (rowData.status === "FAILED" && rowData.errorMessage) {
      return (
        <span
          title={rowData.errorMessage}
          style={{ cursor: "help" }}
        >
          {tag}
        </span>
      );
    }
    return tag;
  };

  const employeeTemplate = (rowData) => {
    if (rowData.requestedBy?.firstName) {
      return `${rowData.requestedBy.firstName} ${rowData.requestedBy.lastName || ""}`.trim();
    }
    return "-";
  };

  const onDelete = (rowData) => {
    customConfirmDialog({
      message: "Do you want to delete this queued report?",
      accept: () => {
        dispatch(deleteQueuedReport(rowData._id));
      },
    });
  };

  const columns = [
    { field: "reportName", header: "Report Name", sortable: true },
    {
      field: "requestedBy",
      header: "Employee",
      body: employeeTemplate,
    },

    {
      field: "userType",
      header: "User Type",
      body: (rowData) =>
        formatEnum(rowData.snapshot?.masterRule?.userType) || "-",
    },
    {
      field: "ruleType",
      header: "Rule Type",
      body: (rowData) => formatEnum(rowData.snapshot?.masterRule?.type) || "-",
    },

    {
      field: "formatType",
      header: "Format",
      body: (rowData) => rowData.snapshot?.formatType || "-",
      style: { width: "100px" },
    },
    {
      field: "status",
      header: "Status",
      body: statusTemplate,
      style: { width: "120px" },
      sortable: true,
    },

    {
      field: "createdAt",
      header: "Run Time",
      body: (rowData) => getDateTime(rowData.createdAt),
      sortable: true,
    },
    {
      field: "fileUrl",
      header: "Download",
      body: (rowData) => {
        if (rowData.status !== "COMPLETED" || !rowData.fileUrl) return null;
        return (
          <PrimaryButtonSmall
            label="Download"
            icon="pi pi-download"
            onClick={() => window.open(rowData.fileUrl, "_blank")}
          />
        );
      },
      style: { width: "150px" },
    },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => (
        <div className="flex gap-2">
          <i
            className="pi pi-trash cursor-pointer"
            title="Delete"
            onClick={() => onDelete(rowData)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-2">
      <FilterBar
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        data={data || []}
        onFilter={setFilteredData}
      />
      <CustomTable data={filteredData} columns={columns} loading={loading} />
    </div>
  );
}
