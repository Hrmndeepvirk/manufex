import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import GridNavigation from "../../../shared/gridNavigation/GridNavigation";
import Attendance from "@assets/images/more/Attendance.png";
import Receipts from "@assets/images/more/Receipts.png";
import CloseOutDrawer from "@assets/images/more/CloseOutDrawer.png";
import Drawer from "@assets/images/more/Drawers.png";
import DrawersSummary from "@assets/images/more/DrawersSummary.png";
import GiftCardTransactions from "@assets/images/more/GiftCardTransactions.png";

import Alert from "@assets/images/settings/alert.png";
export default function Pos() {
  const items = [
    {
      img: Attendance,
      link: "/more/checkin",
      title: "Point Of Sale",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-blue-50",
    },
    {
      img: Attendance,
      link: "/more/pos/saved-carts",
      title: "Saved Carts",
      description: "Cart name,No of Items,Created By,Customer,Price",
      bgColor: "bg-blue-50",
    },
    {
      img: Receipts,
      link: "/more/checkin",
      title: "Receipts",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-green-50",
    },
    {
      img: CloseOutDrawer,
      link: "/more/alert",
      title: "Close Out Drawyer",
      description: "Date,Title,Employee",
      bgColor: "bg-purple-50",
    },
    {
      img: Drawer,
      link: "/more/checkin",
      title: "Drawers",
      description: "Employee Name, Department,Check In Date Time",
      bgColor: "bg-indigo-50",
    },
    {
      img: DrawersSummary,
      link: "/more/alert",
      title: "Drawers Summary",
      description: "Date,Title,Employee",
      bgColor: "bg-pink-50",
    },
    {
      img: GiftCardTransactions,
      link: "/more/alert",
      title: "Gift Card Summary",
      description: "Date,Title,Employee",
      bgColor: "bg-yellow-50",
    },
  ];
  return (
    <FormPageLayout backText="More" hideCancel>
      <GridNavigation items={items} />
    </FormPageLayout>
  );
}
