// import CustomCard from "../../../../shared/cards/CustomCard";
// import CustomListItem from "../../../../shared/cards/CustomListItem";
// import { getDate } from "@utils/dateTime";
// import { formatEnum } from "@utils/common";
// import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

// const Dashboard = ({ data, mostPurchased, recentAgreements = [], recentPosTransactions = [], recentServices = [], paymentMethods = [], balanceData = null }) => {
//   const { formatCurrency } = useCurrencyFormatter();

//   return (
//     <>
//       <CustomCard title="Alerts" size={6} height={"100%"}>
//         <div className="c-col-12 flex flex-column">
//           {data?.alerts?.length > 0 ? (
//             data.alerts.map((alert, i) => (
//               <div
//                 key={i}
//                 style={{ color: alert?.colorType }}
//                 className="flex align-items-center gap-2 mb-2"
//               >
//                 <i className="bi bi-exclamation-triangle"></i>
//                 <span>{alert.title}</span>
//               </div>
//             ))
//           ) : (
//             <div className="text-color-primary">No alerts available</div>
//           )}
//         </div>
//       </CustomCard>
//       <CustomCard title="Tasks" size={6} height={"100%"}>
//         <div className="c-col-12 flex flex-column gap-2">
//           {data?.tasks?.length > 0 ? (
//             data.tasks.map((task) => (
//               <div key={task._id} className=" text-color-primary">
//                 <div className="font-semibold ">{task.title}</div>
//                 <div className=" text-sm text-color-secondary ">
//                   {task.description}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-color-primary">No tasks available</div>
//           )}
//         </div>
//       </CustomCard>
//       <CustomCard title="Personal" size={6} height={"100%"}>
//         <CustomListItem
//           data={data}
//           name="address"
//           value={data?.address?.value?.label}
//         />
//         <CustomListItem data={data} name="primaryPhone" />{" "}
//         <CustomListItem data={data} name="email" />
//       </CustomCard>
//       <CustomCard title="Services" size={6} height={"100%"}>
//         <div className="c-col-12 flex flex-column gap-2">
//           {recentServices.length > 0 ? (
//             recentServices.map((item, i) => (
//               <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
//                 <div className="flex flex-column">
//                   <span className="text-color-primary font-semibold">{item?.service?.title || "-"}</span>
//                   <span className="text-color-secondary">{item?.createdAt ? getDate(item.createdAt) : "-"}</span>
//                 </div>
//                 <div className="flex flex-column align-items-end">
//                   <span className="text-color-primary">{formatCurrency ? formatCurrency(item?.price || 0) : item?.price}</span>
//                   <span className="text-color-secondary text-xs">{item?.remainingQuantity ?? 0} remaining</span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-color-primary">No services purchased</div>
//           )}
//         </div>
//       </CustomCard>
//       <CustomCard title="Most Purchased Items" size={12} height={"100%"}>
//         <div className="c-col-12 flex gap-3" style={{ overflowX: "auto" }}>
//           {mostPurchased?.length > 0 ? (
//             mostPurchased.map((item, i) => (
//               <div
//                 key={item._id || i}
//                 className="flex flex-column align-items-center text-center"
//                 style={{ minWidth: "100px" }}
//               >
//                 <div
//                   className="border-round flex align-items-center justify-content-center mb-2"
//                   style={{
//                     width: "80px",
//                     height: "80px",
//                     overflow: "hidden",
//                     backgroundColor: "var(--highlight-bg)",
//                   }}
//                 >
//                   {item.image ? (
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                       }}
//                     />
//                   ) : (
//                     <i
//                       className="bi bi-box-seam text-3xl"
//                       style={{ color: "var(--text-color-secondary)" }}
//                     ></i>
//                   )}
//                 </div>
//                 <span
//                   className="text-sm text-color-primary"
//                   style={{
//                     maxWidth: "100px",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {item.title}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <div className="text-color-primary">No purchased items available</div>
//           )}
//         </div>
//       </CustomCard>
//       <CustomCard title="Billing History" size={6} height={"100%"}>
//         <div className="c-col-12 flex flex-column gap-2">
//           <div className="font-semibold text-highlight mb-1">Last 3 Agreements</div>
//           {recentAgreements.length > 0 ? (
//             recentAgreements.map((item, i) => (
//               <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
//                 <div className="flex flex-column">
//                   <span className="text-color-primary font-semibold">{item.agreementName || "-"}</span>
//                   <span className="text-color-secondary">{item.dueDate ? getDate(item.dueDate) : "-"}</span>
//                 </div>
//                 <span className="text-color-primary">{formatCurrency ? formatCurrency(item.invoiceAmount || 0) : item.invoiceAmount}</span>
//               </div>
//             ))
//           ) : (
//             <div className="text-color-secondary text-sm">No agreement transactions</div>
//           )}

