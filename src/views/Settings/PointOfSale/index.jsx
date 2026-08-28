import CustomTabView from "@shared/tabView/CustomTabView";
import Tax from "./Tax";
import PaymentMethod from "./PaymentMethod";
import Discount from "./Discount";
import Register from "./Register";

export default function PointOfSale() {
  const tabs = [
    { title: "Tax", content: <Tax /> },
    { title: "Payment Method", content: <PaymentMethod /> },
    { title: "Discount", content: <Discount /> },
    { title: "Register", content: <Register /> },
  ];
  return <CustomTabView tabs={tabs} />;
}
