import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReport,
  getReports,
  toggleFavouriteReport,
} from "@store/reports/reportsActions";
import { createQueuedReport } from "@store/reports/queuedReportsActions";
import { setToast } from "@store/common/commonSlice";
import CustomTable from "@shared/table/CustomTable";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { PrimaryButtonSmall } from "@buttons/PrimaryButton";
import { FilterBar } from "@filters";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import {
  USER_TYPE_OPTIONS,
  getRuleTypeOptions,
} from "./ruleConfig";

const formatTypeOptions = [
  { _id: "PDF", title: "PDF" },
  { _id: "CSV", title: "CSV" },
];

const allRuleTypeOptions = [
  ...new Map(
    [...getRuleTypeOptions("MEMBER"), ...getRuleTypeOptions("EMPLOYEE")].map(
      (o) => [o._id, o]
    )
  ).values(),
];

export default function ManageReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const data = useSelector((state) => state.reports.reports);

  useEffect(() => {
    dispatch(getReports(setLoading));
  }, [dispatch]);

  const handleRunReport = (rowData) => {
    setRunLoading(rowData._id);
    dispatch(
      createQueuedReport(
        { reportSetupId: rowData._id },
        (val) => {
          if (!val) setRunLoading(null);
        },
        (success, formErrors) => {
          setRunLoading(null);
          if (success) {
            dispatch(
              setToast({
                title: "Success",
                description: "Report queued successfully.",
                type: "success",
                life: 3000,
              })
            );
          } else {
            const errorMessage =
              formErrors?.reportColumns ||
              Object.values(formErrors || {})[0] ||
              "Failed to queue report.";
            dispatch(
              setToast({
                title: "Error",
                description: errorMessage,
                type: "error",
                life: 4000,
              })
            );
          }
        }
      )
    );
  };

  const quickFilters = [
    { column: "title", header: "Title", type: "text", col: 4 },
    {
      column: "formatType",
      header: "Format",
      type: "dropdown",
      options: formatTypeOptions,
      col: 4,
    },
    {
      column: "userType",
      header: "User Type",
      type: "dropdown",
      options: USER_TYPE_OPTIONS,
      targetColumn: "masterRule",
      matchField: "userType",
      col: 4,
    },
  ];

  const advancedFilters = [
    { column: "description", header: "Description", type: "text", col: 4 },
    {
      column: "ruleType",
      header: "Rule Type",
      type: "dropdown",
      options: allRuleTypeOptions,
      targetColumn: "masterRule",
      matchField: "type",
      col: 4,
    },
    { column: "createdAt", header: "From Date", type: "dateFrom", col: 4 },
  ];

  const handleToggleFavourite = (rowData) => {
    dispatch(toggleFavouriteReport(rowData._id, !rowData.isFavourite));
  };

  const onEdit = (rowData) => {
    navigate(`report/${rowData._id}`);
  };

  const onDelete = (rowData) => {
    customConfirmDialog({
      message: "Do you want to delete this report?",
      accept: () => {
        dispatch(deleteReport(rowData._id));
      },
    });
  };

  const sortedData = [...filteredData].sort(
    (a, b) => (b.isFavourite ? 1 : 0) - (a.isFavourite ? 1 : 0)
  );

  const columns = [
    {
      field: "isFavourite",
      header: "",
      body: (rowData) => (
        <i
          className={`${rowData.isFavourite ? "pi pi-star-fill" : "pi pi-star"} cursor-pointer`}
          style={{ color: rowData.isFavourite ? "var(--color-warning)" : "var(--text-color-secondary)" }}
          title={rowData.isFavourite ? "Remove from favourites" : "Add to favourites"}
          onClick={() => handleToggleFavourite(rowData)}
        />
      ),
      style: { width: "40px" },
    },
    { field: "title", sortable: true },
    { field: "description" },
    { field: "formatType", header: "Format", sortable: true },
    {
      field: "masterRule",
      header: "User Type",
      body: (rowData) => formatEnum(rowData.masterRule?.userType) || "-",
      sortable: true,
    },
    {
      field: "masterRuleType",
      header: "Rule Type",
      body: (rowData) => formatEnum(rowData.masterRule?.type) || "-",
    },
    {
      field: "createdAt",
      header: "Created At",
      body: (rowData) => getDateTime(rowData.createdAt),
      sortable: true,
    },
    {
      field: "runReport",
      header: "Run",
      body: (rowData) => {
        const isRunning = runLoading === rowData._id;
        return (
          <PrimaryButtonSmall
            label={isRunning ? "Queuing..." : "Run Report"}
            icon={isRunning ? "pi pi-spin pi-spinner" : "pi pi-play"}
            onClick={() => handleRunReport(rowData)}
            disabled={isRunning}
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
            className="pi pi-pencil cursor-pointer"
            title="Edit"
            onClick={() => onEdit(rowData)}
          />
          {rowData.editAtRuntime && (
            <i
              className="pi pi-file-edit cursor-pointer"
              title="Edit & Run"
              onClick={() => navigate(`run-report/${rowData._id}`)}
            />
          )}
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
      >
        <PrimaryButton
          label="Add New Report"
          icon="pi pi-plus"
          onClick={() => navigate("report")}
        />
      </FilterBar>
      <CustomTable
        data={sortedData}
        columns={columns}
        loading={loading}
      />
    </div>
  );
}
