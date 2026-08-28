import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import { useDispatch } from "react-redux";
import { CustomSimpleSelectionTable } from "@shared/table/CustomSimpleTable";
import {
  addOrUpdateCatalog,
  getCatalog,
  updatePaysToRecords,
} from "../../../../../../store/settings/inventory/catalogActions";
import { useParams } from "react-router-dom";

export default function PaysToDialog({
  services,
  visible,
  onHide,
  paysToServices,
  setPaysToServices,
  preSelectedRows,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "title", header: "Service" },
    { field: "itemCaption", header: "Item Caption" },
  ];

  const handleCancel = () => {
    onHide();
    setPaysToServices([]);
  };

  const handleChange = (row) => {
    setPaysToServices(row);
  };

  const _preSelectedRows = services?.filter((item) =>
    preSelectedRows?.includes(item?._id),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      paysTo: paysToServices?.map((i) => i?._id),
    };

    dispatch(
      updatePaysToRecords(id, setLoading, payload, (success, payload) => {
        if (success) {
          handleCancel();
        }
      }),
    );
  };

  return (
    <CustomDialog
      title="Add services which pays to this item"
      visible={visible}
      size="small"
      onHide={handleCancel}
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Add"
        submitLoading={loading}
        onCancel={handleCancel}
      >
        <div className="c-col-12">
          <CustomSimpleSelectionTable
            columns={columns}
            data={services}
            onSelectionChange={(row) => handleChange(row)}
            preselectedRows={_preSelectedRows}
            searchFields={["title", "itemCaption"]}
          />
        </div>
      </CustomForm>
    </CustomDialog>
  );
}
