import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomInput from "@inputs/CustomInput";
import CustomDropdown from "@inputs/CustomDropdown";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { getDateTime } from "@utils/dateTime";
import { capitalizeCamelCase, capitalizeDashCase, formatEnum } from "@utils/common";
import {
  getRequest,
  approveRequest,
  rejectRequest,
  getRequests,
} from "@store/settings/employeeSetup/requestActions";

const COLLECTION_ROUTE_MAP = {
  // Member Setup
  RESOURCE:          "/settings/member-setup/resource",
  RESOURCE_TYPE:     "/settings/member-setup/resource-type",
  MEMBERSHIP_TYPE:   "/settings/member-setup/manage-membership",
  DISCOUNT:          "/settings/member-setup/access-schedule",
  // Employee Setup
  DEPARTMENT:        "/settings/employee-setup/department",
  SECURITY_ROLE:     "/settings/employee-setup/security-role",
  COMMISSION_GROUP:  "/settings/employee-setup/commission-group",
  // Members
  MEMBER:            "/members",
  TASK:              "/members",
  ALERT:             "/members",
  // Schedule Setup / Calendar
  CALENDAR_EVENT:    "/calendar/event",
  EVENT_CATEGORY:    "/settings/schedule-setup/event-category",
  CLASS:             "/settings/schedule-setup/class",
  CLASS_SETUP:       "/settings/schedule-setup/class",
  // Point of Sale
  CATALOG_ITEM:      "/settings/point-of-sale/catalog-item",
  PROFIT_CENTER:     "/settings/point-of-sale/profit-center",
  VENDOR:            "/settings/point-of-sale/vendor",
};

const BACK_TO_LIST = "/settings/employee-setup?tab=requests";

function RequestForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname } = useLocation();
  const isStandaloneRoute = !pathname.startsWith("/settings/");

  const [pageLoading, setPageLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [request, setRequest] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(
        getRequest(id, setPageLoading, (res) => {
          setRequest(res);
          setEditedData(res?.changedData || {});
        }),
      );
    }
  }, [id, dispatch]);

  const normalizedStatus = request?.status?.toLowerCase();
  const isApproved = normalizedStatus === "approved";
  const isRejected = normalizedStatus === "rejected";
  const isActioned = isApproved || isRejected;
  const actionedTooltip = isApproved
    ? "Request already approved"
    : isRejected
      ? "Request already rejected"
      : "";

  const goBack = () => {
    dispatch(getRequests());
    if (isStandaloneRoute) {
      navigate(-1);
    } else {
      navigate(BACK_TO_LIST);
    }
  };

  const handleApprove = () => {
    customConfirmDialog({
      message: "Approve this request?",
      accept: () => {
        dispatch(
          approveRequest(id, editedData, setApproveLoading, (success) => {
            if (success) goBack();
          }),
        );
      },
      reject: () => {},
    });
  };

  const handleReject = () => {
    customConfirmDialog({
      message: "Reject this request?",
      accept: () => {
        dispatch(
          rejectRequest(id, setRejectLoading, (success) => {
            if (success) goBack();
          }),
        );
      },
      reject: () => {},
    });
  };

  const handleFieldChange = ({ name, value }) => {
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApproveAndEdit = () => {
    const route = COLLECTION_ROUTE_MAP[request?.targetCollection];
    const targetId = request?.targetItem?._id || request?.targetItem;
    customConfirmDialog({
      message: "Approve this request and go to the edit page?",
      accept: () => {
        dispatch(
          approveRequest(id, editedData, setApproveLoading, (success) => {
            if (success && route && targetId) {
              navigate(`${route}/${targetId}`);
            } else if (success) {
              goBack();
            }
          }),
        );
      },
      reject: () => {},
    });
  };

  const statusColor = (() => {
    const s = request?.status?.toLowerCase();
    if (s === "approved") return "var(--color-success)";
    if (s === "rejected") return "var(--color-danger)";
    if (s === "pending") return "var(--color-warning)";
    return "var(--text-color-primary)";
  })();

  const Field = ({ label, value }) => (
    <div className="c-col-12 md:c-col-6 flex flex-column gap-1">
      <span className="text-sm text-color-secondary">{label}</span>
      <span className="font-semibold">
        {value === null || value === undefined || value === "" ? "-" : value}
      </span>
    </div>
  );

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return "-";
      // Array of enriched refs: [{ _id, title, ...rest }]
      if (value[0] && typeof value[0] === "object" && "title" in value[0]) {
        return value
          .map((item) => {
            const label = item.title || item._id;
            return item.quantity !== undefined ? `${label} (x${item.quantity})` : label;
          })
          .join(", ");
      }
      return value.join(", ");
    }
    // Single enriched ref: { _id, title }
    if (typeof value === "object" && "_id" in value && "title" in value) {
      return value.title || value._id;
    }
    // pastDue object: { value, type }
    if (typeof value === "object" && "value" in value && "type" in value) {
      return `${value.value} ${value.type.charAt(0) + value.type.slice(1).toLowerCase()}`;
    }
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "string" && /^[A-Z][A-Z0-9_]*$/.test(value)) return formatEnum(value);
    return value.toString();
  };

  const isSameValue = (a, b) => {
    if (a === b) return true;
    if (
      (a === null || a === undefined || a === "") &&
      (b === null || b === undefined || b === "")
    ) {
      return true;
    }
    if (typeof a === "object" && typeof b === "object") {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch {
        return false;
      }
    }
    return false;
  };

  const renderDataChanges = () => {
    const changedData = request?.changedData;
    const displayData = request?.displayData;
    const previousData = request?.targetItem;

    if (!changedData) return <div className="c-col-12">-</div>;
    if (typeof changedData === "string") {
      return <div className="c-col-12">{changedData}</div>;
    }

    const entries = Object.entries(changedData);
    if (entries.length === 0) return <div className="c-col-12">-</div>;

    const hasTargetItem = !!previousData;

    return (
      <div className="c-col-12 flex flex-column gap-2">
        <div className="flex gap-2 text-sm font-semibold text-color-secondary px-2">
          <div style={{ flex: "0 0 25%" }}>Field</div>
          {hasTargetItem && <div style={{ flex: 1 }}>Previous</div>}
          {hasTargetItem && <div style={{ flex: "0 0 32px", textAlign: "center" }}></div>}
          <div style={{ flex: 1 }}>New</div>
        </div>
        {entries.map(([key, rawNewValue]) => {
          const displayValue = displayData ? displayData[key] : rawNewValue;
          const prevValue = previousData ? previousData[key] : undefined;
          const hasPrev = previousData && key in previousData;
          const changed = hasPrev && !isSameValue(prevValue, rawNewValue);
          const isEnum = typeof rawNewValue === "string" && /^[A-Z][A-Z0-9_]*$/.test(rawNewValue);
          const isText = typeof rawNewValue === "string" && !displayValue?._id && !isEnum;
          const isBool = typeof rawNewValue === "boolean";
          const isEditable = !isActioned && (isText || isBool);

          return (
            <div
              key={key}
              className="flex gap-2 align-items-center p-2 border-1 border-round-sm"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="font-semibold" style={{ flex: "0 0 25%" }}>
                {capitalizeCamelCase(key)}
              </div>
              {hasTargetItem && (
                <div
                  style={{
                    flex: 1,
                    color: changed ? "var(--color-danger)" : "var(--text-color-primary)",
                    textDecoration: changed ? "line-through" : "none",
                  }}
                >
                  {hasPrev ? formatValue(prevValue) : "—"}
                </div>
              )}
              {hasTargetItem && (
                <div
                  className="text-color-secondary"
                  style={{ flex: "0 0 32px", textAlign: "center" }}
                >
                  <i className="pi pi-arrow-right" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                {isEditable && isText ? (
                  <CustomInput
                    data={editedData}
                    onChange={handleFieldChange}
                    name={key}
                    col={12}
                  />
                ) : isEditable && isBool ? (
                  <CustomDropdown
                    data={editedData}
                    onChange={handleFieldChange}
                    name={key}
                    booleanOptions
                    col={12}
                  />
                ) : (
                  <span
                    className="font-semibold"
                    style={{ color: changed ? "var(--color-success)" : "var(--text-color-primary)" }}
                  >
                    {formatValue(displayValue)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <FormPageLayout
        backText="Requests"
        backTo={isStandaloneRoute ? undefined : BACK_TO_LIST}
        pageLoading={pageLoading}
        hideCancel
      >
        <CustomCard title="Request Details">
          <Field
            label="Request Type"
            value={
              request?.requestType
                ? capitalizeDashCase(request.requestType)
                : null
            }
          />
          <Field
            label="Employee"
            value={
              request?.createdBy?.title ||
              (request?.createdBy?.firstName || request?.createdBy?.lastName
                ? `${request.createdBy.firstName || ""} ${request.createdBy.lastName || ""}`.trim()
                : null)
            }
          />
          {request?.targetItem && (
            <Field
              label="Target Item"
              value={request.targetItem?.title}
            />
          )}
          <div className="c-col-12 md:c-col-6 flex flex-column gap-1">
            <span className="text-sm text-color-secondary">Status</span>
            <span
              className="font-semibold capitalize"
              style={{ color: statusColor }}
            >
              {request?.status || "-"}
            </span>
          </div>
          <Field
            label="Created At"
            value={request?.createdAt ? getDateTime(request.createdAt) : null}
          />
        </CustomCard>

        <CustomCard title="Data Changes">{renderDataChanges()}</CustomCard>

        {request?.rejectionReason && (
          <CustomCard title="Rejection Reason">
            <div className="c-col-12">{request.rejectionReason}</div>
          </CustomCard>
        )}

        <div
          className="c-col-12 flex gap-2 justify-content-end"
          title={actionedTooltip || undefined}
        >
          <PrimaryButton
            label="Reject"
            icon="pi pi-times"
            severity="danger"
            onClick={handleReject}
            loading={rejectLoading}
            disabled={approveLoading || isActioned}
          />
          <PrimaryButton
            label="Approve"
            icon="pi pi-check"
            onClick={handleApprove}
            loading={approveLoading}
            disabled={rejectLoading || isActioned}
          />
          {COLLECTION_ROUTE_MAP[request?.targetCollection] && (
            <PrimaryButton
              label="Approve & Edit"
              icon="pi pi-pencil"
              onClick={handleApproveAndEdit}
              loading={approveLoading}
              disabled={rejectLoading || isActioned}
            />
          )}
        </div>
      </FormPageLayout>
    </>
  );
}

export default React.memo(RequestForm);
