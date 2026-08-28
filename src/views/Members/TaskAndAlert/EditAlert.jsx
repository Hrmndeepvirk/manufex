import React, { useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import { useDispatch } from "react-redux";
import { editAlert } from "../../../store/member/alertActions";
import { useResourceRequest } from "../../../hooks/useResourceRequest";

const StatusOptions = [
  { title: "Active", _id: true },
  { title: "Inactive", _id: false },
];

const AcknowledgedOptions = [
  { title: "Yes", _id: true },
  { title: "No", _id: false },
];

function EditAlert({ visible, onHide, alertData }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    isActive: true,
    isAcknowledged: false,
  });

  useEffect(() => {
    if (alertData) {
      setData({
        isActive: alertData.isActive !== false,
        isAcknowledged: alertData.isAcknowledged || false,
      });
    }
  }, [alertData]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alertData?._id) return;

    dispatch(
      editAlert(alertData._id, data, setLoading, (success) => {
        if (success) {
          onHide();
        }
      }),
    );
  };

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-ALERTS",
    targetCollection: "ALERT",
    id: alertData?._id,
    data,
    setData,
  });

  return (
    <CustomDialog
      title="Edit Alert"
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
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="isActive"
          label="Status"
          options={StatusOptions}
          optionLabel="title"
          optionValue="_id"
          col={6}
        />
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="isAcknowledged"
          label="Acknowledged"
          options={AcknowledgedOptions}
          optionLabel="title"
          optionValue="_id"
          col={6}
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(EditAlert);
