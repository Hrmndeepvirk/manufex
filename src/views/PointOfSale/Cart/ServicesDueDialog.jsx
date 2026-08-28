import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import { CustomSimpleSelectionTable } from "@shared/table/CustomSimpleTable";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import { usePos } from "../PosContext";

export default function ServicesDueDialog({ visible, onHide, pendingPastDues, memberId }) {
  const navigate = useNavigate();
  const { selectedItems: cartItems } = usePos();

  const getPreselected = (pastDues, cart) => {
    const cartCountMap = {};
    (cart || []).forEach((ci) => {
      const id = (ci.catalogItemId || ci._id)?.toString();
      if (id) cartCountMap[id] = (cartCountMap[id] || 0) + (ci.quantity || 1);
    });
    const usedCount = {};
    return (pastDues || []).filter((row) => {
      if (!row.service?._id) return false;
      const id = row.service._id.toString();
      const available = cartCountMap[id] || 0;
      const used = usedCount[id] || 0;
      if (used < available) {
        usedCount[id] = used + 1;
        return true;
      }
      return false;
    });
  };

  const [tableKey, setTableKey] = useState(0);
  const [preselected, setPreselected] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;
  const pendingPastDuesRef = useRef(pendingPastDues);
  pendingPastDuesRef.current = pendingPastDues;

  useEffect(() => {
    if (visible) {
      const computed = getPreselected(pendingPastDuesRef.current, cartItemsRef.current);
      setPreselected(computed);
      setSelectedItems(computed);
      setTableKey((k) => k + 1);
    }
  }, [visible]);

  const pendingSelected = selectedItems.filter(
    (i) => i.status === "PENDING" && i.service?._id,
  );

  const handleClose = () => {
    onHide();
  };

  const handleAddToCart = (e) => {
    e?.preventDefault();
    const countMap = {};
    pendingSelected.forEach((item) => {
      const id = item.service._id.toString();
      countMap[id] = (countMap[id] || 0) + 1;
    });
    const _selected = Object.entries(countMap).map(([_id, quantity]) => ({ _id, quantity }));
    if (!_selected.length) return;
    handleClose();
    navigate("/point-of-sale", {
      replace: true,
      state: { catalogItems: _selected, member: memberId },
    });
  };

  const columns = [
    {
      field: "resource",
      header: "Resource",
      body: (row) => row?.resource?.title || "-",
    },
    {
      field: "service",
      header: "Service Owed",
      body: (row) => row?.service?.title || "-",
    },
    {
      field: "type",
      header: "Type",
      body: (row) => formatEnum(row?.type),
    },
    {
      field: "createdAt",
      header: "Date",
      body: (row) => getDateTime(row.createdAt),
    },
  ];

  return (
    <CustomDialog
      title="Services Due"
      visible={visible}
      onHide={handleClose}
      size="large"
    >
      <CustomForm
        onSubmit={handleAddToCart}
        submitLabel={pendingSelected.length > 0 ? `Add to Cart (${pendingSelected.length})` : "Add to Cart"}
        submitDisabled={pendingSelected.length === 0}
        onCancel={handleClose}
        cancelLabel="Cancel"
      >
        <div className="c-col-12">
          <CustomSimpleSelectionTable
            key={tableKey}
            data={pendingPastDues}
            columns={columns}
            onSelectionChange={setSelectedItems}
            preselectedRows={preselected}
          />
        </div>
      </CustomForm>
    </CustomDialog>
  );
}
