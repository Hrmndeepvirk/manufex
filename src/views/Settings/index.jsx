import Bussiness from "@assets/images/settings/businessettings.png";
import customer from "@assets/images/settings/customer.png";
import Employee from "@assets/images/settings/Employee.png";
import Schedule from "@assets/images/settings/schedule.png";
import Point from "@assets/images/settings/pointofsale.png";
import Alerts from "@assets/images/settings/alert.png";
import Menu from "@assets/images/settings/menulayout.png";
import Inventory from "@assets/images/settings/inventorysetup.png";
import Member from "@assets/images/settings/membersetup.png";
import Agreement from "@assets/images/settings/agreementsetup.png";
import Rewards from "@assets/images/settings/rewards.png";
import Integration from "@assets/images/settings/integration.png";
import Mobile from "@assets/images/settings/mobileapp.png";
import Training from "@assets/images/settings/traning.png";
import Noti from "@assets/images/settings/notifications.png";
import GridNavigation from "../../shared/gridNavigation/GridNavigation";

export default function Settings() {
  const items = [
    {
      img: Bussiness,
      link: "/settings/business-setup",
      title: "Business Settings",
      description: "Company, Reason Code, Customization, Clubs, Default etc.",
      bgColor: "bg-blue-50",
    },
    {
      img: customer,
      link: "/settings/follow-up",
      title: "Customer Follow-up",
      description: "Follow-up, Customer Notes, Customer Tags etc.",
      bgColor: "bg-yellow-50",
    },
    {
      img: Employee,
      link: "/settings/employee-setup",
      title: "Employee",
      description:
        "Availability, Timesheets, Title, Department, Roles, Permissions etc.",
      bgColor: "bg-green-50",
    },
    {
      img: Schedule,
      link: "/settings/schedule-setup",
      title: "Schedule Setup",
      description:
        "Levels, Locations, Scheduling, Categories, Events & Classes etc.",
      bgColor: "bg-purple-50",
    },

    {
      img: Alerts,
      link: "/settings/alerts",
      title: "Alerts",
      description: "Notification Settings, Alert Types, Triggers etc.",
      bgColor: "bg-pink-50",
    },
    {
      img: Point,
      link: "/settings/point-of-sale",
      title: "Point of Sale",
      description: "Tax, Payment Methods, Discounts, Registers etc.",
      bgColor: "bg-indigo-50",
    },
    {
      img: Menu,
      link: "/settings/layout",
      title: "Menu Layout",
      description: "Menu Layout, Button Layout, Color Themes etc.",
      bgColor: "bg-orange-50",
    },
    {
      img: Inventory,
      link: "/settings/inventory-setup",
      title: "Inventory Setup",
      description: "Stock, Profit Centers, Vendors, Commission & Referral etc.",
      bgColor: "bg-bluegray-50",
    },
    {
      img: Member,
      link: "/settings/member-setup",
      title: "Members Setup",
      description: "Memberships, Campaigns, Access Schedules, Resources etc.",
      bgColor: "bg-cyan-50",
    },
    {
      img: Rewards,
      link: "/settings/rewards-setup",
      title: "Rewards",
      description: "Loyalty Programs, Rewards, Points System etc.",
      bgColor: "bg-red-50",
    },
    {
      img: Agreement,
      link: "/settings/agreement-setup",
      title: "Agreement Setup",
      description: "Fees, Templates, Categories, Plans & Promotions etc.",
      bgColor: "bg-blue-50",
    },

    {
      img: Integration,
      link: "/settings/integration",
      title: "Integration",
      description: "Third-party Integrations, API Settings, Webhooks etc.",
      bgColor: "bg-teal-50",
    },
    {
      img: Mobile,
      link: "/settings/app",
      title: "Mobile App",
      description: "Mobile App Settings, Push Notifications, App Themes etc.",
      bgColor: "bg-red-50",
    },
    {
      img: Training,
      link: "/settings/training",
      title: "Training",
      description: "Tutorials, Documentation, Support Contacts etc.",
      bgColor: "bg-green-50",
    },
    {
      img: Noti,
      link: "/settings/notifications",
      title: "Notifications",
      description: "Email, SMS, In-App Notifications Settings etc.",
      bgColor: "bg-yellow-50",
    },
  ];
  return <GridNavigation items={items} />;
}
