import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";

import FormPageLayout from "@shared/layout/FormPageLayout";

import {
  getMember,
  getMostPurchasedItems,
  getBillingHistory,
  getPosHistory,
  getMemberServices,
} from "../../../store/member/memberActions";
import Dashboard from "./Dashboard";
import Personal from "./Personal";
import Agreement from "./Agreement";
import Services from "./Services";
import PaymentMethod from "./PaymentMethod";
import IposCards from "./IposCards";
import Alerts from "./Alerts";
import Notes from "./Notes";
import Tasks from "./Tasks";

import BillingHistory from "./BillingHistory";
import Documents from "./Documents";
import CreateTask from "../TaskAndAlert/CreateTask";
import CreateAlert from "../TaskAndAlert/CreateAlert";
import MemberProfile from "../../../shared/userCards/MemberProfile";
import CustomSidebar from "../../../shared/sidebar/CustomSidebar";
import CustomCard from "../../../shared/cards/CustomCard";
import { getTasks } from "../../../store/member/taskActions";
import { getAlert } from "../../../store/member/alertActions";
import { getMemberRedeemedServices } from "../../../store/member/memberServiceRedeemActions";
import { getMemberRewards } from "../../../store/member/rewardActions";
import { getMemberRedeemables } from "../../../store/member/redeemableActions";
import { getPaymentMethods } from "../../../store/member/paymentMethodAction";
import { getBalanceHistory } from "../../../store/pointOfSale/pointOfSaleActions";
import QuickEnrollDialog from "../../CheckIn/QuickEnroll/QuickEnrollDialog";
import Rewards from "./Rewards";

