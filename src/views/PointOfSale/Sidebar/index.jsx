import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPosCategories } from "../../../store/pointOfSale/pointOfSaleActions";
import { usePos } from "../PosContext";
import CustomAutoComplete from "../../../shared/inputs/CustomAutoComplete";
import { useLocation } from "react-router-dom";
import CustomSidebar2 from "../../../shared/sidebar/CustomSidebar2";

const TOP_SELLING_SECTION = "TOP_SELLING";

function Sidebar() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.pos.categories);
  const [loading, setLoading] = useState(false);
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,

    selectedSubCategoryGroup,
    setSelectedSubCategoryGroup,
    onSelectProduct,
    selectedItems,
    onCartItemQtyChange,
    setCartItemRequiredQuantity,
  } = usePos();

  const selectedItemsRef = useRef(selectedItems);
  useEffect(() => {
    selectedItemsRef.current = selectedItems;
  }, [selectedItems]);
  useEffect(() => {
    dispatch(getPosCategories(setLoading));
  }, []);

  const catalogItems = useSelector((state) => state.pos.catalogItems);

  const options = useMemo(() => {
    let arr = [];
    catalogItems.forEach((item) => {
      if (item.variations?.length) {
        item.variations.forEach((variation) => {
          variation.catalogItems.forEach((subVariationItem) => {
            arr.push({
              ...subVariationItem,
              name: `${item.title} - ${subVariationItem.title} ${
                subVariationItem.upc ? `(${subVariationItem.upc})` : ""
              }`,
            });
          });
        });
      }
      arr.push({
        ...item,
        name: `${item.title} ${item.upc ? `(${item.upc})` : ""}`,
      });
    });

    return arr;
  }, [catalogItems]);

  const onSelectCatalogItem = ({ value }) => {
    let item = options.find((ci) => ci._id === value);
    if (item) {
      onSelectProduct(item);
    }
  };

  const { state } = useLocation();
  const processedStateRef = useRef(null);

  useEffect(() => {
    if (!state?.catalogItems?.length || catalogItems.length === 0) return;
    if (processedStateRef.current === state) return;
    processedStateRef.current = state;
    state.catalogItems.forEach((entry) => {
      const itemId = typeof entry === "string" ? entry : entry?._id;
      const wantedQty = typeof entry === "object" ? entry?.quantity : null;
      const item = options.find((ci) => ci._id === itemId);
      if (!item) return;
      onSelectProduct(item);
      if (wantedQty) {
        setTimeout(() => {
          const idx = selectedItemsRef.current.findIndex(
            (c) => c._id === itemId,
          );
          if (idx >= 0) {
            onCartItemQtyChange(idx, wantedQty);
            setCartItemRequiredQuantity(idx, wantedQty);
          }
        }, 100);
      }
    });
  }, [state, options]);

  const onSidebarSelect = (obj) => {
    if (obj?.["3"]) {
      if (obj.categoryId) setSelectedCategory(obj.categoryId);
      if (obj.subCategoryId) setSelectedSubCategory(obj.subCategoryId);
      setSelectedSubCategoryGroup(obj?.["3"]);
      return;
    }

    if (obj?.["2"]) {
      if (obj.categoryId) setSelectedCategory(obj.categoryId);
      setSelectedSubCategory(obj?.["2"]);
      setSelectedSubCategoryGroup(0);
      return;
    }
    if (obj?.["1"]) {
      setSelectedCategory(obj?.["1"]);
      setSelectedSubCategory(0);
      setSelectedSubCategoryGroup(0);
      return;
    }
    setSelectedCategory(null);
  };

  let _categories = useMemo(() => {
    return [
      {
        _id: null,
        icon: "bi bi-grid",
        title: "All Items",
        posButtonLabel: "Most Recent",
      },
      {
        _id: TOP_SELLING_SECTION,
        icon: "bi bi-fire",
        title: "Top Selling",
        posButtonLabel: "Top Selling",
      },
      ...categories.map((category) => ({
        _id: category._id,
        icon: category.icon,
        title: category.title,
        posButtonLabel: category.posButtonLabel,

        // subcategory-mappings
        items: (category.subCategories || []).map((sub) => ({
          _id: sub._id,
          icon: sub.icon,
          title: sub.title,
          posButtonLabel: sub.posButtonLabel,
          categoryId: category._id,

          // subcategory-group-mappings
          items: (sub.subCategoriesGroup || []).map((group) => ({
            _id: group._id,
            icon: group.icon,
            title: group.title,
            posButtonLabel: group.posButtonLabel,
            categoryId: category._id,
            subCategoryId: sub._id,
          })),
        })),
      })),
    ];
  }, [categories]);

  return (
    <div className="h-full gap-2 flex flex-column w-full">
      <CustomAutoComplete
        name="catalog"
        placeholder="Search by item"
        options={options}
        optionLabel="name"
        onChange={onSelectCatalogItem}
        hideLabel
        dropdown
        autoClear
      />
      <CustomSidebar2
        title="Categories"
        loading={loading}
        selected={[
          selectedCategory,
          selectedSubCategory,
          selectedSubCategoryGroup,
        ]}
        options={_categories}
        onSelect={onSidebarSelect}
        valueField="posButtonLabel"
      />
    </div>
  );
}

export default React.memo(Sidebar);
