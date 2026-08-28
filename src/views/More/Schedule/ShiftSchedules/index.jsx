import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomTabView from "@shared/tabView/CustomTabView";
import ShiftsTab from "./ShiftsTab";
import CoverRequestsTab from "./CoverRequestsTab";

export default function ShiftSchedules() {
  const tabs = [
    { title: "Shifts", content: <ShiftsTab /> },
    { title: "Cover Requests", content: <CoverRequestsTab /> },
  ];

  return (
    <FormPageLayout backText="Schedule" hideCancel>
      <div className="c-col-12">
        <CustomTabView name="tab" tabs={tabs} noPadding />
      </div>
    </FormPageLayout>
  );
}
