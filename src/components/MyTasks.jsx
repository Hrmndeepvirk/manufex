import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomTextArea from "@inputs/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeTasks, updateEmployeeTask } from "@store/task/taskActions";
import { getRequests } from "@store/settings/employeeSetup/requestActions";
import moment from "moment";
import CustomCheckbox from "../shared/inputs/CustomCheckbox";
import {
  formatEnum,
  capitalizeDashCase,
  capitalizeSnakeCase,
} from "../utils/common";

const TAB_OPTIONS = [
  { id: "all", label: "All" },
  { id: "TODO", label: "To-Do" },
  { id: "FOLLOWUP", label: "Follow-Up" },
  { id: "REQUESTS", label: "Requests" },
];

const REQUEST_STATUS_COLORS = {
  pending: "var(--color-warning)",
  approved: "var(--color-success)",
  rejected: "var(--color-danger)",
};

const STATUS_OPTIONS = [
  { _id: "INCOMPLETE", title: "Incomplete" },
  { _id: "IN_PROGRESS", title: "In Progress" },
  { _id: "COMPLETED", title: "Completed" },
];

const CALL_OUTCOME_OPTIONS = [
  { _id: "ANSWERED", title: "Call Answered" },
  { _id: "LEFT_VOICEMAIL", title: "Left Voicemail" },
  { _id: "CALL_FAILED", title: "Call Failed" },
];

