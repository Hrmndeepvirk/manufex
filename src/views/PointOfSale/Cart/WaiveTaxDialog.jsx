import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import { getWaiveTaxReasons } from "../../../store/pointOfSale/pointOfSaleActions";

export default function WaiveTaxDialog({ visible, onConfirm, onCancel }) {
  const dispatch = useDispatch();
  const [reasonCodes, setReasonCodes] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      dispatch(getWaiveTaxReasons(setLoading, (data) => setReasonCodes(data)));
    }
  }, [visible, dispatch]);

  const handleClose = () => {
    setSelectedReason("");
    setReasonCodes([]);
    onCancel();
  };

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason);
    setSelectedReason("");
    setReasonCodes([]);
  };

  return (
    <CustomDialog
      title="Waive Tax"
      visible={visible}
      onHide={handleClose}
      size="small"
    >
      <div className="mb-3">
        <p className="text-600">Select a reason to waive tax for this item.</p>
      </div>

      <CustomDropdown
        label="Reason Code"
        name="reasonCode"
        value={selectedReason}
        onChange={(e) => setSelectedReason(e.value)}
        options={reasonCodes}
        optionLabel="title"
        optionValue="_id"
        required
        col={12}
      />

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton label="Cancel" outlined onClick={handleClose} />
        <PrimaryButton
          label="Waive Tax"
          onClick={handleConfirm}
          disabled={!selectedReason}
          loading={loading}
        />
      </div>
    </CustomDialog>
  );
}