export default function MemberForm() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState(null);

  const [createTaskVisible, setCreateTaskVisible] = useState(false);
  const [createAlertVisible, setCreateAlertVisible] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [showQuickEnroll, setShowQuickEnroll] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [alertData, setAlertData] = useState([]);
  const [alertLoading, setAlertLoading] = useState(false);
  const [redeemedLoading, setRedeemedLoading] = useState(false);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [redeemablesLoading, setRedeemablesLoading] = useState(false);
  const [mostPurchased, setMostPurchased] = useState([]);
  const [recentAgreements, setRecentAgreements] = useState([]);
  const [recentPosTransactions, setRecentPosTransactions] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [balanceData, setBalanceData] = useState(null);

  const rewards = useSelector((state) => state.member.rewards);
  const memberRedeemables = useSelector(
    (state) => state.member.memberRedeemables,
  );

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "dashboard",
  );
  const [iposCardStatus, setIposCardStatus] = useState(null);
  const activeAlerts = Array.isArray(alertData)
    ? alertData.filter((alert) => alert?.isActive !== false)
    : [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("ipos_card");
    if (status) {
      setActiveTab("iposCards");
      setIposCardStatus(status);
      navigate(location.pathname, { replace: true, state: location.state });
    }
  }, []);

  useEffect(() => {
    getMemberFunction();
    getTasksFunction();
    getAlertFunction();
    getMemberRedeemableServices();
    getMemberRewardsFunction();
    getMemberRedeemablesFunction();
    getMostPurchasedFunction();
    getRecentBillingData();
    getRecentServicesData();
    getPaymentInfo();
  }, [id]);

  function getMemberFunction() {
    if (id) {
      dispatch(
        getMember(id, setPageLoading, (e) => {
          setData(e);
        }),
      );
    }
  }
  function getTasksFunction() {
    if (id) {
      dispatch(
        getTasks(id, setTasksLoading, (data) => data && setTasksData(data)),
      );
    }
  }
  function getAlertFunction() {
    if (id) {
      dispatch(getAlert(id, setAlertLoading, (data) => setAlertData(data)));
    }
  }

  function getMemberRedeemableServices() {
    if (id) {
      dispatch(getMemberRedeemedServices(id, setRedeemedLoading, () => {}));
    }
  }

  function getMemberRewardsFunction() {
    if (id) {
      dispatch(getMemberRewards(id, setRewardsLoading));
    }
  }

  function getMemberRedeemablesFunction() {
    if (id) {
      dispatch(getMemberRedeemables(id, setRedeemablesLoading));
    }
  }

  function getRecentBillingData() {
    if (id) {
      dispatch(
        getBillingHistory(id, null, (data) => {
          if (data) setRecentAgreements(data.slice(0, 3));
        }),
      );
      dispatch(
        getPosHistory(id, null, (data) => {
          if (data) setRecentPosTransactions(data.slice(0, 3));
        }),
      );
    }
  }

  function getPaymentInfo() {
    if (id) {
      dispatch(
        getPaymentMethods(id, null, (methods) => {
          if (methods) setPaymentMethodsData(methods);
        }),
      );
      dispatch(
        getBalanceHistory(id, null, (data) => {
          if (data) setBalanceData(data);
        }),
      );
    }
  }

  function getRecentServicesData() {
    if (id) {
      dispatch(
        getMemberServices(id, null, (success, data) => {
          if (success && data) setRecentServices(data.slice(0, 3));
        }),
      );
    }
  }

  function getMostPurchasedFunction() {
    if (id) {
      dispatch(
        getMostPurchasedItems(id, null, (data) => setMostPurchased(data)),
      );
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            data={data}
            mostPurchased={mostPurchased}
            recentAgreements={recentAgreements}
            recentPosTransactions={recentPosTransactions}
            recentServices={recentServices}
            paymentMethods={paymentMethodsData}
            balanceData={balanceData}
            rewards={rewards}
            rewardPoints={data?.rewardPoints}
          />
        );
      case "personal":
        return <Personal data={data} setData={setData} />;
      case "agreement":
        return <Agreement data={data} />;
      case "services":
        return <Services data={data} />;
      case "payment":
        return <PaymentMethod data={data} />;
      case "iposCards":
        return (
          <IposCards
            initialStatus={iposCardStatus}
            onStatusClear={() => setIposCardStatus(null)}
          />
        );
      case "billingHistory":
        return <BillingHistory />;
      case "alerts":
        return (
          <Alerts
            data={alertData}
            loading={alertLoading}
            onRefresh={getAlertFunction}
          />
        );
      case "notes":
        return <Notes data={data} />;
      case "tasks":
        return <Tasks data={tasksData} loading={tasksLoading} />;
      case "documents":
        return <Documents />;
      case "rewards":
        return (
          <Rewards
            data={rewards}
            rewardPoints={data?.rewardPoints}
            loading={rewardsLoading}
            redeemables={memberRedeemables}
            redeemablesLoading={redeemablesLoading}
            memberId={id}
            onRedeemSuccess={() => {
              getMemberRewardsFunction();
              getMemberRedeemablesFunction();
              getMemberFunction();
            }}
          />
        );
      default:
        return (
          <Dashboard
            data={data}
            mostPurchased={mostPurchased}
            recentAgreements={recentAgreements}
            recentPosTransactions={recentPosTransactions}
            recentServices={recentServices}
            paymentMethods={paymentMethodsData}
            balanceData={balanceData}
            rewards={rewards}
            rewardPoints={data?.rewardPoints}
          />
        );
    }
  };

  const actions = [
    {
      label: "Calendar",
      icon: "bi bi-calendar2-week",
      onClick: () => navigate("/calendar", { state: { member: id } }),
    },
    {
      label: " Message",
      icon: "bi bi-envelope-check",
      onClick: () => {},
    },
    {
      label: " Enroll",
      icon: "bi bi-clipboard-data",
      onClick: () => setShowQuickEnroll(true),
    },
    {
      label: "POS",
      icon: "bi bi-cart3",
      onClick: () => {
        navigate("/point-of-sale", { state: { member: id } });
      },
    },
  ];

  const sidebarOptions = [
    {
      _id: "dashboard",
      title: "Dashboard",
      icon: "bi bi-speedometer2",
    },
    {
      _id: "personal",
      title: "Personal",
      icon: "bi bi-file-earmark-person",
    },
    {
      _id: "agreement",
      title: "Agreement",
      icon: "bi bi-file-earmark-text",
    },
    {
      _id: "services",
      title: "Services",
      icon: "bi bi-clock",
    },
    {
      _id: "payment",
      title: "Payment Method",
      icon: "bi bi-wallet2",
    },
    {
      _id: "iposCards",
      title: "IPOS Cards",
      icon: "bi bi-credit-card",
    },
    {
      _id: "billingHistory",
      title: "Billing History",
      icon: "bi bi-clock-history",
    },
    {
      _id: "alerts",
      title: "Alerts",
      icon: "bi bi-exclamation-square",
    },
    {
      _id: "notes",
      title: "Notes",
      icon: "bi bi-card-list",
    },
    {
      _id: "tasks",
      title: "Tasks",
      icon: "bi bi-list-task",
    },
    {
      _id: "documents",
      title: "Documents",
      icon: "bi bi-file-earmark-arrow-up",
    },
    {
      _id: "rewards",
      title: "Rewards",
      icon: "bi bi-star",
    },
  ];

  return (
    <>
      <QuickEnrollDialog
        member={id}
        visible={showQuickEnroll}
        onHide={() => setShowQuickEnroll(false)}
      />

      <CreateTask
        visible={createTaskVisible}
        onHide={() => {
          getMemberFunction();
          setCreateTaskVisible(false);
          getTasksFunction();
        }}
        member={id}
      />
      <CreateAlert
        visible={createAlertVisible}
        onHide={() => {
          getMemberFunction();
          getAlertFunction();
          setCreateAlertVisible(false);
        }}
        member={id}
      />

      <div className="px-2 pt-2 c-grid h-full">
        <div className="c-col-2 h-full">
          <CustomSidebar
            backText="Members"
            selected={activeTab}
            onSelect={setActiveTab}
            options={sidebarOptions}
          />
        </div>
        <div className="c-col-10 h-full overflow-y-auto ">
          <div className="c-grid">
            <CustomCard hideHeader>
              {/* Row 1: Profile + Actions | Alerts | Tasks */}
              <div className="c-col-4">
                <MemberProfile
                  user={data}
                  loading={!data && pageLoading}
                  nameOffset="1rem"
                >
                  {/* Actions row — inside the name column, below the barcode */}
                  <div
                    className="mt-2"
                    style={{ display: "flex", gap: "3rem" }}
                  >
                    {actions.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                        onClick={item.onClick}
                      >
                        {!data && pageLoading ? (
                          <Skeleton width="60px" height="60px" />
                        ) : (
                          <>
                            <i className={`${item.icon} text-2xl`} />
                            <div style={{ fontSize: "0.8rem" }}>
                              {item.label}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </MemberProfile>
              </div>

              {/* Alerts Panel */}
              <div
                className="c-col-4"
                style={{
                  borderLeft: "1px solid var(--surface-border, #e2e8f0)",
                  paddingLeft: "1rem",
                }}
              >
                <div className="flex align-items-center justify-content-between mb-2">
                  <span className="font-semibold text-sm">Alerts</span>
                  <button
                    className="p-0 border-none bg-transparent text-primary cursor-pointer text-xs"
                    style={{ color: "var(--primary-color, #494d4f)" }}
                    onClick={() => setCreateAlertVisible(true)}
                  >
                    + Create new
                  </button>
                </div>

                {alertLoading ? (
                  <div className="flex flex-column gap-1">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height="18px" className="mb-1" />
                    ))}
                  </div>
                ) : (
                  <div
                    className="minimal-scrollbar"
                    style={{
                      maxHeight: "100px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {activeAlerts.length > 0 ? (
                      activeAlerts.map((alert, index) => (
                        <div
                          key={alert._id || index}
                          className="flex align-items-center gap-1 cursor-pointer"
                          style={{
                            color: "var(--primary-color, #0ea5e9)",
                            fontSize: "0.8rem",
                          }}
                          onClick={() => setActiveTab("alerts")}
                          title={alert.message || alert.title || alert.name}
                        >
                          <i
                            className="bi bi-exclamation-triangle"
                            style={{ fontSize: "0.75rem", flexShrink: 0 }}
                          />
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {alert.message || alert.title || alert.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-color-secondary">
                        No alerts
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Tasks Panel */}
              <div
                className="c-col-4"
                style={{
                  borderLeft: "1px solid var(--surface-border, #e2e8f0)",
                  paddingLeft: "1rem",
                }}
              >
                <div className="flex align-items-center justify-content-between mb-2">
                  <span className="font-semibold text-sm">Tasks</span>
                  <button
                    className="p-0 border-none bg-transparent cursor-pointer text-xs"
                    style={{ color: "var(--primary-color, #0ea5e9)" }}
                    onClick={() => setCreateTaskVisible(true)}
                  >
                    + Create new
                  </button>
                </div>

                {tasksLoading ? (
                  <div className="flex flex-column gap-1">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height="18px" className="mb-1" />
                    ))}
                  </div>
                ) : (
                  <div
                    className="minimal-scrollbar"
                    style={{
                      maxHeight: "100px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {tasksData && tasksData.length > 0 ? (
                      tasksData.map((task, index) => (
                        <div
                          key={task._id || index}
                          className="cursor-pointer"
                          style={{ fontSize: "0.8rem" }}
                          onClick={() => setActiveTab("tasks")}
                        >
                          <div
                            className="font-medium"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              color: "var(--text-color)",
                            }}
                            title={task.title || task.name}
                          >
                            {task.title || task.name}
                          </div>
                          {(task.description || task.notes) && (
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "var(--text-color-secondary, #6b7280)",
                                fontSize: "0.72rem",
                              }}
                              title={task.description || task.notes}
                            >
                              {task.description || task.notes}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-color-secondary">
                        No tasks
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CustomCard>
            {renderTab()}
          </div>
        </div>
      </div>
    </>
  );
}
