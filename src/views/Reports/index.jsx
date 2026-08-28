import CustomTabView from "@shared/tabView/CustomTabView";
import ManageReports from "./ManageReports";
import QueuedReports from "./QueuedReports";

export default function Reports() {
  const tabs = [
    { title: "Manage Reports", content: <ManageReports /> },
    { title: "Queued Reports", content: <QueuedReports /> },
  ];

  return <CustomTabView tabs={tabs} />;
}
