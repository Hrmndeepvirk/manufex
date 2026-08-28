import React, { useState, useEffect, useMemo } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { getDiscounts } from "../../../store/settings/pointOfSale/discountActions";

export default function SelectDiscountDialog({ visible, setVisible, onApply }) {
  const dispatch = useDispatch();
  const discounts = useSelector((state) => state.settings.pointOfSale.discounts);

  const [selectedDiscount, setSelectedDiscount] = useState("");

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      setSelectedDiscount(visible.item?._id || "");
    }
  }, [visible]);

  const discountOptions = useMemo(() => {
    const itemId = visible?.itemId ? String(visible.itemId) : null;
    return discounts
      .filter((disc) => {
        // Only show discounts that apply to this item
        const services = disc.services || [];
        if (services.length === 0) return true; // no restriction — applies to all
        return services.some((sId) => String(sId?._id || sId) === itemId);
      })
      .map((disc) => ({
        title: `${disc.title} (${disc.discountCode})`,
        _id: disc._id,
      }));
  }, [discounts, visible]);

  const onClose = () => {
    setVisible(false);
  };

  const onSubmit = () => {
    if (selectedDiscount) {
      const disc = discounts.find((d) => d._id === selectedDiscount);
      if (disc) {
        const transformed = {
          _id: disc._id,
          discountCode: disc.discountCode,
          title: disc.title,
          amount: disc.amount?.value ?? disc.amount,
          amountType: disc.amount?.unit === "PERCENT" ? "PERCENTAGE" : "FIXED",
          multiItemDiscountCheck: disc.isMultiItemDiscount || false,
          multiItemDiscount: disc.multiItemDiscounts || [],
          canBeCombined: disc.canBeCombined ?? false,
          services: disc.services || [],
        };
        onApply(visible.index, transformed);
        onClose();
      }
    }
  };

  return (
    <CustomDialog title="Select Discount" visible={!!visible} onHide={onClose}>
      <CustomDropdown
        name="discount"
        label="Discount"
        col={12}
        value={selectedDiscount}
        onChange={(e) => setSelectedDiscount(e.value)}
        options={discountOptions}
        clearable
      />
      <div className="flex justify-content-end gap-2 mt-3">
        <PrimaryButton label="Apply" onClick={onSubmit} />
        <PrimaryButton label="Cancel" severity="secondary" onClick={onClose} />
      </div>
    </CustomDialog>
  );
}
