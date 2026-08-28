import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MemberProfile from "./MemberProfile";
import CreateTask from "../../views/Members/TaskAndAlert/CreateTask";
import CreateAlert from "../../views/Members/TaskAndAlert/CreateAlert";
import EditTask from "../../views/Members/TaskAndAlert/EditTask";
import EditAlert from "../../views/Members/TaskAndAlert/EditAlert";
import { getAlert } from "../../store/member/alertActions";

const STATUS_BG_MAP = {
  DANGER: "bg-red-400",
  WARNING: "bg-yellow-400",
  SUCCESS: "bg-green-400",
  DEFAULT: "bg-card",
};

const STATUS_MESSAGE_MAP = {
  SUCCESS: {
    title: "Access Granted",
    subtitle: "Gym Access",
    icon: "pi pi-check-circle",
  },
  WARNING: {
    title: "Needs Attention",
    subtitle: "No Gym Access — Services Only",
    icon: "pi pi-exclamation-triangle",
  },
  DANGER: {
    title: "Expired / Unpaid",
    subtitle: "No Gym Access — No Active Services",
    icon: "pi pi-times-circle",
  },
};

function CheckinDetails({
  status = "DEFAULT",
  member,
  loading = false,
  getCheckingsFunc,
  agreementStatus,
  hasGymAccess,
  hasServices,
  hasOverdueResources,
  overdueResources,
  hasPendingServices,
  pendingEventServices,
  membershipAccessStatus,
  accessScheduleTitle,
  membershipTypeTitle,
  membershipAccessReason,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bgClass = STATUS_BG_MAP[status];
  const statusMessage = STATUS_MESSAGE_MAP[status];

  const [createAlertVisible, setCreateAlertVisible] = useState(false);
  const [createTaskVisible, setCreateTaskVisible] = useState(false);
  const [editAlertVisible, setEditAlertVisible] = useState(false);
  const [editTaskVisible, setEditTaskVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [memberAlerts, setMemberAlerts] = useState([]);

  const handlePendingServiceClick = () => {
    if (!member?._id) return;
    const calendarEventIds = (pendingEventServices || [])
      .map((e) => e?.calendarEventId)
      .filter(Boolean);
    navigate("/more/schedule/events", {
      state: {
        filterPreset: { members: [member._id] },
        calendarEventIds,
      },
    });
  };

  const refreshAlerts = () => {
    if (member?._id) {
      dispatch(
        getAlert(member._id, () => {}, (data) => {
          setMemberAlerts(Array.isArray(data) ? data : []);
        }),
      );
    } else {
      setMemberAlerts([]);
    }
  };

  useEffect(() => {
    refreshAlerts();
  }, [member?._id]);

  const activeAlerts = memberAlerts.filter(isAlertVisible);

  const recentTasks = Array.isArray(member?.tasks)
    ? [...member.tasks]
        .sort(
          (a, b) =>
            new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
        )
        .slice(0, 5)
    : [];

  return (
    <>
      <CreateTask
        visible={createTaskVisible}
        onHide={() => {
          getCheckingsFunc();
          setCreateTaskVisible(false);
        }}
        member={member?._id}
      />
      <CreateAlert
        visible={createAlertVisible}
        onHide={() => {
          getCheckingsFunc();
          refreshAlerts();
          setCreateAlertVisible(false);
        }}
        member={member?._id}
      />
      <EditAlert
        visible={editAlertVisible}
        onHide={() => {
          getCheckingsFunc();
          refreshAlerts();
          setEditAlertVisible(false);
          setSelectedAlert(null);
        }}
        alertData={selectedAlert}
      />
      <EditTask
        visible={editTaskVisible}
        onHide={() => {
          getCheckingsFunc();
          setEditTaskVisible(false);
          setSelectedTask(null);
        }}
        taskData={selectedTask}
      />
      <div className={`c-col-12 p-2 border-round-xl ${bgClass}`}>
        {statusMessage && member && (
          <div className="flex align-items-center gap-2 mb-1 px-2 flex-wrap">
            <i
              className={`${statusMessage.icon} text-white`}
              style={{ fontSize: "18px" }}
            />
            <span className="text-white font-bold" style={{ fontSize: "15px" }}>
              {statusMessage.title}
            </span>
            <StatusBadge active={hasGymAccess} label="Gym Access" />
            <StatusBadge active={hasServices} label="Services" />
            {hasOverdueResources && overdueResources?.length > 0 && (
              overdueResources.map((r, i) => (
                <span
                  key={i}
                  className="text-white text-sm px-2 py-1 border-round"
                  style={{ backgroundColor: "rgba(255,140,0,0.75)", fontWeight: 600 }}
                >
                  <i className="pi pi-exclamation-triangle mr-1" style={{ fontSize: "12px" }} />
                  Overdue: {r.resource?.title}
                </span>
              ))
            )}
            {hasPendingServices && (
              <span
                className="text-white text-sm px-2 py-1 border-round cursor-pointer"
                style={{ backgroundColor: "rgba(23,162,184,0.75)", fontWeight: 600 }}
                onClick={handlePendingServiceClick}
                title="Click to purchase pending services at POS"
              >
                <i className="pi pi-calendar mr-1" style={{ fontSize: "12px" }} />
                Pending Services
              </span>
            )}
            {(membershipAccessStatus === "VALID" || membershipAccessStatus === "INVALID") && (
              <MembershipScheduleBadge
                status={membershipAccessStatus}
                scheduleTitle={accessScheduleTitle}
                membershipTypeTitle={membershipTypeTitle}
                reason={membershipAccessReason}
              />
            )}
          </div>
        )}
        <div className="c-grid w-full">

          {/* Column 1: Member profile */}
          <div
            className="c-col-12 md:c-col-4 cursor-pointer"
            onClick={() => member?._id && navigate(`/members/${member._id}`)}
          >
            <MemberProfile
              user={member}
              loading={loading}
              textClassName="text-white"
              agreementStatus={agreementStatus}
            />
          </div>

          {/* Column 2: Alerts */}
          <div className="c-col-12 md:c-col-4 h-full border-left-1 border-white-alpha-40">
            <div className="flex justify-content-end align-items-center mb-1">
              <WhiteButton
                label="Add Alert"
                onClick={() => setCreateAlertVisible(true)}
              />
            </div>
            <div className="flex flex-column gap-1 pl-2">
              {activeAlerts.slice(-5).map((item, i) => (
                <div
                  key={i}
                  className="cursor-pointer border-round px-3 py-1 text-white text-sm font-medium"
                  style={{
                    backgroundColor: item.colorType || "rgba(255,255,255,0.15)",
                    transition: "filter 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.88)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                  onClick={() => {
                    setSelectedAlert(item);
                    setEditAlertVisible(true);
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Tasks */}
          <div className="c-col-12 md:c-col-4 h-full border-left-1 border-white-alpha-40">
            <div className="flex justify-content-end align-items-center mb-1">
              <WhiteButton
                label="Add Task"
                onClick={() => setCreateTaskVisible(true)}
              />
            </div>
            <div className="flex flex-column gap-1 pl-2">
              {recentTasks.map((item, i) => (
                <div
                  key={i}
                  className="cursor-pointer border-round px-3 py-1 text-white text-sm font-medium"
                  style={{
                    border: "1px solid rgba(255,255,255,0.5)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
                  onClick={() => {
                    setSelectedTask(item);
                    setEditTaskVisible(true);
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default React.memo(CheckinDetails);

function StatusBadge({ active, label }) {
  return (
    <span
      className="text-white text-sm px-2 py-1 border-round"
      style={{
        backgroundColor: active ? "rgba(40,167,69,0.5)" : "rgba(220,53,69,0.5)",
        fontWeight: 500,
      }}
    >
      {active ? `✓ ${label}` : `✗ No ${label}`}
    </span>
  );
}

function WhiteButton({ label, onClick }) {
  return (
    <button
      className="status-outline-btn border-1 border-white-alpha-40 ml-auto"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MembershipScheduleBadge({ status, scheduleTitle, membershipTypeTitle, reason }) {
  const isValid = status === "VALID";
  const label = isValid ? "Schedule: Allowed" : "Schedule: Denied";
  const subtitle = scheduleTitle || membershipTypeTitle || "";
  const tooltipText = reason || subtitle || (isValid ? "Access permitted by membership schedule" : "Access denied by membership schedule");

  return (
    <span
      className="text-white text-sm px-2 py-1 border-round"
      style={{
        backgroundColor: isValid ? "rgba(40,167,69,0.75)" : "rgba(220,53,69,0.75)",
        fontWeight: 600,
        cursor: reason ? "help" : "default",
      }}
      title={tooltipText}
    >
      <i
        className={`pi ${isValid ? "pi-calendar-check" : "pi-calendar-times"} mr-1`}
        style={{ fontSize: "12px" }}
      />
      {label}
      {subtitle ? ` — ${subtitle}` : ""}
    </span>
  );
}

function isAlertVisible(alert) {
  const status = String(alert?.status || "").toUpperCase();
  return alert?.isActive !== false && alert?.active !== false && status !== "INACTIVE";
}
