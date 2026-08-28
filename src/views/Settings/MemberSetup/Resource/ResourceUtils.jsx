import React, { useState, useEffect } from "react";
import CustomCard from "@shared/cards/CustomCard";
import CustomDialog from "@shared/overlays/CustomDialog";
import { CustomSimpleSelectionTable } from "@shared/table/CustomSimpleTable";
import { useSelector } from "react-redux";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomForm from "@inputs/CustomForm";

function ResourceUtils({
  onServicesChange,
  initialServices,
  errorMessage,
}) {
  const locations = useSelector((state) => state.dropdown.locations);

  const [showLocationListPopup, setShowLocationListPopup] = useState(false);
  const [editLocationPopup, setEditLocationPopup] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [addedLocations, setAddedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      const fullLocations = initialServices.map((s) => {
        const location = locations.find((fs) => fs._id === s._id);
        return location
          ? { ...location, quantity: s.quantity ?? 1 }
          : { ...s, quantity: s.quantity ?? 1 };
      });
      setAddedLocations(fullLocations);
    } else if (initialServices && initialServices.length === 0) {
      setAddedLocations([]);
    }
  }, [initialServices, locations]);

  const onHideLocationListPopup = () => {
    setShowLocationListPopup(false);
  };

  const locationsListColumns = [
    { header: "Title", field: "title" },
    { header: "Outdoor Location", field: "outsideLocation", isBoolean: true },
  ];

  const addedLocationsColumns = [
    {
      header: "S.No",
      body: (_, rowIndex) => rowIndex + 1,
    },
    { header: "Title", field: "title" },
    { header: "Outdoor Location", field: "outsideLocation", isBoolean: true },
    { header: "Quantity", body: (row) => row.quantity ?? 1 },
  ];

  const pushLocationsToSelected = () => {
    const merged = [...addedLocations];
    selectedLocations.forEach((location) => {
      if (!merged.some((s) => s._id === location._id)) {
        merged.push({ ...location, quantity: 1 });
      }
    });
    setAddedLocations(merged);
    if (onServicesChange)
      onServicesChange(
        merged.map(({ _id, quantity }) => ({ _id, quantity }))
      );
    setShowLocationListPopup(false);
  };

  const onEdit = (row) => {
    setSelectedLocation(row);
    setEditLocationPopup(true);
  };
  const onDelete = (row) => {
    const updated = addedLocations.filter(
      (location) => location._id !== row._id
    );
    setAddedLocations(updated);
    setSelectedLocations((prev) => prev.filter((loc) => loc._id !== row._id));
    if (onServicesChange)
      onServicesChange(
        updated.map(({ _id, quantity }) => ({ _id, quantity }))
      );
  };

  const onHideEditPopup = () => {
    setEditLocationPopup(false);
  };

  const onSaveQuantity = (e) => {
    e.preventDefault();
    const updated = addedLocations.map((loc) =>
      loc._id === selectedLocation._id
        ? { ...loc, quantity: selectedLocation.quantity }
        : loc
    );
    setAddedLocations(updated);
    if (onServicesChange)
      onServicesChange(
        updated.map(({ _id, quantity }) => ({ _id, quantity }))
      );
    setEditLocationPopup(false);
  };

  return (
    <>
      {/* Location List Dialog */}
      <CustomDialog
        title="Locations"
        visible={showLocationListPopup}
        onHide={onHideLocationListPopup}
        size="medium"
      >
        <CustomSimpleSelectionTable
          columns={locationsListColumns}
          data={locations}
          preselectedRows={locations.filter((fs) =>
            addedLocations.some((as) => as._id === fs._id)
          )}
          onSelectionChange={(row) => setSelectedLocations(row)}
        />

        <div className="flex justify-content-end gap-2 mt-3">
          <PrimaryButton label="Add" onClick={pushLocationsToSelected} />
          <PrimaryButton
            label="Cancel"
            severity="secondary"
            onClick={onHideLocationListPopup}
          />
        </div>
      </CustomDialog>

      {/* Dialog to edit a service */}
      <CustomDialog
        title={`Set Quantity for ${selectedLocation?.title}`}
        visible={editLocationPopup}
        onHide={onHideEditPopup}
      >
        <CustomForm
          onSubmit={onSaveQuantity}
          submitLabel={"Save"}
          onCancel={onHideEditPopup}
        >
          <CustomNumberInput
            value={selectedLocation.quantity}
            onChange={(e) =>
              setSelectedLocation((prev) => ({ ...prev, quantity: e.value }))
            }
            name="quantity"
            col={12}
            label="Quantity"
            useGrouping={false}
          />
        </CustomForm>
      </CustomDialog>

      <CustomCard
        title="Locations"
        actions
        onAdd={() => setShowLocationListPopup(true)}
      >
        <div className="c-col-12">
          <CustomSimpleTable
            columns={addedLocationsColumns}
            data={addedLocations}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
        {errorMessage && <div className="p-error c-col-12">{errorMessage}</div>}
      </CustomCard>
    </>
  );
}
export default React.memo(ResourceUtils);
