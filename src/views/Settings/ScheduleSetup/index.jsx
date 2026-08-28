import CustomTabView from "@shared/tabView/CustomTabView";
import EventSetup from "./EventSetup";
import Level from "./Level";
import LocationType from "./LocationType";
import Location from "./Location";
import EventCategory from "./EventCategory";
import SchedulingOptions from "./SchedulingOptions";
import Class from "./Class";

export default function ScheduleSetup() {
  const tabs = [
    { title: "Level", content: <Level /> },
    { title: "Location Type", content: <LocationType /> },
    { title: "Location", content: <Location /> },
    { title: "Event Setup", content: <EventSetup /> },
    { title: "Event Categories", content: <EventCategory /> },
    { title: "Class", content: <Class /> },
    { title: "Scheduling Options", content: <SchedulingOptions /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
