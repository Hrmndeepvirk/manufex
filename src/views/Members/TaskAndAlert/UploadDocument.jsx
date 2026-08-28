import React, { useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "../../../shared/inputs/CustomInput";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import CustomFileInput from "../../../shared/inputs/CustomFileInput";
import formValidation, { showFormErrors } from "../../../utils/formValidations";
import { useDispatch } from "react-redux";
import { addDocument } from "../../../store/member/documentActions";
import { uploadFiles } from "../../../store/common/commonActions";

const DocumentTypes = [
  { title: "License", _id: "LICENSE" },
  { title: "Passport", _id: "PASSPORT" },
  { title: "Other", _id: "OTHER" },
];

function UploadDocument({ visible, onHide, member }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    govtId: "",
    type: "",
    file: [],
  });

  useEffect(() => {
    if (visible) {
      setData({
        name: "",
        govtId: "",
        type: "",
        file: [],
        member: member,
      });
    }
  }, [visible, member]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      setLoading(true);
      let fileData = null;
      if (data.file?.length > 0) {
        const uploaded = await uploadFiles(data.file);
        if (uploaded?.length > 0) {
          fileData = uploaded[0];
        }
      }

      const payload = {
        member: data.member,
        name: data.name,
        govtId: data.govtId,
        type: data.type,
        file: fileData,
      };

      dispatch(
        addDocument(payload, null, (success) => {
          setLoading(false);
          if (success) {
            onHide();
          }
        }),
      );
    }
  };

  return (
    <CustomDialog
      title="Document"
      visible={visible}
      onHide={onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLoading={loading}
        onCancel={onHide}
        submitLabel="Save"
      >
        <CustomInput
          data={data}
          onChange={handleChange}
          name="name"
          col={4}
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="govtId"
          label="Govt Id"
          col={4}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="type"
          options={DocumentTypes}
          optionLabel="title"
          optionValue="_id"
          col={4}
          required
        />
        <CustomFileInput
          data={data}
          onChange={handleChange}
          name="file"
          label="Upload Document"
          col={12}
          limit={1}
          helpText="Upload only Image/Pdf"
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(UploadDocument);
