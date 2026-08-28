import CustomTabView from "@shared/tabView/CustomTabView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { spaceToDash } from "@utils/common";
import { getAccessedSchedule } from "@store/settings/memberSetup/accessedScheduleActions";
import AccessedScheduleForm from "./AccessedScheduleForm";
import AccessSchedulesTab from "./AccessSchedulesTab";

export default function AccessedScheduleFormTabView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState(null);
  const [enabledUpto, setEnabledUpto] = useState(0);

  const { id } = useParams();

  const goToTab = (title) => {
    setSearchParams({ tab: spaceToDash(title) }, { replace: true });
  };

  const refetchSchedule = () => {
    if (id) {
      dispatch(
        getAccessedSchedule(id, setPageLoading, (res) => {
          setData(res);
        }),
      );
    }
  };

  useEffect(() => {
    refetchSchedule();
  }, [id, dispatch]);

  const tabs = [
    {
      title: "General",
      content: (
        <AccessedScheduleForm
          schedule={data}
          pageLoading={pageLoading}
          onSaveSuccess={(newId) => {
            if (!id && newId) {
              navigate(
                `/settings/member-setup/access-schedule/${newId}?tab=access-schedules`,
                { replace: true },
              );
              setEnabledUpto(1);
            } else {
              setEnabledUpto((prev) => Math.max(prev, 1));
              goToTab("Access Schedules");
            }
            refetchSchedule();
          }}
        />
      ),
    },
    {
      title: "Access Schedules",
      content: (
        <>
          {id && <AccessSchedulesTab data={data} pageLoading={pageLoading} />}
        </>
      ),
    },
  ];

  const disabledTabIndices = !id
    ? tabs.map((_, i) => i).filter((i) => i > enabledUpto)
    : [];

  return (
    <CustomTabView
      tabs={tabs}
      noPadding
      disabledTabIndices={disabledTabIndices}
    />
  );
}
