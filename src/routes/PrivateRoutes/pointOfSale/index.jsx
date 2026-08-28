import { lazy } from "react";

const Receipts = lazy(() =>
  import("@views/PointOfSale/receipts/Receipts")
);
const Receipt = lazy(() =>
  import("@views/PointOfSale/receipts/Receipt")
);

const Drawer = lazy(() =>
  import("@views/PointOfSale/drawer/Drawer")
);
const PointOfSaleRoutes = [
  {
    path: "/receipts",
    name: " Receipts",
    exact: true,
    component: Receipts,
  },
  {
    path:"/receipts/:id",
    name: "Receipt",
    exact: true,
    component: Receipt,
  },
  {
    path:"/drawer",
    name:"Drawer",
    exact:true,
    component:Drawer,
  }
];
export default PointOfSaleRoutes;
