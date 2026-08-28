import { lazy } from "react";

const SellPlan = lazy(() => import("@views/Plans/MembershipPlans/SellPlan"));
const SubscriptionPlanAgreement = lazy(
  () =>
    import("@views/Plans/MembershipPlans/SellPlan/SubscriptionPlanAgreement"),
);

const PlanRoutes = [
  {
    path: "/sell-plans/:id",
    name: "Sell Plan",
    exact: true,
    component: SellPlan,
  },
  {
    path: "/agreement/:id",
    name: "Agreement Plan",
    exact: true,
    component: SubscriptionPlanAgreement,
  },
];

export default PlanRoutes;
