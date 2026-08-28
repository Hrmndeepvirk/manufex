import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomInput from "@shared/inputs/CustomInput";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";

const amountTypeOptions = [
  { title: "Fixed ($)", _id: "FIXED" },
  { title: "Percentage (%)", _id: "PERCENTAGE" },
];

const validate = (data, unitPrice) => {
  const errors = { amount: "" };
  const amt = parseFloat(data.amount);

  if (data.amount === "" || Number.isNaN(amt) || amt <= 0) {
    errors.amount = "Amount must be greater than 0";
    return errors;
  }
  if (data.amountType === "PERCENTAGE" && amt > 100) {
    errors.amount = "Percentage cannot exceed 100%";
    return errors;
  }
  if (data.amountType === "FIXED" && amtgg > unitPrice) {
    errors.amount = `Amount cannot exceed item price ($${unitPrice})`;
    return errors;
  }
  return errors;
};

export default function SpecialDiscountDialog({ visible, setVisible, onApply }) {
  const [data, setData] = useState({
    amount: "",
    amountType: "FIXED",
    formErrors: { amount: "" },
  });

  const unitPrice = visible?.item?.finalUnitPrice ?? visible?.item?.unitPrice ?? 0;

  useEffect(() => {
    if (visible?.discount) {
      setData({
        amount: visible.discount?.amount || "",
        amountType: visible.discount?.amountType || "FIXED",
        formErrors: { amount: "" },
      });
    } else {
      setData({ amount: "", amountType: "FIXED", formErrors: { amount: "" } });
    }
  }, [visible]);

  const onClose = () => {
    setVisible(false);
  };

  const handleChange = ({ name, value }) => {
    const next = { ...data, [name]: value };
    next.formErrors = validate(next, unitPrice);
    setData(next);
  };

  const onSubmit = () => {
    const errors = validate(data, unitPrice);
    if (errors.amount) {
      setData((prev) => ({ ...prev, formErrors: errors }));
      return;
    }
    onApply(visible.index, {
      amount: parseFloat(data.amount),
      amountType: data.amountType,
    });
    onClose();
  };

  const isInvalid = !data.amount || !!data.formErrors.amount;

  return (
    
    <CustomDialog title="Special Discount" visible={!!visible} onHide={onClose}>
      <div className="grid">
        <CustomInput
          col={6}
          name="amount"
          label="Amount"
          type="number"
          max={data.amountType === "PERCENTAGE" ? 100 : unitPrice}
          data={data}
          value={data.amount}
          onChange={handleChange}
        />
        <CustomDropdown
          col={6}
          name="amountType"
          label="Type"
          value={data.amountType}
          onChange={handleChange}
          options={amountTypeOptions}
        />
      </div>
      <div className="flex justify-content-end gap-2 mt-3">
        <PrimaryButton label="Apply" onClick={onSubmit} disabled={isInvalid} />
        <PrimaryButton label="Cancel" severity="secondary" onClick={onClose} />
      </div>
    </CustomDialog>
  );

}
