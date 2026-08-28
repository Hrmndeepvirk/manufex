import React, { useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomInput from "@shared/inputs/CustomInput";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import { saveCart } from "../../../store/pointOfSale/savedCartActions";
import { showToastAction } from "../../../store/common/commonActions";

export default function SaveCartDialog({
  visible,
  onHide,
  selectedMember,
  selectedItems,
  cartDetails,
  onCartSaved,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      dispatch(
        showToastAction({
          description: "Please enter a cart name.",
          type: "warning",
        })
      );
      return;
    } 
    if (!selectedMember) {
      dispatch(
        showToastAction({
          description: "Please select a member to continue.",
          type: "warning",
        })
      );
      return;
    }

    const payload = {
      member: selectedMember,
      name: name.trim(),
      amount: cartDetails?.gradTotal,
      items: selectedItems,
    };

    dispatch(
      saveCart(payload, setLoading, () => {
        setName("");
        onCartSaved();
      })
    );
  };

  const handleHide = () => {
    setName("");
    onHide();
  };

  return (
    <CustomDialog title="Save Cart" visible={visible} onHide={handleHide}>
      <CustomInput
        col={12}
        name="name"
        label="Cart Name"
        value={name}
        onChange={(e) => setName(e.value)}
      />
      <div className="flex justify-content-end gap-2 mt-3">
        <PrimaryButton
          label="Save"
          loading={loading}
          onClick={handleSave}
        />
        <PrimaryButton
          label="Cancel"
          severity="secondary"
          onClick={handleHide}
        />
      </div>
    </CustomDialog>
  );
}
   