import CustomTabView from "@shared/tabView/CustomTabView";
import Pay from "./Pay";
import SubstituteOptions from "./SubstituteOptions";

export default function ClassSetup({ employee, refetchEmployee }) {
  const tabs = [
    { title: "Pay", content: <Pay employee={employee} refetchEmployee={refetchEmployee} /> },
    {
      title: "Substitute Option",
      content: <SubstituteOptions employee={employee} />,
    },
  ];
  return <CustomTabView tabs={tabs} noPadding />;
}