function MyTasks({ visible, onHide, onAddNewTask }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.task.employeeTasks || []);
  const requests = useSelector(
    (state) => state.settings.employeeSetup.requests || [],
  );
  const _requests = requests?.filter((r) => r.status === "PENDING") || [];
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [notesMap, setNotesMap] = useState({});
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [saveNotesLoading, setSaveNotesLoading] = useState(false);

  const isRequestsTab = activeTab === "REQUESTS";

  const fetchTasks = useCallback(() => {
    dispatch(getEmployeeTasks(setLoading, true));
  }, [dispatch]);

  const fetchRequests = useCallback(() => {
    dispatch(getRequests(setRequestsLoading));
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      fetchTasks();
    }
  }, [visible, fetchTasks]);

  useEffect(() => {
    if (visible && isRequestsTab) {
      fetchRequests();
    }
  }, [visible, isRequestsTab, fetchRequests]);

  useEffect(() => {
    const map = {};
    tasks.forEach((task) => {
      map[task._id] = task.notes || "";
    });
    setNotesMap(map);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (!includeCompleted) {
      result = result.filter((task) => task.status !== "COMPLETED");
    }
    if (activeTab !== "all") {
      result = result.filter((task) => task.taskType === activeTab);
    }
    return result;
  }, [activeTab, tasks, includeCompleted]);

  const handleStatusChange = (task, nextStatus) => {
    if (task.status === nextStatus) return;

    if (nextStatus === "COMPLETED") {
      customConfirmDialog({
        message: "Mark this task as completed?",
        accept: () => {
          dispatch(
            updateEmployeeTask(task._id, { status: "COMPLETED" }, null, () => {
              fetchTasks();
            }),
          );
        },
      });
      return;
    }

    if (nextStatus === "INCOMPLETE") {
      customConfirmDialog({
        message: "Mark this task as incomplete?",
        accept: () => {
          dispatch(
            updateEmployeeTask(task._id, { status: "INCOMPLETE" }, null, () => {
              fetchTasks();
            }),
          );
        },
      });
      return;
    }

    dispatch(
      updateEmployeeTask(task._id, { status: nextStatus }, null, () => {
        fetchTasks();
      }),
    );
  };

  const handleCallOutcomeChange = (task, value) => {
    const updateData = { callOutcome: value };
    if (value === "ANSWERED") {
      updateData.followUpDate = null;
    }
    dispatch(
      updateEmployeeTask(task._id, updateData, null, () => {
        fetchTasks();
      }),
    );
  };

  const handleFollowUpDateChange = (task, value) => {
    dispatch(
      updateEmployeeTask(task._id, { followUpDate: value }, null, () => {
        fetchTasks();
      }),
    );
  };

  const handleNotesChange = (taskId, value) => {
    setNotesMap((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleSaveNotes = (taskId) => {
    const notes = notesMap[taskId];

    dispatch(
      updateEmployeeTask(taskId, { notes }, setSaveNotesLoading, () => {
        fetchTasks();
      }),
    );
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const getDisplayName = (task) => {
    if (task.audienceType === "NON_MEMBER") {
      return task.nonMemberName || "Non-Member";
    }
    return task.memberName || "N/A";
  };

  const handleHide = () => {
    setExpandedIds([]);
    setActiveTab("all");
    onHide();
  };

  const getRequestEmployeeName = (request) => {
    const createdBy = request?.createdBy;
    if (!createdBy) return "-";
    if (createdBy.title) return createdBy.title;
    const fullName = `${createdBy.firstName || ""} ${createdBy.lastName || ""}`.trim();
    return fullName || "-";
  };

  const getRequestTargetItem = (request) =>
    request?.targetItem?.title ||
    request?.targetItem?.name ||
    request?.targetItemName ||
    (typeof request?.targetItem === "string" ? request.targetItem : "-");

  const handleViewRequest = (id) => {
    handleHide();
    navigate(`/more/request/${id}`);
  };

  return (
    <CustomDialog
      title="My Tasks"
      visible={visible}
      onHide={handleHide}
      loading={isRequestsTab ? requestsLoading : loading}
      size="large"
    >
      <div className="flex justify-content-between mb-3">
        <div className="flex gap-2">
          {TAB_OPTIONS.map((tab) => (
            <span key={tab.id} className="relative inline-block">
              <PrimaryButton
                type="button"
                severity="secondary"
                label={tab.label}
                className={`p-button p-component p-button-sm ${
                  activeTab === tab.id ? "p-button-outlined" : "p-button-text"
                }`}
                onClick={() => setActiveTab(tab.id)}
              />
              {tab.id === "REQUESTS" && _requests.length > 0 && (
                <span className="topbar-icon-badge">{_requests.length}</span>
              )}
            </span>
          ))}
        </div>
        {!isRequestsTab && (
          <div className="my-auto">
            <CustomCheckbox
              value={includeCompleted}
              label={"Include Completed"}
              onChange={(e) => setIncludeCompleted(e.target.checked)}
            />
          </div>
        )}
      </div>

      {isRequestsTab ? (
        <div className="surface-100 border-round p-2">
          <div className="grid text-sm text-color-secondary font-medium p-1">
            <div className="col-2">Request Type</div>
            <div className="col-2">Module</div>
            <div className="col-2">Employee</div>
            <div className="col-3">Item</div>
            <div className="col-2">Status</div>
            <div className="col-1 text-right">Actions</div>
          </div>

          {_requests.length === 0 && (
            <div className="text-center text-color-secondary py-4 text-sm">
              No requests found.
            </div>
          )}

          <div className="flex flex-column gap-2">
            {_requests.map((request) => {
              const status = request?.status || "";
              const color =
                REQUEST_STATUS_COLORS[status.toLowerCase()] ||
                "var(--text-color-primary)";
              return (
                <div
                  key={request._id}
                  className="border-round surface-0 p-1"
                >
                  <div className="grid w-full my-auto align-items-center">
                    <div className="col-2 px-2 text-sm">
                      {request?.requestType
                        ? capitalizeDashCase(request.requestType)
                        : "-"}
                    </div>
                    <div className="col-2 text-sm">
                      {request?.targetCollection
                        ? capitalizeSnakeCase(request.targetCollection)
                        : "-"}
                    </div>
                    <div className="col-2 text-sm">
                      {getRequestEmployeeName(request)}
                    </div>
                    <div className="col-3 text-sm">
                      {getRequestTargetItem(request)}
                    </div>
                    <div className="col-2 text-sm">
                      <span
                        className="font-semibold capitalize"
                        style={{ color }}
                      >
                        {status || "-"}
                      </span>
                    </div>
                    <div className="col-1 flex justify-content-end">
                      <button
                        type="button"
                        className="p-0 border-none bg-transparent cursor-pointer"
                        title="View Request"
                        onClick={() => handleViewRequest(request._id)}
                      >
                        <i className="pi pi-eye text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
      <div className="surface-100 border-round p-2">
        <div className="grid text-sm text-color-secondary font-medium p-1">
          <div className="col-2">Due Date</div>
          <div className="col-2">Task Type</div>
          <div className="col-4">Title</div>
          <div className="col-3">Member Name</div>
          <div className="col-1 text-right"> </div>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center text-color-secondary py-4 text-sm">
            No tasks found.
          </div>
        )}

        <div className="flex flex-column gap-2">
          {filteredTasks.map((task) => (
            <div key={task._id} className="border-round surface-0 p-1">
              <div className="flex align-items-center justify-content-center my-auto">
                <div className="grid w-full my-auto">
                  <div className="col-2 px-2 text-sm text-color-secondary">
                    {task.dueDate
                      ? moment(task.dueDate).format("MM/DD/YYYY")
                      : "—"}
                  </div>

                  <div className="col-2 text-sm">
                    {(() => {
                      const taskTypeLabel =
                        TAB_OPTIONS.find((t) => t.id === task.taskType)
                          ?.label || task.taskType;

                      return task.todoType
                        ? `${taskTypeLabel} (${formatEnum(task.todoType)})`
                        : taskTypeLabel;
                    })()}
                  </div>
                  <div className="col-4 text-sm">
                    <button
                      type="button"
                      className={`my-auto border-none bg-transparent cursor-pointer ${
                        task?.status === "COMPLETED"
                          ? "text-primary line-through"
                          : "text-primary"
                      }`}
                      onClick={() => toggleExpanded(task._id)}
                    >
                      {task?.title}
                    </button>
                  </div>
                  <div className="col-3 text-sm px-2">
                    {getDisplayName(task)}
                  </div>
                  <div className="col-1 flex justify-content-end">
                    <button
                      type="button"
                      className="p-0 border-none bg-transparent cursor-pointer"
                      onClick={() => toggleExpanded(task._id)}
                    >
                      <i
                        className={`pi ${
                          expandedIds.includes(task._id)
                            ? "pi-chevron-up"
                            : "pi-chevron-down"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {expandedIds.includes(task._id) && (
                <div className="text-sm text-color-secondary p-2">
                  <div className="c-grid">
                    <CustomDropdown
                      label="Status"
                      name={`status-${task._id}`}
                      value={task.status}
                      onChange={({ value }) => handleStatusChange(task, value)}
                      options={STATUS_OPTIONS}
                      col={4}
                    />
                    {task.taskType === "FOLLOWUP" &&
                      (task.preferredContactMethods || []).includes("CALL") && (
                        <CustomDropdown
                          label="Call Outcome"
                          name={`callOutcome-${task._id}`}
                          value={task.callOutcome || ""}
                          onChange={({ value }) =>
                            handleCallOutcomeChange(task, value)
                          }
                          options={CALL_OUTCOME_OPTIONS}
                          col={4}
                        />
                      )}
                    {task.taskType === "FOLLOWUP" &&
                      (task.preferredContactMethods || []).includes("CALL") &&
                      ["LEFT_VOICEMAIL", "CALL_FAILED"].includes(
                        task.callOutcome,
                      ) && (
                        <CustomCalendarInput
                          label="Follow-up Date"
                          name={`followUpDate-${task._id}`}
                          value={task.followUpDate || ""}
                          onChange={({ value }) =>
                            handleFollowUpDateChange(task, value)
                          }
                          dateString
                          col={4}
                          minDate={new Date()}
                        />
                      )}
                  </div>

                  <div className="flex flex-column gap-1 text-sm">
                    <div className="mt-2">
                      Member Name: {getDisplayName(task)}
                    </div>
                    <div>Assigned By: {task.assignedByName || "N/A"}</div>
                    {task.description && (
                      <div>Additional Details: {task.description || "—"}</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <CustomTextArea
                      value={notesMap[task._id] || ""}
                      name={`notes-${task._id}`}
                      label="Notes"
                      placeholder="Add notes for this task"
                      onChange={(e) =>
                        handleNotesChange(task._id, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-content-end my-2">
                    <PrimaryButton
                      label="Save Note"
                      severity="secondary"
                      loading={saveNotesLoading}
                      onClick={() => handleSaveNotes(task._id)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {!isRequestsTab && (
        <div className="flex justify-content-end mt-3">
          <PrimaryButton
            label="Add New Task"
            icon="pi pi-plus-circle"
            onClick={onAddNewTask}
          />
        </div>
      )}
    </CustomDialog>
  );
}

export default React.memo(MyTasks);
