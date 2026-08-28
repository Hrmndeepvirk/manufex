import CustomTabView from "@shared/tabView/CustomTabView";
import Bonus from "./Bonus";
import ItemCommission from "./ItemCommission";
import SalesCode from "./SalesCode";

export default function SalesCommission({ employee }) {
  const tabs = [
    {
      title: "Item Commission",
      content: <ItemCommission employee={employee} />,
    },
    { title: "Bonus", content: <Bonus employee={employee} /> },
    { title: "Sales Code", content: <SalesCode employee={employee} /> },
  ];
  return <CustomTabView tabs={tabs} noPadding />;
}
