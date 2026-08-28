import React, { useEffect, useMemo, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import CustomCard from "../../../shared/cards/CustomCard";
import CatalogItem from "./CatalogItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getCatalogItems,
  getTopSellingCatalogItems,
} from "../../../store/pointOfSale/pointOfSaleActions";
import { usePos } from "../PosContext";
import FiltersDialog from "./FiltersDialog";

const TOP_SELLING_SECTION = "TOP_SELLING";

function CatalogItems() {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategoryGroup,
    tags,
    filterSets,
  } = usePos();
  const catalogItems = useSelector((state) => state.pos.catalogItems);
  const topSellingCatalogItems = useSelector(
    (state) => state.pos.topSellingCatalogItems,
  );
  const [loading, setLoading] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);

  useEffect(() => {
    dispatch(getCatalogItems(setLoading));
    dispatch(getTopSellingCatalogItems());
  }, []);

  const _catalogItems = useMemo(() => {
    let items = [...catalogItems];

    const isTopSellingSection = selectedCategory === TOP_SELLING_SECTION;

    if (isTopSellingSection) {
      const ranking = new Map(
        topSellingCatalogItems.map((itemId, index) => [String(itemId), index]),
      );

      items = items
        .filter((item) => ranking.has(String(item._id)))
        .sort((a, b) => ranking.get(String(a._id)) - ranking.get(String(b._id)));
    } else if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }
    if (selectedSubCategory) {
      items = items.filter((item) => item.subCategory === selectedSubCategory);
    }
    if (selectedSubCategoryGroup) {
      items = items.filter(
        (item) => item.subCategoryGroup === selectedSubCategoryGroup,
      );
    }

    if (filterSets?.length > 0) {
      items = items.filter((item) =>
        filterSets.every((filterId) => item.filterSets?.includes(filterId)),
      );
    }

    if (tags?.length > 0) {
      items = items.filter((item) =>
        tags.some((tagId) => item.tags?.includes(tagId)),
      );
    }

    return items;
  }, [
    catalogItems,
    selectedCategory,
    filterSets,
    tags,
    selectedSubCategory,
    selectedSubCategoryGroup,
    topSellingCatalogItems,
  ]);

  const onHideFilterDialog = () => {
    setFilterDialog(false);
  };

  return (
    <>
      <FiltersDialog visible={filterDialog} onHide={onHideFilterDialog} />
      <CustomCard
        title="Catalog Items"
        height="100%"
        empty={_catalogItems.length === 0 && !loading}
        onFilter={() => setFilterDialog(true)}
        actions
      >
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {_catalogItems.map((item, i) => (
              <CatalogItem index={i} key={item.id} item={item} />
            ))}
          </>
        )}
      </CustomCard>
    </>
  );
}

export default React.memo(CatalogItems);

function LoadingSkeleton() {
  return (
    <>
      <div className="c-col-3">
        <div className="product-card">
          <Skeleton height="10rem"></Skeleton>
          <Skeleton className="mt-2" height="4rem"></Skeleton>
        </div>
      </div>
      <div className="c-col-3">
        <div className="product-card">
          <Skeleton height="10rem"></Skeleton>
          <Skeleton className="mt-2" height="4rem"></Skeleton>
        </div>
      </div>
      <div className="c-col-3">
        <div className="product-card">
          <Skeleton height="10rem"></Skeleton>
          <Skeleton className="mt-2" height="4rem"></Skeleton>
        </div>
      </div>
      <div className="c-col-3">
        <div className="product-card">
          <Skeleton height="10rem"></Skeleton>
          <Skeleton className="mt-2" height="4rem"></Skeleton>
        </div>
      </div>
      <div className="c-col-3">
        <div className="product-card">
          <Skeleton height="10rem"></Skeleton>
          <Skeleton className="mt-2" height="4rem"></Skeleton>
        </div>
      </div>
    </>
  );
}
