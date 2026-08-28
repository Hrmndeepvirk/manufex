import CustomTabView from "@shared/tabView/CustomTabView";
import AgreementCategory from "./AgreementCategories";
import AgreementTemplate from "./AgreementTemplate";
import AgreementPromotion from "./AgreementPromotion";
import AccessedFee from "./AccessedFee";
import AgreementPlan from "./AgreementPlan";
import GroupPlan from "./GroupPlan";

export default function AgreementSetup() {
  const tabs = [
    { title: "Assessed Fee", content: <AccessedFee /> },
    { title: "Agreement Template", content: <AgreementTemplate /> },
    { title: "Agreement Plan", content: <AgreementPlan /> },
    { title: "Group Plan", content: <GroupPlan /> },
    {
      title: "Agreement Categories",
      content: <AgreementCategory />,
    },
    {
      title: "Agreement Promotion",
      content: <AgreementPromotion />,
    },
  ];
  return <CustomTabView tabs={tabs} />;
}
