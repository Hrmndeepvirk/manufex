import { lazy } from "react";
import RewardCatalogForm from "../../../../views/Settings/RewardsSetup/RewardCatalog/RewardCatalogForm";

const RewardSettingsForm = lazy(() =>
  import("@views/Settings/RewardsSetup/Settings/RewardSettingsForm")
);

const PointsEarningRuleForm = lazy(() =>
  import("@views/Settings/RewardsSetup/EarningRule/PointsEarningRuleForm")
);

const RewardsRoutes = [
  {
    name: "Rewards Settings",
    component: RewardSettingsForm,
    path: "/settings",
    exact: true,
  },
  {
    name: "Points Earning Rule Form",
    component: PointsEarningRuleForm,
    path: "/points-earning-rule/:id?",
    exact: true,
  },
  {
    name: "Reward Catalog Form",
    component: RewardCatalogForm,
    path: "/reward-catalog/:id?",
    exact: true,
  },
];
export default RewardsRoutes;
