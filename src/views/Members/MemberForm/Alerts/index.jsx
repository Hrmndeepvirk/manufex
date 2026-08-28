import { useState } from "react";
import CustomTable from "../../../../shared/table/CustomTable";
import FilterBar from "@shared/filters/FilterBar";
import EditAlert from "../../TaskAndAlert/EditAlert";

const ColorTypes = [
  { title: "Red", _id: "#E60606" },
  { title: "Blue", _id: "#06CBE6" },
  { title: "Green", _id: "#20B03C" },
  { title: "Yellow", _id: "#FFC348" },
  { title: "Orange", _id: "#FE7135" },
  { title: "Purple", _id: "#6C45BE" },
];

const StatusOptions = [
  { title: "Active", _id: true },
  { title: "Inactive", _id: false },
];

const Alerts = ({ data = [], loading = false, onRefresh }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const quickFilters = [
    {
      column: "isActive",
      header: "Status",
      type: "dropdown",
      options: StatusOptions,
      col: 4,
    },
    {
      column: "colorType",
      header: "Color",
      type: "dropdown",
      options: ColorTypes,
      col: 4,
    },
  ];

  const columns = [
    {
      field: "createdAt",
      header: "Date",
      isDate: true,
    },
    {
      field: "title",
      body: (rowData) => (
        <span style={{ color: rowData?.colorType || "inherit" }}>
          {rowData?.title}
        </span>
      ),
    },
    {
      field: "employee",
    },
    {
      field: "isActive",
      header: "Status",
      body: (rowData) => (
        <span
          style={{
            color: rowData?.isActive !== false ? "var(--color-success)" : "var(--color-danger)",
          }}
        >
          {rowData?.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "isAcknowledged",
      header: "Acknowledged",
      body: (rowData) => (
        <span
          style={{
            color: rowData?.isAcknowledged ? "var(--color-success)" : "var(--color-danger)",
          }}
        >
          {rowData?.isAcknowledged ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "actions",
      header: "Action",
      body: (rowData) => (
        <i
          className="pi pi-pencil cursor-pointer"
          onClick={() => {
            setSelectedAlert(rowData);
            setEditVisible(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="c-col-12">
      <EditAlert
        visible={editVisible}
        onHide={() => {
          setEditVisible(false);
          setSelectedAlert(null);
          if (onRefresh) onRefresh();
        }}
        alertData={selectedAlert}
      />
      <FilterBar
        quickFilters={quickFilters}
        data={data}
        onFilter={setFilteredData}
      />
      <CustomTable data={filteredData} columns={columns} loading={loading} />
    </div>
  );
};

export default Alerts;
