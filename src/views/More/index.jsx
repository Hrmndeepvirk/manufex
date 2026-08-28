import React from "react";
import GridNavigation from "../../shared/gridNavigation/GridNavigation";
import Attendance from "../../assets/images/settings/Attendance.png";
import Point from "@assets/images/settings/pointofsale.png";
import Schedule from "@assets/images/settings/schedule.png";
import Member from "@assets/images/settings/membersetup.png";
import customerRelations from "@assets/images/settings/customerRelations.png";
import Training from "@assets/images/settings/traning.png";
import Inventory from "@assets/images/settings/inventorysetup.png";
import Links from "@assets/images/settings/Links.png";
import Reports from "@assets/images/settings/Reports.png";
import Help from "@assets/images/settings/Help.png";
import Agreement from "@assets/images/settings/agreementsetup.png";
import Mobile from "@assets/images/settings/mobileapp.png";
import Forms from "@assets/images/settings/mobileapp.png";
import Maintenance from "@assets/images/settings/Maintenance.png";
import FacilityLayout from "@assets/images/settings/FacilityLayout.png";

export default function More() {
  const items = [
    {
      img: Attendance,
      link: "/more/attendance",
      title: "Attendance",
      description: "Check in Histoy, Alerts",
      bgColor: "bg-blue-50",
    },
    {
      img: Point,
      link: "/more/pos",
      title: "Point Of Sale",
      description: "Tax, Payment Methods, Discounts, Registers etc.",
      bgColor: "bg-blue-50",
    },
    {
      img: Schedule,
      link: "/more/schedule",
      title: "Schedule",
      description:
        "Levels, Locations, Scheduling, Categories, Events & Classes etc.",
      bgColor: "bg-purple-50",
    },
    {
      img: Member,
      link: "/more/member",
      title: "Member",
      description: "Memberships, Campaigns, Access Schedules, Resources etc.",
      bgColor: "bg-cyan-50",
    },
    {
      img: customerRelations,
      link: "/more/customer-relations",
      title: "Customer Relations",
      description: "Relationships with customers",
      bgColor: "bg-indigo-50",
    },
    {
      img: Training,
      link: "/more/training",
      title: "Training",
      description: "tutorials,documentation,support ",
      bgColor: "bg-green-50",
    },
    {
      img: Inventory,
      link: "/more/inventory",
      title: "Inventory",
      description: "Stock, Profit Centers, Vendors, Commission & Referral etc.",
      bgColor: "bg-bluegray-50",
    },
    {
      img: Links,
      link: "/more/links",
      title: "Links",
      description: "Stock, Profit Centers, Vendors, Commission & Referral etc.",
      bgColor: "bg-blue-50",
    },
    {
      img: Reports,
      link: "/more/reports",
      title: "Reports",
      description: "Manage Reports",
      bgColor: "bg-cyan-50",
    },
    {
      img: Help,
      link: "/more/help",
      title: "Help",
      description: "Stock, Profit Centers, Vendors, Commission & Referral etc.",
      bgColor: "bg-blue-50",
    },
    {
      img: Agreement,
      link: "/more/agreement-setup",
      title: "Agreement Setup",
      description: "Fees, Templates, Categories, Plans & Promotions etc.",
      bgColor: "bg-indigo-50",
    },
    {
      img: Mobile,
      link: "/more/app",
      title: "Mobile App",
      description: "Mobile App Settings, Push Notifications, App Themes etc.",
      bgColor: "bg-red-50",
    },
    {
      img: Forms,
      link: "/more/forms",
      title: "Forms",
      description: "Forms settings and usage",
      bgColor: "bg-red-50",
    },
    {
      img: Maintenance,
      link: "/more/maintainance",
      title: "Maintainance",
      description: "maintainance for services and POS",
      bgColor: "bg-green-50",
    },
    {
      img: FacilityLayout,
      link: "/more/facility-layout",
      title: "Facility Layout",
      description: "Layout for facilities",
      bgColor: "bg-yellow-50",
    },
    {
      img: Agreement,
      link: "/more/request",
      title: "Requests",
      description: "Incoming, outgoing & history of all requests.",
      bgColor: "bg-indigo-50",
    },
  ];
  return <GridNavigation items={items} />;
}
