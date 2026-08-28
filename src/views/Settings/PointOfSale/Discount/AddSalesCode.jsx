import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomCard from "@shared/cards/CustomCard";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomSimpleTable, {
  CustomSimpleSelectionTable,
} from "../../../../shared/table/CustomSimpleTable";
import PrimaryButton from "../../../../shared/buttons/PrimaryButton";
import { customConfirmDialog } from "../../../../shared/overlays/CustomConfirmDialog";

const columns = [
  { field: "title", header: "Name" },
];

export default function AddSalesCode({ data, onChange, name, label }) {
  const employees = useSelector((state) => state.dropdown.employees || []);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(data?.[name] || []);
  }, [data?.[name]]);

  const handleDelete = (row) => {
    customConfirmDialog({
      message: "Do you want to remove this sales code?",
      accept: () => {
        const filtered = (data?.[name] || []).filter(
          (item) => item._id !== row._id
        );
        onChange({ name, value: filtered });
      },
    });
  };

  const handleRemoveAll = () => {
    customConfirmDialog({
      message: "Do you want to remove all sales codes?",
      accept: () => {
        onChange({ name, value: [] });
      },
    });
  };

  const handleSave = () => {
    onChange({ name, value: selected });
    setOpen(false);
  };

  return (
    <>
      <CustomCard
        title={label}
        headers={
          <div className="flex align-items-center gap-3">
            {data?.[name]?.length > 0 && (
              <PrimaryButton
                label="Remove All"
                severity="secondary"
                onClick={handleRemoveAll}
              />
            )}
            <i
              title="Add"
              className="pi pi-plus cursor-pointer"
              onClick={() => setOpen(true)}
            ></i>
          </div>
        }
      >
         <div className="c-col-12">
        <CustomSimpleTable
          data={data?.[name] || []}
          columns={columns}
          onDelete={handleDelete}
        />
        </div>
      </CustomCard>

      <CustomDialog
        title={label}
        visible={open}
        onHide={() => setOpen(false)}
        size="large"
      >
        <CustomSimpleSelectionTable
          columns={columns}
          data={employees}
          preselectedRows={selected}
          onSelectionChange={setSelected}
        />
        <div className="flex justify-content-end gap-2 mt-3">
          <PrimaryButton label="Save" onClick={handleSave} />
          <PrimaryButton
            label="Cancel"
            severity="secondary"
            onClick={() => setOpen(false)}
          />
        </div>
      </CustomDialog>
    </>
  );
}
