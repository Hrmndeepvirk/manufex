import { lazy } from "react";
const CatalogForm = lazy(() =>
  import("@views/Settings/InventorySetup/Catalog/CatalogForm")
);
const ProfitCenterForm = lazy(() =>
  import("@views/Settings/InventorySetup/ProfitCenter/ProfitCenterForm")
);
const CatalogCategoryForm = lazy(() =>
  import("@views/Settings/InventorySetup/CatalogCategory/CatalogCategoryForm")
);
const VendorForm = lazy(() =>
  import("@views/Settings/InventorySetup/Vendor/VendorForm")
);
const CommissionGroupForm = lazy(() =>
  import("@views/Settings/InventorySetup/CommissionGroup/CommissionGroupForm")
);
const ReferralGroupForm = lazy(() =>
  import("@views/Settings/InventorySetup/ReferralGroup/ReferralGroupForm")
);
const CatalogSubCategoryForm= lazy(() =>
import("@views/Settings/InventorySetup/CatalogCategory/CatalogSubCategoryForm") );

const CatalogSubCategoryGroupForm= lazy(() =>
import("@views/Settings/InventorySetup/CatalogCategory/CatalogSubCategoryGroupForm") );
const InventoryRoutes = [
  {
    name: "Add Catalog Item",
    component: CatalogForm,
    path: "/catalog-item/:id?",
    exact: true,
  },
  {
    name: "Add Profit Center",
    component: ProfitCenterForm,
    path: "/profit-center/:id?",
    exact: true,
  },
  {
    name: "Add Catalog Category",
    component: CatalogCategoryForm,
    path: "/catalog-category/:id?",
    exact: true,
  },
{ name: "Add Sub Catalog Category", component: CatalogSubCategoryForm, path: "/catalog-category/:categoryId/catalog-sub-category/:id?", exact: true, },

{
  name: "Add Sub Catalog Category Group",
  component: CatalogSubCategoryGroupForm,
  path: "/catalog-category/:categoryId/catalog-sub-category/:subCategoryId/catalog-sub-category-group/:id?",
  exact: true,
},


  {
    name: "Add Vendor",
    component: VendorForm,
    path: "/vendor/:id?",
    exact: true,
  },
  {
    name: "Add Commission Group",
    component: CommissionGroupForm,
    path: "/commission-group/:id?",
    exact: true,
  },
  {
    name: "Add Referral Group",
    component: ReferralGroupForm,
    path: "/referral-group/:id?",
    exact: true,
  },
];
export default InventoryRoutes;
