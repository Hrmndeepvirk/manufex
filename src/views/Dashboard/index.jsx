import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../store/dashboard/dashboardActions";
import DashboardGraphs from "./DashboardGraphs";

const DashboardWidgets = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dashboardStats = useSelector((state) => state.dashboard.stats);

  useEffect(() => {
    dispatch(getDashboardStats(setLoading));
  }, [dispatch]);

  const cards = [
    {
      title: "Total Members",
      value: loading ? "..." : dashboardStats.totalMembers?.toLocaleString() || "0",
      icon: "pi pi-users",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100 text-green-600",
    },
    {
      title: "Active Members",
      value: loading ? "..." : dashboardStats.activeMembers?.toLocaleString() || "0",
      icon: "pi pi-verified",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Gym Employees",
      value: loading ? "..." : dashboardStats.totalEmployees?.toLocaleString() || "0",
      icon: "pi pi-id-card",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Current Month Revenue",
      value: "$12,500",
      icon: "pi pi-wallet",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Revenue",
      value: "$150,000",
      icon: "pi pi-chart-line",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <div className="px-2">
      <div className="grid mt-1">
        {cards.map((card, i) => (
          <div key={i} className="col-12 md:col-6 lg:col xl:col">
            <div
              className={`p-3 shadow-2 border-round-2xl ${card.bgColor} 
              transition-all transition-duration-300 
              hover:shadow-4 hover:-translate-y-1 hover:opacity-95`}
              style={{ transitionTimingFunction: "ease-in-out" }}
            >
              <div className="flex align-items-start justify-content-between">
                <div className="text-sm text-secondary">{card.title}</div>
                <div
                  className={`flex align-items-center justify-content-center border-circle ${card.iconBg}`}
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className={`${card.icon} text-lg`}></i>
                </div>
              </div>
              <div className="text-2xl font-bold mt-2 text-color-primary">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <DashboardGraphs />
    </div>
  );
};

export default DashboardWidgets;