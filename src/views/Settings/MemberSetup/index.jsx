import CustomTabView from "@shared/tabView/CustomTabView";
import CampaignGroup from "./CampaignGroup";
import AccessedSchedule from "./AccessedSchedule";
import ResourceType from "./ResourceType";
import Campaigns from "./Campaigns";
import MemberShipType from "./MemberShipType";
import Resource from "./Resource";

export default function MemberSetup() {
  const tabs = [
    { title: "Manage Membership", content: <MemberShipType /> },
    { title: "Campaigns Group", content: <CampaignGroup /> },
    { title: "Campaigns", content: <Campaigns /> },
    { title: "Access Schedule", content: <AccessedSchedule /> },
    { title: "Resource Type", content: <ResourceType /> },
    { title: "Resource", content: <Resource /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
