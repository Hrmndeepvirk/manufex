import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCatalogs } from "@store/settings/inventory/catalogActions";
import {
  copyCatalogItem,
  deleteCatalog,
} from "@store/settings/inventory/catalogActions";
import { getCatalogSubCategories } from "@store/settings/inventory/catalogSubCategoryActions";
import { clearCatalogSubCategories } from "@store/settings/inventory/inventorySlice";
import CustomTable from "@shared/table/CustomTable";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { FilterBar } from "@filters";
import { formatEnum } from "@utils/common";
import { getDateTime } from "@utils/dateTime";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

const booleanOptions = [
  { _id: true, title: "Yes" },
  { _id: false, title: "No" },
];

export default function Catalog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteCatalog);
  const [filteredData, setFilteredData] = useState([]);
  const prevCategoryRef = useRef(null);

  const data = useSelector((state) => state.settings.inventory.catalogItems);
  const catalogSubCategories = useSelector(
    (state) => state.settings.inventory.catalogSubCategories,
  );

  useEffect(() => {
    dispatch(getCatalogs(setLoading));
  }, [dispatch]);

  const handleFilterValuesChange = useCallback(
    (filterValues) => {
      const selectedCategory = filterValues?.category;
      if (selectedCategory !== prevCategoryRef.current) {
        prevCategoryRef.current = selectedCategory;
        if (selectedCategory) {
          dispatch(getCatalogSubCategories(selectedCategory));
        } else {
          dispatch(clearCatalogSubCategories());
        }
      }
    },
    [dispatch],
  );

  const quickFilters = [
    { column: "title", header: "Title", type: "text", col: 4 },
    {
      column: "type",
      header: "Type",
      type: "dropdown",
      options: [
        { _id: "PRODUCT", title: "Product" },
        { _id: "SERVICE", title: "Service" },
        { _id: "PRE_PAY", title: "Pre Pay" },
      ],
      col: 4,
    },
    {
      column: "isActive",
      header: "Active",
      type: "dropdown",
      options: booleanOptions,
      col: 4,
    },
  ];

  const advancedFilters = [
    
    { column: "description", header: "Description", type: "text", col: 3 },
    { column: "upc", header: "UPC", type: "text", col: 3 },
    { column: "sku", header: "SKU", type: "text", col: 3 },
    {
      column: "itemSold",
      header: "Item Sold",
      type: "dropdown",
      options: [
        { _id: "POS", title: "POS Only" },
        { _id: "AGREEMENTS", title: "Agreement Only" },
        { _id: "POS_AGREEMENTS", title: "POS & Agreement" },
        { _id: "NON_SALE_ITEM", title: "Non-Sale Item" },
      ],
      col: 3,
    },
    {
      column: "profitCenter",
      header: "Profit Center",
      type: "dropdown",
      optionsType: "profitCenters",
      col: 3,
    },
    {
      column: "isRecurring",
      header: "Recurring",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "isOneTimePurchaseable",
      header: "One Time Item",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "isRedeemableAtLaterDate",
      header: "Can Be Rendered Later",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "isSoldOnline",
      header: "Sold Online",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "canPayUsingPoints",
      header: "Paid With Points",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "category",
      header: "Category",
      type: "dropdown",
      optionsType: "catalogCategories",
      col: 3,
    },
    {
      column: "subCategory",
      header: "Sub Category",
      type: "dropdown",
      options: catalogSubCategories || [],
      col: 3,
    },
    {
      column: "filterSets",
      header: "Filters",
      type: "multiselect",
      optionsType: "filterSets",
      col: 3,
    },
    {
      column: "tags",
      header: "Tags",
      type: "multiselect",
      optionsType: "tags",
      col: 3,
    },
    {
      column: "includesTax",
      header: "Taxed",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "allowDiscount",
      header: "Allow Discount",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "isStockable",
      header: "Stockable",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "allowUnlimited",
      header: "Unlimited",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "hasVariations",
      header: "Has Variations",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "memberRequired",
      header: "Requires Member",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
    {
      column: "requireCommission",
      header: "Require Commission",
      type: "dropdown",
      options: booleanOptions,
      col: 3,
    },
  ];

  const onEdit = (rowData) => {
    navigate(`catalog-item/${rowData._id}`);
  };

  const onCopy = (rowData) => {
    dispatch(copyCatalogItem(rowData._id, setCopyLoading, () => {}));
  };

  const columns = [
    { field: "title", sortable: true },
    {
      field: "type",
      body: (rowData) => formatEnum(rowData.type),
      sortable: true,
    },
    { field: "description" },
    {
      field: "isActive",
      header: "Active",
      body: (rowData) => (rowData.isActive ? "Yes" : "No"),
    },
    {
      field: "createdAt",
      header: "Created At",
      body: (rowData) => getDateTime(rowData.createdAt),
    },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => (
        <div className="flex gap-2">
          <i
            className="pi pi-clone cursor-pointer"
            title="Duplicate"
            onClick={() => onCopy(rowData)}
          />
          <i
            className="pi pi-pencil cursor-pointer"
            title="Edit"
            onClick={() => onEdit(rowData)}
          />
          <i
            className="pi pi-trash cursor-pointer"
            title="Delete"
            onClick={() =>
              customConfirmDialog({
                message: "Do you want to delete this item?",
                accept: () => onDelete(rowData._id),
              })
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-2">
      <FilterBar
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        data={data || []}
        onFilter={setFilteredData}
        onFilterValuesChange={handleFilterValuesChange}
      >
        <PrimaryButton
          label="Add Catalog"
          icon="pi pi-plus"
          onClick={() => navigate("catalog-item")}
        />
      </FilterBar>
      <CustomTable data={filteredData} columns={columns} loading={loading} />
      {DependencyDialog}
    </div>
  );
  
}
