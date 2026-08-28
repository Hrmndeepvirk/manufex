import CustomTabView from "@shared/tabView/CustomTabView";
import Pay from "./Pay";
import Bonus from "./Bonus";

export default function AppointmentSetup({ employee, refetchEmployee }) {
  const tabs = [
    { title: "Pay", content: <Pay employee={employee} refetchEmployee={refetchEmployee} /> },
    {
      title: "Bonus",
      content: <Bonus employee={employee} />,
    },
  ];
  return <CustomTabView tabs={tabs} noPadding />;
}
