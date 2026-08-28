import { useEffect } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCatalogCategory,
  getCatalogCategories,
} from "../../../../store/settings/inventory/catalogCategoryActions";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function CatalogCategory() {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.settings.inventory.catalogCategories
  );

  useEffect(() => {
    dispatch(getCatalogCategories());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteCatalogCategory);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "posButtonLabel" },
    { field: "description" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`catalog-category/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Catalog Category"
        linkTo="catalog-category"
        searchable={["title"]}
        tableData={data}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      {DependencyDialog}
    </>
  );
}
