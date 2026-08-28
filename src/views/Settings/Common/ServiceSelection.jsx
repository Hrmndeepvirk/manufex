import React, { useState, useEffect, useMemo } from "react";
import CustomCard from "@shared/cards/CustomCard";
import CustomDialog from "@shared/overlays/CustomDialog";
import { CustomSimpleSelectionTable } from "@shared/table/CustomSimpleTable";
import { useSelector } from "react-redux";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomCurrencyInput from "@inputs/CustomCurrencyInput";
import CustomForm from "@inputs/CustomForm";
import CustomNumberInput from "@inputs/CustomNumberInput";
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";

function ServiceSelection({ onServicesChange, initialServices, errorMessage }) {
  const { formatCurrency } = useCurrencyFormatter();

  const [showServicesListDialog, setShowServicesListDialog] = useState(false);
  const [showEditServiceDialog, setShowEditServiceDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [addedServices, setAddedServices] = useState([]);
  const [editService, setEditService] = useState({});
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [editedPrice, setEditedPrice] = useState(0);
  const [allowUnlimited, setAllowUnlimited] = useState(false);

  const catalogItems = useSelector((state) => state.dropdown.catalogItems);

  // ✅ Memoized to avoid infinite loop
  const filteredServices = useMemo(() => {
    return catalogItems.filter(
      (service) =>
        service?.type === "SERVICE" &&
        (service.itemSold === "POS_AGREEMENTS" ||
          service.itemSold === "AGREEMENTS"),
    );
  }, [catalogItems]);

  // ✅ Safe effect (no loop)
  useEffect(() => {
    if (!initialServices) return;

    if (initialServices.length === 0) {
      setAddedServices([]);
      return;
    }

    const fullServices = initialServices.map((s) => {
      const catalogService = filteredServices.find((fs) => fs._id === s._id);
      const { defaultQuantity, ...rest } = s;

      return catalogService
        ? {
            ...catalogService,
            ...rest,
            quantity: s.quantity ?? defaultQuantity,
          }
        : { ...rest, quantity: s.quantity ?? defaultQuantity };
    });

    setAddedServices(fullServices);
  }, [initialServices, filteredServices]);

  const servicesListColumns = [
    { header: "Service", field: "title" },
    {
      header: "Default Quantity",
      field: "defaultQuantity",
      body: (row) => {
        if (row.allowUnlimited) {
          return "Unlimited";
        }
        return row.defaultQuantity;
      },
    },
    {
      header: "Price",
      body: (row) => {
        if (row.allowUnlimited) {
          return formatCurrency(row.price);
        }
        return formatCurrency(row.defaultQuantity * row.price);
      },
    },
  ];

  const selectedServicesColumns = [
    {
      header: "S.No",
      body: (_, rowIndex) => rowIndex + 1,
    },
    { header: "Service", field: "title" },
    {
      header: "Quantity",
      field: "quantity",
      body: (row) => {
        if (row.allowUnlimited) {
          return "Unlimited";
        }
        return row.quantity;
      },
    },
    {
      header: "Price",
      body: (row) => {
        if (row.allowUnlimited) {
          return formatCurrency(row.price);
        }
        return formatCurrency(row.defaultQuantity * row.price);
      },
    },
  ];

  const pushServicesToList = () => {
    const merged = [...addedServices];

    selectedServices.forEach((service) => {
      if (!merged.some((s) => s._id === service._id)) {
        const { defaultQuantity, ...rest } = service;
        merged.push({ ...rest, quantity: defaultQuantity });
      }
    });

    setAddedServices(merged);
    onServicesChange?.(
      merged.map(({ _id, price, quantity }) => ({ _id, price, quantity })),
    );
    setShowServicesListDialog(false);
  };

  const onEdit = (rowData) => {
    setEditService(rowData);
    setEditedQuantity(rowData.quantity);
    setEditedPrice(rowData.price);
    setAllowUnlimited(rowData.allowUnlimited || false);
    setShowEditServiceDialog(true);
  };

  const onDelete = (row) => {
    const updated = addedServices.filter((service) => service._id !== row._id);
    setAddedServices(updated);
    onServicesChange?.(
      updated.map(({ _id, price, quantity }) => ({ _id, price, quantity })),
    );
  };

  const saveEditedService = (e) => {
    e.preventDefault();

    const updated = addedServices.map((s) =>
      s._id === editService._id
        ? {
            ...s,
            quantity: editedQuantity,
            price: editedPrice,
            allowUnlimited: allowUnlimited,
          }
        : s,
    );

    setAddedServices(updated);
    onServicesChange?.(
      updated.map(({ _id, price, quantity, allowUnlimited }) => ({
        _id,
        price,
        quantity,
        allowUnlimited,
      })),
    );
    setShowEditServiceDialog(false);
  };

  const originalService = filteredServices.find(
    (fs) => fs._id === editService?._id,
  );

  return (
    <>
      {/* SERVICES LIST */}
      <CustomDialog
        title="Services"
        visible={showServicesListDialog}
        onHide={() => setShowServicesListDialog(false)}
        size="medium"
      >
        <CustomSimpleSelectionTable
          columns={servicesListColumns}
          data={filteredServices}
          preselectedRows={filteredServices.filter((fs) =>
            addedServices.some((as) => as._id === fs._id),
          )}
          onSelectionChange={setSelectedServices}
        />

        <div className="flex justify-content-end gap-2 mt-3">
          <PrimaryButton label="Add" onClick={pushServicesToList} />
          <PrimaryButton
            label="Cancel"
            severity="secondary"
            onClick={() => setShowServicesListDialog(false)}
          />
        </div>
      </CustomDialog>

      {/* EDIT SERVICE */}
      <CustomDialog
        title="Edit Service"
        visible={showEditServiceDialog}
        onHide={() => setShowEditServiceDialog(false)}
      >
        <CustomForm
          onSubmit={saveEditedService}
          submitLabel="Save"
          onCancel={() => setShowEditServiceDialog(false)}
        >
          <div className="flex c-col-12 gap-3 align-items-center border-1 border-200 p-3 border-round-lg">
            <img
              src={originalService?.images?.[0]}
              alt="Service"
              style={{
                width: "85px",
                height: "85px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div className="flex flex-column w-full">
              <h2 className="text-xl font-semibold">{editService.title}</h2>
              <div>Quantity: {originalService?.defaultQuantity}</div>
              <div>Price: {formatCurrency(originalService?.price)}</div>
            </div>
          </div>

          <CustomDropdown
            value={allowUnlimited}
            onChange={(e) => setAllowUnlimited(e.value)}
            label="Allow Unlimited"
            booleanOptions
            col={12}
          />
          {!allowUnlimited && (
            <CustomNumberInput
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(e.value)}
              label="Quantity"
              col={12}
              useGrouping={false}
            />
          )}

          <CustomCurrencyInput
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.value)}
            label="Price"
            col={12}
            useGrouping={false}
          />
        </CustomForm>
      </CustomDialog>

      {/* SELECTED SERVICES TABLE */}
      <CustomCard
        title="Services"
        actions
        onAdd={() => setShowServicesListDialog(true)}
      >
        <div className="c-col-12">
          <CustomSimpleTable
            columns={selectedServicesColumns}
            data={addedServices}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
        {errorMessage && <div className="p-error">{errorMessage}</div>}
      </CustomCard>
    </>
  );
}

export default React.memo(ServiceSelection);
