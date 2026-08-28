import React from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import GridNavigation from "../../../shared/gridNavigation/GridNavigation";
import CheckIn from "@assets/images/more/Checkinhistory.png";
import Alert from "@assets/images/settings/alert.png";
import Receipts from "@assets/images/more/Receipts.png";

export default function CustomerRelations() {
  const items = [
    {
      img: CheckIn,
      link: "/more/checkin",
      title: "Manage",
      description: "Manage Members",
      bgColor: "bg-blue-50",
    },
    {
      img: Alert,
      link: "/more/alert",
      title: "Reccuring Services",
      description: "Services set to recurring",
      bgColor: "bg-pink-50",
    },
    {
      img: CheckIn,
      link: "/more/checkin",
      title: "Reserve",
      description: "Reserve Resources, Resource Type, Resources Available ",
      bgColor: "bg-indigo-50",
    },
    {
      img: Receipts,
      link: "/more/alert",
      title: "Tasks",
      description: "Tasks assigned to member",
      bgColor: "bg-green-50",
    },
  ];
  return (
    <FormPageLayout backText="More" hideCancel>
      <GridNavigation items={items} />
    </FormPageLayout>
  );
}
