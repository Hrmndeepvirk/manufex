import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTimeSheet,
  getTimeSheets,
  editTimeSheet,
} from "@store/settings/employeeSetup/timesheetsActions";
import CustomTable from "@shared/table/CustomTable";
import { FilterBar } from "@filters";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomTextArea from "@inputs/CustomTextArea";

export default function TimeSheets() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({
    clockIn: null,
    clockOut: null,
    editReason: "",
    employeeIsDeleted: false,
    formErrors: {},
  });
  const [editId, setEditId] = useState(null);

  const data = useSelector((state) => state.settings.employeeSetup.timesheets);
  const { employees, departments } = useSelector((state) => state.dropdown);

  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        _id: e._id,
        title: e.title,
      })),
    [employees],
  );

  useEffect(() => {
    dispatch(getTimeSheets(setLoading));
  }, [dispatch]);

  const handleEdit = (row) => {
    setEditId(row._id);
    setEditData({
      clockIn: row.clockIn || null,
      clockOut: row.clockOut || null,
      editReason: row.comment || "",
      employeeIsDeleted: row.employeeIsDeleted || false,
      formErrors: {},
    });
    setEditVisible(true);
  };

  const handleEditChange = ({ name, value }) => {
    const formErrors = { ...(editData.formErrors || {}) };

    if (name === "editReason" && editData.employeeIsDeleted) {
      const normalizedReason = value?.trim();

      if (!normalizedReason) {
        formErrors.editReason =
          "Comment is required for deleted employee edits!";
      } else if (normalizedReason.length < 3) {
        formErrors.editReason =
          "Comment must be at least 3 characters for deleted employee edits!";
      } else {
        formErrors.editReason = "";
      }
    }

    setEditData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleEditSubmit = () => {
    if (editData.employeeIsDeleted) {
      const normalizedReason = editData.editReason?.trim();
      const formErrors = { ...(editData.formErrors || {}) };

      if (!normalizedReason) {
        formErrors.editReason =
          "Comment is required for deleted employee edits!";
      } else if (normalizedReason.length < 3) {
        formErrors.editReason =
          "Comment must be at least 3 characters for deleted employee edits!";
      } else {
        formErrors.editReason = "";
      }

      setEditData((prev) => ({ ...prev, formErrors }));

      if (formErrors.editReason) {
        return;
      }
    }

    dispatch(
      editTimeSheet(editId, editData, setSubmitLoading, (success, formErrors) => {
        if (success) {
          setEditVisible(false);
          setEditId(null);
          dispatch(getTimeSheets(setLoading));
        } else if (formErrors) {
          setEditData((prev) => ({
            ...prev,
            formErrors: {
              ...prev.formErrors,
              ...formErrors,
            },
          }));
        }
      }),
    );
  };

  let columns = [
    { field: "employeeName", header: "Employee", sortable: true },
    {
      field: "club",
      header: "Club",
      body: (row) => `${row?.club?.name || "-"}`,
    },
    {
      field: "department",
      header: "Department",
      body: (row) => `${row?.department?.title || "-"}`,
    },
    { field: "comment" },
    { field: "clockIn", isDateTime: true },
    { field: "clockOut", isDateTime: true },
    {
      field: "session",
      body: (row) => (row.session === null ? `-` : `${row.session} Minutes`),
    },
    { field: "modifiedOn", header: "Modified At", isDateTime: true },
    {
      field: "actions",
      header: "Actions",
      body: (row) => (
        <div className="flex gap-2">
          <i
            className="pi pi-pencil cursor-pointer"
            title="Edit"
            onClick={() => handleEdit(row)}
          />
        </div>
      ),
    },
  ];

  const quickFilters = [
    {
      column: "employee",
      header: "Employee",
      type: "dropdown",
      options: employeeOptions,
      col: 4,
    },
    {
      column: "department",
      header: "Department",
      type: "dropdown",
      options: departments,
      matchField: "_id",
      col: 4,
    },
    {
      column: "clockInDate",
      header: "Date",
      type: "date",
      targetColumn: "clockIn",
      col: 4,
    },
  ];

  const advancedFilters = [
    {
      column: "dateFrom",
      header: "Start Date",
      type: "dateFrom",
      targetColumn: "clockIn",
      col: 3,
    },
    {
      column: "dateTo",
      header: "End Date",
      type: "dateTo",
      targetColumn: "clockIn",
      col: 3,
    },
    {
      column: "timeFrom",
      header: "Time From",
      type: "timeFrom",
      targetColumn: "clockIn",
      col: 3,
    },
    {
      column: "timeTo",
      header: "Time To",
      type: "timeTo",
      targetColumn: "clockIn",
      col: 3,
    },
  ];

  return (
    <>
      <CustomDialog
        title="Edit Timesheet"
        visible={editVisible}
        onHide={() => setEditVisible(false)}
      >
        <CustomForm
          onSubmit={handleEditSubmit}
          submitLabel="Update"
          submitLoading={submitLoading}
        >
          <CustomCalendarInput
            label="Clock In"
            name="clockIn"
            data={editData}
            onChange={handleEditChange}
            showTime
            col={12}
          />
          <CustomCalendarInput
            label="Clock Out"
            name="clockOut"
            data={editData}
            onChange={handleEditChange}
            showTime
            col={12}
          />
          <CustomTextArea
            label="Comment"
            name="editReason"
            data={editData}
            onChange={handleEditChange}
            required={editData.employeeIsDeleted}
            col={12}
          />
        </CustomForm>
      </CustomDialog>
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
