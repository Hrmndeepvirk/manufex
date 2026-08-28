import React from "react";
import CustomTabView from "@shared/tabView/CustomTabView";
import MembershipPlans from "./MembershipPlans";
import Drafts from "./Drafts";

function Plans() {
  const tabs = [
    { title: "Membership Plans", content: <MembershipPlans /> },
    { title: "Draft", content: <Drafts /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
export default React.memo(Plans);
