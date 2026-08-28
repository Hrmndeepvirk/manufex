import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import {
  getShiftCoverRequests,
  acceptShiftCoverRequest,
  cancelShiftCoverRequest,
} from "@store/settings/employeeSetup/shiftCoverRequestActions";
import { dismissShiftCoverRequest } from "@store/settings/employeeSetup/shiftCoverRequestSlice";
import { getFilteredEmployees } from "@store/helper/helperActions";
import CoverRequestCard from "./CoverRequestCard";
import { Skeleton } from "primereact/skeleton";

const STATUS_OPTIONS = [
  { _id: "PENDING", title: "Pending" },
  { _id: "ACCEPTED", title: "Accepted" },
  { _id: "CANCELLED", title: "Cancelled" },
  { _id: "EXPIRED", title: "Expired" },
];

export default function CoverRequestsTab() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user?.profile);
  const departments = useSelector((state) => state.dropdown?.departments ?? []);
  const filteredEmployees = useSelector(
    (state) => state.helper?.filteredEmployees ?? [],
  );
  const list = useSelector((state) => state.shiftCoverRequest.list);
  const dismissedIds = useSelector(
    (state) => state.shiftCoverRequest.dismissedIds,
  );

  const [filters, setFilters] = useState({
    department: null,
    employee: null,
    status: "PENDING",
  });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState({ id: null, kind: null });

  const empDeptMapRef = useRef({});
  const initializedRef = useRef(false);
  const myDepartmentsRef = useRef(null);

  // Build employee -> departments cache from helper response
  useEffect(() => {
    (filteredEmployees || []).forEach((emp) => {
      if (emp.departments?.length) {
        empDeptMapRef.current[emp._id] = emp.departments;
      }
    });
  }, [filteredEmployees]);

  // Fetch employee list scoped to the chosen department
  useEffect(() => {
    const params = {};
    if (filters.department) params.department = filters.department;
    dispatch(getFilteredEmployees(params, () => {}));
  }, [dispatch, filters.department]);

  // Pre-select logged-in employee + their first department, matching ShiftsTab
  useEffect(() => {
    if (initializedRef.current) return;
    if (!profile?._id || !filteredEmployees?.length) return;
    const emp = filteredEmployees.find((e) => e._id === profile._id);
    if (emp?.departments?.length) {
      myDepartmentsRef.current = emp.departments;
      setFilters((prev) => ({
        ...prev,
        department: prev.department || emp.departments[0],
        employee: prev.employee || profile._id,
      }));
      initializedRef.current = true;
    }
  }, [profile, filteredEmployees]);

  // Fetch cover requests whenever filter scope changes
  useEffect(() => {
    if (!filters.department) return;
    dispatch(
      getShiftCoverRequests(
        {
          department: filters.department,
          status: filters.status || undefined,
        },
        setLoading,
      ),
    );
  }, [dispatch, filters.department, filters.status]);

  const employeeOptions = useMemo(() => {
    return (filteredEmployees || []).map((emp) => ({
      _id: emp._id,
      title: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
    }));
  }, [filteredEmployees]);

  const departmentOptions = useMemo(() => {
    if (!filters.employee) return departments || [];
    const cachedDepts = empDeptMapRef.current[filters.employee];
    if (cachedDepts?.length) {
      return (departments || []).filter((dept) =>
        cachedDepts.includes(dept._id),
      );
    }
    return departments || [];
  }, [departments, filters.employee]);

  // Apply employee filter + client-side dismiss locally so backend cache stays warm
  const visibleRequests = useMemo(() => {
    const dismissed = new Set(dismissedIds || []);
    return (list || []).filter((req) => {
      if (dismissed.has(req._id) && req.status === "PENDING") return false;
      if (filters.employee) {
        const reqId = String(req.requestedBy?._id || req.requestedBy);
        if (reqId !== String(filters.employee)) return false;
      }
      return true;
    });
  }, [list, filters.employee, dismissedIds]);

  const onAccept = (req) => {
    setBusy({ id: req._id, kind: "accept" });
    dispatch(
      acceptShiftCoverRequest(req._id, null, () => {
        setBusy({ id: null, kind: null });
      }),
    );
  };

  const onCancel = (req) => {
    setBusy({ id: req._id, kind: "cancel" });
    dispatch(
      cancelShiftCoverRequest(req._id, null, () => {
        setBusy({ id: null, kind: null });
      }),
    );
  };

  const onIgnore = (req) => {
    dispatch(dismissShiftCoverRequest(req._id));
  };

  return (
    <>
      <CustomCard title="Cover Requests">
        <CustomDropdown
          name="department"
          data={filters}
          onChange={({ name, value }) =>
            setFilters((prev) => ({ ...prev, [name]: value }))
          }
          col={3}
          options={departmentOptions}
          clearable
          hideLabel
        />
        <CustomDropdown
          name="employee"
          data={filters}
          onChange={({ name, value }) =>
            setFilters((prev) => ({ ...prev, [name]: value }))
          }
          col={3}
          options={employeeOptions}
          placeholder="Filter by employee"
          clearable
          hideLabel
        />
        <CustomDropdown
          name="status"
          data={filters}
          onChange={({ name, value }) =>
            setFilters((prev) => ({ ...prev, [name]: value }))
          }
          col={3}
          options={STATUS_OPTIONS}
          placeholder="Status"
          hideLabel
          clearable
        />
      </CustomCard>

      <CustomCard title={`Requests${filters.department ? "" : " — select a department"}`}>
        <div className="c-col-12">
          {loading ? (
            <div className="c-grid">
              {[0, 1, 2].map((i) => (
                <div className="c-col-12 md:c-col-6 lg:c-col-4" key={i}>
                  <Skeleton height="9rem" />
                </div>
              ))}
            </div>
          ) : visibleRequests.length === 0 ? (
            <div className="text-center text-color-secondary p-4">
              No cover requests to show.
            </div>
          ) : (
            <div className="c-grid">
              {visibleRequests.map((req) => (
                <CoverRequestCard
                  key={req._id}
                  request={req}
                  currentUserId={profile?._id}
                  onAccept={onAccept}
                  onCancel={onCancel}
                  onIgnore={onIgnore}
                  busy={busy.id === req._id ? busy.kind : null}
                />
              ))}
            </div>
          )}
        </div>
      </CustomCard>
    </>
  );
}
