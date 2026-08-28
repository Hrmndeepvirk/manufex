import CustomTabView from "@shared/tabView/CustomTabView";
import FormPageLayout from "@shared/layout/FormPageLayout";
import Security from "./Security";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getEmployee } from "@store/settings/employeeSetup/employeeActions";
import Clubs from "./Clubs";
import General from "./General";
import Notes from "./Notes";
import Certifications from "./Certifications";
import EmployeeDepartment from "./EmployeeDepartment";
import ClassSetup from "./ClassSetup";
import AppointmentSetup from "./AppointmentSetup";
import SalesCommission from "./SalesCommission";
import EmployeeTimeSheets from "./Timesheets";
import { spaceToDash } from "@utils/common";

export default function EmployeeSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [enabledUpto, setEnabledUpto] = useState(0);

  const { id } = useParams();

  const goToTab = (title) => {
    setSearchParams({ tab: spaceToDash(title) }, { replace: true });
  };

  const refetchEmployee = () => {
    if (id) {
      dispatch(
        getEmployee(id, setLoading, (data) => {
          setData(data);
        })
      );
    }
  };

  useEffect(() => {
    refetchEmployee();
  }, [id, dispatch]);

  const tabs = [
    {
      title: "Security",
      content: (
        <Security
          employee={data}
          onSaveSuccess={(newId) => {
            if (!id && newId) {
              navigate(
                `/settings/employee-setup/employee/${newId}?tab=general`,
                {
                  replace: true,
                }
              );
              setEnabledUpto(1); 
            } else {
              setEnabledUpto((prev) => Math.max(prev, 1));
              goToTab("general");
            }
            refetchEmployee();
          }}
        />
      ),
    },
    {
      title: "General",
      content: (
        <General
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 2));
            goToTab("clubs");
            refetchEmployee();
          }}
        />
      ),
    },
    {
      title: "Clubs",
      content: (
        <Clubs
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 3));
            goToTab("departments");
            refetchEmployee();
          }}
        />
      ),
    },
    { 
      title: "Departments", 
      content: (
        <EmployeeDepartment 
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 4));
            goToTab("classes-setup");
            refetchEmployee();
          }}
        />
      )
    },
    {
      title: "Classes Setup",
      content: (
        <ClassSetup 
          employee={data} 
          refetchEmployee={refetchEmployee}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 5));
            goToTab("appointment-setup");
            refetchEmployee();
          }}
        />
      ),
    },
    {
      title: "Appointment Setup",
      content: (
        <AppointmentSetup 
          employee={data} 
          refetchEmployee={refetchEmployee}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 6));
            goToTab("sales-commission");
            refetchEmployee();
          }}
        />
      ),
    },
    { 
      title: "Sales Commission", 
      content: (
        <SalesCommission 
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 7));
            goToTab("timesheets");
            refetchEmployee();
          }}
        />
      )
    },
    { 
      title: "Timesheets", 
      content: (
        <EmployeeTimeSheets 
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 8));
            goToTab("notes");
            refetchEmployee();
          }}
        />
      )
    },
    { 
      title: "Notes", 
      content: (
        <Notes 
          employee={data}
          onSaveSuccess={() => {
            setEnabledUpto((prev) => Math.max(prev, 9));
            goToTab("certifications");
            refetchEmployee();
          }}
        />
      )
    },
    {
      title: "Certifications",
      content: <Certifications employee={data} />,
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
