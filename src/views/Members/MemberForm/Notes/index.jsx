import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomTable from "../../../../shared/table/CustomTable";
import { getNotes } from "../../../../store/member/noteAction";
const Notes = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const fetchNotes = () => {
    dispatch(getNotes(id, setLoading, (notes) => setData(notes)));
  };

  const columns = [
    {
      field: "createdAt",
      header: "Date",
      isDate: true,
      sortable: true,
    },
    {
      field: "createdAt",
      header: "Time",
      isTime: true,
    },
    {
      field: "type",
      header: "Type",
      body: (rowData) => (
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor:
              rowData.type === "SYSTEM"
                ? "var(--highlight-bg)"
                : "var(--color-info)",
            color:
              rowData.type === "SYSTEM"
                ? "var(--text-color-primary)"
                : "#fff",
          }}
        >
          {rowData.type === "SYSTEM" ? "System" : "Manual"}
        </span>
      ),
    },
    {
      field: "name",
      header: "Text",
    },
    {
      field: "employee",
      header: "User",
      body: (rowData) =>
        rowData.employee
          ? `${rowData.employee.firstName} ${rowData.employee.lastName}`
          : "N/A",
    },
  ];

  return (
    <>
      <div className="c-col-12">
        <CustomTable data={data} columns={columns} loading={loading} />
      </div>
    </>
  );
};

export default Notes;
