import { lazy } from "react";
const AccessedScheduleFormTabView = lazy(
  () =>
    import("@views/Settings/MemberSetup/AccessedSchedule/AccessedScheduleFormTabView"),
);
const ResourceTypeForm = lazy(
  () => import("@views/Settings/MemberSetup/ResourceType/ResourceTypeForm"),
);

const CampaignGroupForm = lazy(
  () => import("@views/Settings/MemberSetup/CampaignGroup/CampaignGroupForm"),
);

const CampaignForm = lazy(
  () => import("@views/Settings/MemberSetup/Campaigns/CampaignForm"),
);

const MemberShipTypeForm = lazy(
  () => import("@views/Settings/MemberSetup/MemberShipType/MemberShipTypeForm"),
);
const ResourceForm = lazy(
  () => import("@views/Settings/MemberSetup/Resource/ResourceForm"),
);

const MemberRoutes = [
  // this form needs to be upadated
  {
    name: "Add Accessed Schedule",
    component: AccessedScheduleFormTabView,
    path: "/access-schedule/:id?",
    exact: true,
  },
  {
    name: "Add Resource Type",
    component: ResourceTypeForm,
    path: "/resource-type/:id?",
    exact: true,
  },
  {
    name: "Add Campaign Group",
    component: CampaignGroupForm,
    path: "/campaign-group/:id?",
    exact: true,
  },
  {
    name: "Add Campaign",
    component: CampaignForm,
    path: "/campaign/:id?",
    exact: true,
  },
  {
    name: "Add Membership Type",
    component: MemberShipTypeForm,
    path: "/manage-membership/:id?",
    exact: true,
  },
  {
    name: "Add Resource",
    component: ResourceForm,
    path: "/resource/:id?",
    exact: true,
  },
];
export default MemberRoutes;
