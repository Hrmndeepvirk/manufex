import React, { useState } from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomAccordion from "../../../../../../shared/accordion/CustomAccordion";
import PrimaryButton from "../../../../../../shared/buttons/PrimaryButton";
import AddEditVariationForm from "./AddEditVariationForm";
import AddEditSubVariationForm from "./AddEditSubVariationForm";
import { customConfirmDialog } from "../../../../../../shared/overlays/CustomConfirmDialog";
import {
  deleteCatalogvariation,
  reorderPriority,
} from "../../../../../../store/settings/inventory/catalogVariationActions";
import { useDispatch } from "react-redux";
import { deleteCatalog } from "../../../../../../store/settings/inventory/catalogActions";

function Variation({
  editItem,
  variations = [],

  getVariations,
}) {
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showVariationForm, setShowVariationForm] = useState(false);

  const onEditVariation = (item) => {
    setSelectedVariation(item);
    setShowVariationForm(true);
  };

  const onDeleteVariation = (item) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => onDeleteVariationFunction(item._id),
      reject: () => {},
    });
  };
  const onShowVariationForm = () => {
    setShowVariationForm(true);
  };
  const onHideVariationForm = () => {
    setShowVariationForm(false);
    setSelectedVariation(null);
  };

  const [selectedSubVariation, setSelectedSubVariation] = useState(null);
  const [showSubVariationForm, setShowSubVariationForm] = useState(false);

  const onAddSubVariation = (item) => {
    setSelectedVariation(item);
    setShowSubVariationForm(true);
  };

  const onEditSubVariation = (item) => {
    setSelectedSubVariation(item);
    setShowSubVariationForm(true);
  };
  const onHideSubVariationForm = () => {
    setShowSubVariationForm(false);
    setSelectedSubVariation(null);
    setSelectedVariation(null);
  };
  const onDeleteSubVariation = (item) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => onDeleteSubVariationFunction(item._id),
      reject: () => {},
    });
  };

  const customHeader = (item) => {
    return (
      <div className="flex align-items-center justify-content-between gap-2 w-full ml-auto">
        <div>{item?.title}</div>
        <div className="flex gap-3 mr-3">
          <i
            className="pi pi-plus-circle"
            onClick={(e) => {
              e.stopPropagation();
              onAddSubVariation(item);
            }}
          ></i>
          <i
            className="pi pi-pencil"
            onClick={(e) => {
              e.stopPropagation();
              onEditVariation(item);
            }}
          ></i>
          <i
            className="pi pi-trash"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteVariation(item);
            }}
          ></i>
        </div>
      </div>
    );
  };

  function onDeleteVariationFunction(itemId) {
    // Implement deletion logic here
    dispatch(
      deleteCatalogvariation(itemId, setPageLoading, (success, errors) => {
        if (success) {
          getVariations();
        } else {
          // Handle errors
        }
      })
    );
  }
  function onDeleteSubVariationFunction(itemId) {
    // Implement deletion logic here
    dispatch(
      deleteCatalog(itemId, setPageLoading, (success, errors) => {
        if (success) {
          getVariations();
        } else {
          // Handle errors
        }
      })
    );
  }

  const onRowReorder = (updated) => {
    // setVariations(updated.value);
    const ids = updated.value.map((item) => item._id);

    dispatch(
      reorderPriority({
        catalogItems: ids,
      })
    );
  };

  return (
    <>
      <AddEditVariationForm
        item={editItem}
        selectedVariation={selectedVariation}
        show={showVariationForm}
        onHide={onHideVariationForm}
        getVariations={getVariations}
      />
      <AddEditSubVariationForm
        item={editItem}
        selectedSubVariation={selectedSubVariation}
        selectedVariation={selectedVariation}
        show={showSubVariationForm}
        onHide={onHideSubVariationForm}
        getVariations={getVariations}
      />
      <FormPageLayout backText="Catalogs" pageLoading={pageLoading} hideCancel>
        <CustomCard title="All Variations">
          <div className="c-col-12 flex justify-content-end">
            <PrimaryButton
              label="Add Variation"
              icon="pi pi-plus"
              onClick={onShowVariationForm}
            />
          </div>

          {variations.map((item) => (
            <CustomAccordion title={customHeader(item)} isActive={true}>
              <CustomSimpleTable
                data={item?.subVariations || []}
                columns={[
                  { header: "Title", field: "title" },
                  { header: "UPC", field: "upc" },
                  { header: "SKU", field: "sku" },
                  { header: "Wholesale Cost", field: "wholesaleCost" },
                  { header: "Price", field: "price" },
                  { header: "Markup", field: "markupPrice" },
                  { header: "Min. Quantity", field: "minimumQuantity" },
                  { header: "Default Quantity", field: "defaultQuantity" },
                  { header: "Max. Quantity", field: "maximumQuantity" },
                  {
                    header: "Includes Tax",
                    field: "includesTax",
                    isBoolean: true,
                  },
                ]}
                onEdit={(item) => {
                  onEditSubVariation(item);
                }}
                onDelete={(item) => {
                  onDeleteSubVariation(item);
                }}
                reorderableRows
                onRowReorder={onRowReorder}
              />
            </CustomAccordion>
          ))}
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
export default React.memo(Variation);
