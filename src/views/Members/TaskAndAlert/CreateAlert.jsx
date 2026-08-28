import React, { useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import formValidation, { showFormErrors } from "../../../utils/formValidations";
import CustomCalendarInput from "../../../shared/inputs/CustomCalendarInput";
import CustomInput from "../../../shared/inputs/CustomInput";
import CustomTextArea from "../../../shared/inputs/CustomTextArea";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/member/alertActions";
import { useResourceRequest } from "../../../hooks/useResourceRequest";

const INITIAL_DATA = {
  title: "",
  colorType: "",
  description: "",
  formErrors: {},
};

function CreateAlert({ visible, onHide, member }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...INITIAL_DATA });

  useEffect(() => {
    if (visible) {
      setData({
        ...INITIAL_DATA,
        ...(member ? { member } : {}),
      });
    }
  }, [visible, member]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    console.log(e);

    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addAlert(data, setLoading, (success, formErrors) => {
          if (success) {
            onHide();
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-ALERTS",
    targetCollection: "ALERT",
    id: null,
    data,
    setData,
    buildChangedData: (d) => ({
      title: d.title,
      colorType: d.colorType,
      description: d.description,
      member: d.member,
    }),
  });

  return (
    <CustomDialog
      title="Create Alert"
      visible={visible}
      onHide={onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLoading={loading}
        onCancel={onHide}
        buttons={requestButtons}
      >
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          col={6}
          required
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="colorType"
          optionsType="ColorTypes"
          optionLabel="title"
          optionValue="_id"
          col={6}
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
          col={12}
        />
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(CreateAlert);