//           <div className="font-semibold text-highlight mb-1 mt-2">Last 3 POS Transactions</div>
//           {recentPosTransactions.length > 0 ? (
//             recentPosTransactions.map((item, i) => {
//               const itemNames = Array.isArray(item.cartItems)
//                 ? item.cartItems.map((ci) => ci?.name || ci?.title || "").filter(Boolean).join(", ")
//                 : "-";
//               return (
//                 <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
//                   <div className="flex flex-column">
//                     <span className="text-color-primary font-semibold">{itemNames || "-"}</span>
//                     <span className="text-color-secondary">{item.date ? getDate(item.date) : "-"}</span>
//                   </div>
//                   <div className="flex flex-column align-items-end">
//                     <span className="text-color-primary">{formatCurrency ? formatCurrency(item.amount || 0) : item.amount}</span>
//                     <span style={{ color: item.status === "SALE" ? "var(--color-success)" : "var(--color-danger)" }} className="text-xs">
//                       {item.status ? formatEnum(item.status) : "-"}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-color-secondary text-sm">No POS transactions</div>
//           )}
//         </div>
//       </CustomCard>
//       <CustomCard title="Payment Method" size={6} height={"100%"}>
//         <CustomListItem
//           label="Card On File"
//           value={
//             paymentMethods.length > 0
//               ? `${paymentMethods[0]?.payment?.creditCard?.cardType || ""} ****${paymentMethods[0]?.payment?.creditCard?.cardNumber?.slice(-4) || ""}`
//               : "-"
//           }
//         />
//         <CustomListItem
//           label="Next Due"
//           value={
//             balanceData?.nextDueDate
//               ? `${getDate(balanceData.nextDueDate)} - ${formatCurrency(balanceData.nextDueAmount || 0)}`
//               : "-"
//           }
//         />
//         <CustomListItem
//           label="Past Due"
//           value={
//             balanceData?.pastDue
//               ? formatCurrency(balanceData.pastDue)
//               : formatCurrency(0)
//           }
//         />
//       </CustomCard>
//     </>
//   );
// };

// export default Dashboard;
import CustomCard from "../../../../shared/cards/CustomCard";
import CustomListItem from "../../../../shared/cards/CustomListItem";
import { getDate } from "@utils/dateTime";
import { formatEnum } from "@utils/common";
import { useCurrencyFormatter } from "../../../../hooks/useCurrencyFormatter";

