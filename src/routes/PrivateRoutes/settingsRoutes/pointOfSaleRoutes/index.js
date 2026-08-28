import { lazy } from "react";

const TaxForm = lazy(() => import("@views/Settings/PointOfSale/Tax/TaxForm"));
const PaymentMethodForm = lazy(() =>
  import("@views/Settings/PointOfSale/PaymentMethod/PaymentMethodForm")
);
const RegisterForm = lazy(() =>
  import("@views/Settings/PointOfSale/Register/RegisterForm")
);

const DiscountForm = lazy(() =>
  import("@views/Settings/PointOfSale/Discount/DiscountForm")
);

const PointOfSaleRoutes = [
  {
    name: "Add Tax",
    component: TaxForm,
    path: "/tax/:id?",
    exact: true,
  },
  {
    name: "Add Payment Method",
    component: PaymentMethodForm,
    path: "/payment-method/:id?",
    exact: true,
  },
  {
    name: "Add Register",
    component: RegisterForm,
    path: "/register/:id?",
    exact: true,
  },
  {
    name: "Add Discount",
    component: DiscountForm,
    path: "/discount/:id?",
    exact: true,
  },
];
export default PointOfSaleRoutes;
