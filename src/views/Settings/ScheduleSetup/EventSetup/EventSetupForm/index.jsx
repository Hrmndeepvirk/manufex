import CustomTabView from "@shared/tabView/CustomTabView";
import General from "./General";
import Notifications from "./Notifications";
import Online from "./Online";
import DisplayOptions from "./DisplayOptions";
import Services from "./Services";
import { useState } from "react";
import { spaceToDash } from "@utils/common";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function EventSetupForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [enabledUpto, setEnabledUpto] = useState(0);

  const goToTab = (title) => {
    setSearchParams({ tab: spaceToDash(title) }, { replace: true });
  };

  const tabs = [
    {
      title: "General",
      content: (
        <General
          onSaveSuccess={(newId) => {
            if (!id && newId) {
              navigate(`${newId}?tab=services`, {
                replace: true,
              });
            } else {
              goToTab("services");
            }
          }}
        />
      ),
    },
    {
      title: "Services",
      content: <Services />,
    },
    {
      title: "Display Options",
      content: <DisplayOptions onSaveSuccess={() => goToTab("online")} />,
    },
    {
      title: "Online",
      content: <Online onSaveSuccess={() => goToTab("notifications")} />,
    },
    { title: "Notifications", content: <Notifications /> },
  ];

  const disabledTabIndices = !id
    ? tabs.map((_, i) => i).filter((i) => i > enabledUpto)
    : [];

  return (
    <>
      <CustomTabView
        tabs={tabs}
        noPadding     
        disabledTabIndices={disabledTabIndices}
      />
    </>
  );
}
