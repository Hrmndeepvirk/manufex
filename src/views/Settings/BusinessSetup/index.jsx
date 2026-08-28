import CustomTabView from "@shared/tabView/CustomTabView";
import ReasonCodes from "./ReasonCode/ReasonCodes";
import Clubs from "./Clubs/Clubs";
import CompanyView from "./Company/CompanyView";
import Default from "./Default";
import CustomizationView from "./Customization/CustomizationView";
import IposTerminals from "./IposTerminal/IposTerminals";
import { useServerTime } from "../../../hooks/useServerTime";

export default function BusinessSetup() {
  let { getServerDate } = useServerTime();

  console.log(getServerDate());

  const tabs = [
    { title: "Company", content: <CompanyView /> },
    { title: "Reason Code", content: <ReasonCodes /> },
    { title: "Customization", content: <CustomizationView /> },
    { title: "Clubs", content: <Clubs /> },
    { title: "Default", content: <Default /> },
    { title: "Terminals", content: <IposTerminals /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
