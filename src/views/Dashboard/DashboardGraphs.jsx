import React from "react";
import { useSelector } from "react-redux";
import ReactApexChart from "https://esm.sh/react-apexcharts@1.4.1";
import GraphCard from "./GraphCard";

export default function DashboardGraphs() {
  const dashboardStats = useSelector((state) => state.dashboard.stats);

  
  const chartData = {
    series: dashboardStats.weeklyCheckIns?.map(day => parseFloat(day.percentage)) || [0, 0, 0, 0, 0, 0, 0],
    options: {
      colors: ["#0A5F59", "#FDCF6F"],
      chart: {
        width: 380,
        type: "pie",
      },
      labels: dashboardStats.weeklyCheckIns?.map(day => day.day) || [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const MemberStatus = {
    series: [
      dashboardStats.memberStatusByMonth?.active || 0,
      dashboardStats.memberStatusByMonth?.cancelled || 0,
      dashboardStats.memberStatusByMonth?.expired || 0,
    ],
    options: {
      colors: ["#3A7DFF", "#FF6361", "#FFA500"],
      chart: {
        type: "donut",
      },
      labels: ["New Join", "Cancelled", "Expired"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const NewRegistration = {
    series: [
      {
        name: "New Members",
        data: dashboardStats.registrationsByMonth?.map(m => m.count) || Array(12).fill(0),
      },
    ],
    options: {
      colors: ["#252B42"],
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: dashboardStats.registrationsByMonth?.map(m => m.month) || 
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Members",
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " members";
          },
        },
      },
    },
  };

  const RevenueActiveMembers = {
    series: [
      {
        name: "Active Member",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 100],
      },
      {
        name: "Revenue",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    options: {
      colors: ["#FDCF6F", "#252B42"],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "01/01/2023",
        "02/01/2023",
        "03/01/2023",
        "04/01/2023",
        "05/01/2023",
        "06/01/2023",
        "07/01/2023",
        "08/01/2023",
        "09/01/2023",
        "10/01/2023",
        "11/01/2023",
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        text: "",
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    },
  };

  return (
    <div className="grid mt-1">
      <GraphCard title="% Active Members Checked-In">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      </GraphCard>

      <GraphCard title="Member Agreement Status">
        <ReactApexChart
          options={MemberStatus.options}
          series={MemberStatus.series}
          type="donut"
          height={350}
        />
      </GraphCard>

      <GraphCard title="Revenue & Active Members Trend">
        <ReactApexChart
          options={RevenueActiveMembers.options}
          series={RevenueActiveMembers.series}
          type="line"
          height={350}
        />
      </GraphCard>

      <GraphCard title="New Registration by Month">
        <ReactApexChart
          options={NewRegistration.options}
          series={NewRegistration.series}
          type="bar"
          height={350}
        />
      </GraphCard>
    </div>
  );
}