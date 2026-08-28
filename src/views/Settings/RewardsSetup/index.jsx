import CustomTabView from "@shared/tabView/CustomTabView";
import RewardSettingsView from "./Settings/RewardSettingsView";
import PointsEarningRules from "./EarningRule";
import RewardsCatalog from "./RewardCatalog";

export default function RewardsSetup() {
  const tabs = [
    { title: "Reward Settings", content: <RewardSettingsView /> },
    { title: "Earning Rules", content: <PointsEarningRules /> },
    {
      title: "Reward Catalog",
      content: <RewardsCatalog />,
    },
  ];
  return <CustomTabView tabs={tabs} />;
}
