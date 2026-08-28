import { lazy } from "react";

const SavedCarts = lazy(() => import("@views/More/POS/SavedCarts"));

const posRoutes = [
  {
    path: "/saved-carts",
    name: "Saved Carts",
    exact: true,
    component: SavedCarts,
  },
];

export default posRoutes;
