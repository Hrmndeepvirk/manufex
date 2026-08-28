import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useServerTime } from "../../../../../hooks/useServerTime";
import ListPageLayout from "@shared/layout/ListPageLayout";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import formValidation, { showFormErrors } from "@formValidations";
import CustomTextArea from "@inputs/CustomTextArea";
import {
  getNotes,
  addOrUpdateNote,
  deleteNote,
} from "@store/settings/employeeSetup/manageEmployee/notesActions";

function Notes({ employee }) {
  const { getServerDate } = useServerTime();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const initialState = {
    note: "",
    dateTime: getServerDate(),
  };
  const [data, setData] = useState(initialState);

  const notes = useSelector((state) => state.settings.employeeSetup.notes);
  useEffect(() => {
    if (employee?._id) {
      dispatch(getNotes(employee?._id, setLoading));
    }
  }, [employee]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateNote(
          employee?._id,
          selectedNote,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              setShowForm(false);
              setData(initialState);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };

  const onHide = () => {
    setData(initialState);
    setShowForm(false);
  };

  let columns = [
    {
      field: "createdFrom",
      header: "Created From",
      sortable: true,
      body: (row) => `${row?.createdFrom?.firstName}`,
    },
    { field: "dateTime", header: "Date Time", isDate: true },
    { field: "note", header: "Note" },
    { field: "updatedAt", header: "Updated At", isDate: true },
  ];
  const onDelete = (id) => {
    dispatch(deleteNote(employee?._id, id));
  };

  const onEdit = (id, navigate, rowData) => {
    setSelectedNote(id);
    setData({
      note: rowData?.note || "",
      dateTime: rowData?.dateTime ? new Date(rowData.dateTime) : getServerDate(),
    });
    setShowForm(true);
  };

  return (
    <>
      {/* dialog form to add the notes */}
      <CustomDialog
        title="Add Note"
        visible={showForm}
        onHide={onHide}
        size="large"
      >
        <CustomForm
          onSubmit={handleSubmit}
          submitLabel="Save"
          submitLoading={loading}
          onCancel={onHide}
        >
          <CustomTextArea
            name="note"
            data={data}
            onChange={handleChange}
            maxLength={266}
          />
        </CustomForm>
      </CustomDialog>

      {/* Form List */}
      <ListPageLayout
        buttonLabel="Add Notes"
        onClick={() => {
          setShowForm(true);
        }}
        tableData={notes}
        columns={columns}
        addPadding
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
export default React.memo(Notes);