const Dashboard = ({ data, mostPurchased, recentAgreements = [], recentPosTransactions = [], recentServices = [], paymentMethods = [], balanceData = null, rewards = [], rewardPoints = 0 }) => {
  const { formatCurrency } = useCurrencyFormatter();

  const recentRewards = Array.isArray(rewards) ? rewards.slice(0, 3) : [];
  const activeAlerts = Array.isArray(data?.alerts)
    ? data.alerts.filter((alert) => alert?.isActive !== false)
    : [];

  return (
    <>
      <CustomCard title="Alerts" size={6} height={"100%"}>
        <div className="c-col-12 flex flex-column">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert, i) => (
              <div
                key={i}
                style={{ color: alert?.colorType }}
                className="flex align-items-center gap-2 mb-2"
              >
                <i className="bi bi-exclamation-triangle"></i>
                <span>{alert.title}</span>
              </div>
            ))
          ) : (
            <div className="text-color-primary">No alerts available</div>
          )}
        </div>
      </CustomCard>
      <CustomCard title="Tasks" size={6} height={"100%"}>
        <div className="c-col-12 flex flex-column gap-2">
          {data?.tasks?.length > 0 ? (
            data.tasks.map((task) => (
              <div key={task._id} className=" text-color-primary">
                <div className="font-semibold ">{task.title}</div>
                <div className=" text-sm text-color-secondary ">
                  {task.description}
                </div>
              </div>
            ))
          ) : (
            <div className="text-color-primary">No tasks available</div>
          )}
        </div>
      </CustomCard>
      <CustomCard title="Personal" size={6} height={"100%"}>
        <CustomListItem
          data={data}
          name="address"
          value={
            data?.address?.value?.label ||
            [data?.address?.addressLine1, data?.address?.city, data?.address?.state, data?.address?.zipCode].filter(Boolean).join(", ") ||
            "-"
          }
        />
        <CustomListItem data={data} name="primaryPhone" />{" "}
        <CustomListItem data={data} name="email" />
      </CustomCard>
      <CustomCard title="Services" size={6} height={"100%"}>
        <div className="c-col-12 flex flex-column gap-2">
          {recentServices.length > 0 ? (
            recentServices.map((item, i) => (
              <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
                <div className="flex flex-column">
                  <span className="text-color-primary font-semibold">{item?.service?.title || "-"}</span>
                  <span className="text-color-secondary">{item?.createdAt ? getDate(item.createdAt) : "-"}</span>
                </div>
                <div className="flex flex-column align-items-end">
                  <span className="text-color-primary">{formatCurrency ? formatCurrency(item?.price || 0) : item?.price}</span>
                  <span className="text-color-secondary text-xs">{item?.remainingQuantity ?? 0} remaining</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-color-primary">No services purchased</div>
          )}
        </div>
      </CustomCard>
      <CustomCard title="Most Purchased Items" size={6} height={"100%"}>
        <div className="c-col-12 flex gap-3" style={{ overflowX: "auto" }}>
          {mostPurchased?.length > 0 ? (
            mostPurchased.map((item, i) => (
              <div
                key={item._id || i}
                className="flex flex-column align-items-center text-center"
                style={{ minWidth: "100px" }}
              >
                <div
                  className="border-round flex align-items-center justify-content-center mb-2"
                  style={{
                    width: "80px",
                    height: "80px",
                    overflow: "hidden",
                    backgroundColor: "var(--highlight-bg)",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <i
                      className="bi bi-box-seam text-3xl"
                      style={{ color: "var(--text-color-secondary)" }}
                    ></i>
                  )}
                </div>
                <span
                  className="text-sm text-color-primary"
                  style={{
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </span>
              </div>
            ))
          ) : (
            <div className="text-color-primary">No purchased items available</div>
          )}
        </div>
      </CustomCard>

          <CustomCard title="Rewards" size={6} height={"100%"} headers={
            <span className="flex align-items-center gap-2 my-auto">
              <i className="bi bi-star-fill" style={{ color: "#f59e0b", fontSize: "1rem" }} />
              <span className="font-bold" style={{ fontSize: "1rem" }}>
                {rewardPoints ?? 0} pts
              </span>
            </span>
          }>
        <div className="c-col-12 flex flex-column gap-2">

          {recentRewards.length > 0 ? (
            recentRewards.map((item, i) => {
              const isPositive = (item.points ?? item.amount ?? 0) >= 0;
              const pts = item.points ?? item.amount ?? 0;
              return (
                <div
                  key={item._id || i}
                  className="flex justify-content-between align-items-center"
                  style={{
                    paddingBottom: "0.5rem",
                    borderBottom: i < recentRewards.length - 1 ? "1px solid var(--surface-border, #e2e8f0)" : "none",
                  }}
                >
                  <div className="flex flex-column">
                    <span className="font-semibold text-color-primary text-sm">
                      {item.reason || item.description || item.title || "-"}
                    </span>
                    <span className="text-color-secondary" style={{ fontSize: "0.75rem" }}>
                      {item.type ? formatEnum(item.type) : item.category || "Manual adjustment"}
                    </span>
                  </div>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: isPositive ? "var(--color-success, #22c55e)" : "var(--color-danger, #ef4444)" }}
                  >
                    {isPositive ? `+${pts}` : pts} pts
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-color-secondary text-sm">No reward transactions</div>
          )}
        </div>
      </CustomCard>
      <CustomCard title="Billing History" size={6} height={"100%"}>
        <div className="c-col-12 flex flex-column gap-2">
          <div className="font-semibold text-highlight mb-1">Last 3 Agreements</div>
          {recentAgreements.length > 0 ? (
            recentAgreements.map((item, i) => (
              <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
                <div className="flex flex-column">
                  <span className="text-color-primary font-semibold">{item.agreementName || "-"}</span>
                  <span className="text-color-secondary">{item.dueDate ? getDate(item.dueDate) : "-"}</span>
                </div>
                <span className="text-color-primary">{formatCurrency ? formatCurrency(item.invoiceAmount || 0) : item.invoiceAmount}</span>
              </div>
            ))
          ) : (
            <div className="text-color-secondary text-sm">No agreement transactions</div>
          )}

          <div className="font-semibold text-highlight mb-1 mt-2">Last 3 POS Transactions</div>
          {recentPosTransactions.length > 0 ? (
            recentPosTransactions.map((item, i) => {
              const itemNames = Array.isArray(item.cartItems)
                ? item.cartItems.map((ci) => ci?.name || ci?.title || "").filter(Boolean).join(", ")
                : "-";
              return (
                <div key={item._id || i} className="flex justify-content-between align-items-center text-sm mb-1">
                  <div className="flex flex-column">
                    <span className="text-color-primary font-semibold">{itemNames || "-"}</span>
                    <span className="text-color-secondary">{item.date ? getDate(item.date) : "-"}</span>
                  </div>
                  <div className="flex flex-column align-items-end">
                    <span className="text-color-primary">{formatCurrency ? formatCurrency(item.amount || 0) : item.amount}</span>
                    <span style={{ color: item.status === "SALE" ? "var(--color-success)" : "var(--color-danger)" }} className="text-xs">
                      {item.status ? formatEnum(item.status) : "-"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-color-secondary text-sm">No POS transactions</div>
          )}
        </div>
      </CustomCard>

      {/* Rewards Card */}
  

      <CustomCard title="Payment Method" size={6} height={"100%"}>
        <CustomListItem
          label="Card On File"
          value={
            paymentMethods.length > 0
              ? `${paymentMethods[0]?.payment?.creditCard?.cardType || ""} ****${paymentMethods[0]?.payment?.creditCard?.cardNumber?.slice(-4) || ""}`
              : "-"
          }
        />
        <CustomListItem
          label="Next Due"
          value={
            balanceData?.nextDueDate
              ? `${getDate(balanceData.nextDueDate)} - ${formatCurrency(balanceData.nextDueAmount || 0)}`
              : "-"
          }
        />
        <CustomListItem
          label="Past Due"
          value={
            balanceData?.pastDue
              ? formatCurrency(balanceData.pastDue)
              : formatCurrency(0)
          }
        />
      </CustomCard>
    </>
  );
};

export default Dashboard;
