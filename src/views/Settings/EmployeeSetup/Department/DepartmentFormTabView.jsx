import CustomTabView from "@shared/tabView/CustomTabView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { spaceToDash } from "@utils/common";
import { getDepartment } from "@store/settings/employeeSetup/departmentActions";
import DepartmentForm from "./DepartmentForm";
import ShiftCalendar from "./ShiftCalendar";

export default function DepartmentFormTabView() {
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

  const refetchDepartment = () => {
    if (id) {
      dispatch(
        getDepartment(id, setPageLoading, (res) => {
          setData(res);
        }),
      );
    }
  };

  useEffect(() => {
    refetchDepartment();
  }, [id, dispatch]);

  const tabs = [
    {
      title: "General",
      content: (
        <DepartmentForm
          department={data}
          pageLoading={pageLoading}
          onSaveSuccess={(newId) => {
            if (!id && newId) {
              navigate(
                `/settings/employee-setup/department/${newId}?tab=shift-settings`,
                { replace: true },
              );
              setEnabledUpto(1);
            } else {
              setEnabledUpto((prev) => Math.max(prev, 1));
              goToTab("shift-settings");
            }
            refetchDepartment();
          }}
        />
      ),
    },
    {
      title: "Shift Settings",
      content: <>{id && <ShiftCalendar loading={pageLoading} />}</>,
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
