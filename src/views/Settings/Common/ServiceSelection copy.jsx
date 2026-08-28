import React, { useState, useEffect } from "react";
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

function ServiceSelection({ onServicesChange, initialServices, errorMessage }) {
  const [showServicesListDialog, setShowServicesListDialog] = useState(false);
  const [showEditServiceDialog, setShowEditServiceDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [addedServices, setAddedServices] = useState([]);
  const [editService, setEditService] = useState({});
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [editedPrice, setEditedPrice] = useState(0);
  const { formatCurrency } = useCurrencyFormatter();

  const catalogItems = useSelector((state) => state.dropdown.catalogItems);
  const filteredServices = catalogItems.filter(
    (service, _) =>
      service?.type === "SERVICE" &&
      (service.itemSold === "POS_AGREEMENTS" ||
        service.itemSold === "AGREEMENTS")
  );

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
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
    } else if (initialServices && initialServices.length === 0) {
      setAddedServices([]);
    }
  }, [initialServices, filteredServices]);

  const onAddNewServices = () => {
    setShowServicesListDialog(true);
  };

  const servicesListColumns = [
    { header: "Service", field: "title" },
    { header: "Default Quantity", field: "defaultQuantity" },
    {
      header: "Price",
      body: (row) => formatCurrency(row.defaultQuantity * row.price),
      isCurrency: true,
    },
  ];

  const selectedServicesColumns = [
    {
      header: "S.No",
      body: (_, rowIndex) => rowIndex + 1,
    },
    { header: "Service", field: "title" },
    { header: "Quantity", field: "quantity" },
    {
      header: "Price",
      field: "price",
      body: (row) => formatCurrency(row.quantity * row.price),
      isCurrency: true,
    },
  ];

  const onHideServicesListPopup = () => {
    setShowServicesListDialog(false);
  };

  const pushServicesToList = () => {
    const merged = [...addedServices];

    selectedServices.forEach((service) => {
      if (!merged.some((s) => s._id === service._id)) {
        const { defaultQuantity, ...rest } = service;
        merged.push({ ...rest, quantity: defaultQuantity });
      }
    });

    setAddedServices(merged);
    if (onServicesChange)
      onServicesChange(
        merged.map(({ _id, price, quantity }) => ({ _id, price, quantity }))
      );
    setShowServicesListDialog(false);
  };

  const onEdit = (rowData) => {
    setEditService(rowData);
    setEditedQuantity(rowData.quantity);
    setEditedPrice(rowData.price);
    setShowEditServiceDialog(true);
  };

  const onDelete = (row) => {
    const updated = addedServices.filter((service) => service._id !== row._id);
    setAddedServices(updated);
    if (onServicesChange)
      onServicesChange(
        updated.map(({ _id, price, quantity }) => ({ _id, price, quantity }))
      );
  };

  const onHideEditServiceDialog = () => {
    setShowEditServiceDialog(false);
  };

  const saveEditedService = (e) => {
    e.preventDefault();
    const updatedService = {
      ...editService,
      quantity: editedQuantity,
      price: editedPrice,
    };
    const updated = addedServices.map((s) =>
      s._id === editService._id ? updatedService : s
    );
    setAddedServices(updated);
    if (onServicesChange)
      onServicesChange(
        updated.map(({ _id, price, quantity }) => ({ _id, price, quantity }))
      );
    setShowEditServiceDialog(false);
  };

  const originalService = filteredServices.find(
    (fs) => fs._id === editService?._id
  );

  return (
    <>
      <CustomDialog
        title="Services"
        visible={showServicesListDialog}
        onHide={onHideServicesListPopup}
        size="medium"
      >
        <CustomSimpleSelectionTable
          columns={servicesListColumns}
          data={filteredServices}
          preselectedRows={filteredServices.filter((fs) =>
            addedServices.some((as) => as._id === fs._id)
          )}
          onSelectionChange={(row) => setSelectedServices(row)}
        />

        <div className="flex justify-content-end gap-2 mt-3">
          <PrimaryButton label="Add" onClick={pushServicesToList} />
          <PrimaryButton
            label="Cancel"
            severity="secondary"
            onClick={onHideServicesListPopup}
          />
        </div>
      </CustomDialog>

      <CustomDialog
        title="Edit Service"
        visible={showEditServiceDialog}
        onHide={onHideEditServiceDialog}
      >
        <CustomForm
          onSubmit={saveEditedService}
          submitLabel={"Save"}
          onCancel={onHideEditServiceDialog}
        >
          <div className="flex c-col-12 gap-3 align-items-center border-1 border-200 p-3 border-round-lg">
            <div className="flex align-items-center justify-content-center mr-3">
              <img
                src={editService?.images}
                alt="User"
                className="border-1 border-200"
                style={{
                  width: "85px",
                  height: "85px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>

            <div className="flex flex-column justify-content-center w-full">
              <div className="flex align-items-center justify-content-between w-full">
                <h2 className="my-auto text-xl font-semibold text-900">
                  {editService.title}
                </h2>
              </div>

              <div className="flex flex-column">
                <div title="Default Quantity">
                  Quantity: {originalService?.defaultQuantity}
                </div>
                <div title="Default unit price ">
                  Price: {formatCurrency(originalService?.price)}
                </div>
              </div>
            </div>
          </div>
          <CustomNumberInput
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.value)}
            name="quantity"
            col={12}
            label="Quantity"
            useGrouping={false}
          />
          <CustomCurrencyInput
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.value)}
            name="price"
            col={12}
            label="Price(per unit)"
            useGrouping={false}
          />
        </CustomForm>
      </CustomDialog>

      <CustomCard title="Services" actions onAdd={onAddNewServices}>
        <div className="c-col-12">
          <CustomSimpleTable
            columns={selectedServicesColumns}
            data={addedServices}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
        {errorMessage && <div className="p-error c-col-12">{errorMessage}</div>}
      </CustomCard>
    </>
  );
}
export default React.memo(ServiceSelection);
