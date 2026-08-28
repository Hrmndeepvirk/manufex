import { lazy } from "react";

const FastAddMember = lazy(() => import("@views/Members/FastAddMember"));
const MemberForm = lazy(() => import("@views/Members/MemberForm"));

const MembersRoutes = [
  {
    path: "/fast-add-member",
    name: "Fast Add Member",
    exact: true,
    component: FastAddMember,
  },
  {
    path: "/:id",
    name: "Member Form",
    exact: true,
    component: MemberForm,
  },
];
export default MembersRoutes;
