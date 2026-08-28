import React, { useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomTextArea from "../../../shared/inputs/CustomTextArea";
import { useDispatch } from "react-redux";
import { addNote, updateNote } from "../../../store/member/noteAction";
import formValidation, { showFormErrors } from "../../../utils/formValidations";

function CreateNote({ visible, onHide, member, editData = null }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    description: "",
  });

  useEffect(() => {
    if (visible) {
      if (editData) {
        setData({
          description: editData.name || "",
        });
      } else {
        setData({
          description: "",
        });
      }
    }
  }, [visible, editData]);
                          
  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (showFormErrors(data, setData)) {
      if (editData) {
        dispatch(
          updateNote(member, editData._id, data, setLoading, (success, formErrors) => {
            if (success) {
              onHide();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          })
        );
      } else {
        dispatch(
          addNote(member, data, setLoading, (success, formErrors) => {
            if (success) {
              onHide();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          })
        );
      }
    }
  };

  return (
    <CustomDialog
      title={editData ? "Edit Note" : "Create Note"}
      visible={visible}
      onHide={onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLoading={loading}
        onCancel={onHide}
      >
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
          col={12}
          maxLength={500}
          rows={6}
          required
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(CreateNote);