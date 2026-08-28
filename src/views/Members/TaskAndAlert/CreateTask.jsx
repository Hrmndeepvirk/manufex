import React, { useEffect, useMemo, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomInput from "@inputs/CustomInput";
import CustomPhoneInput from "@inputs/CustomPhoneInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import formValidation, { showFormErrors } from "@formValidations";
import { addTask } from "@store/member/taskActions";
import { getDepartments } from "@store/settings/employeeSetup/departmentActions";
import { useDispatch, useSelector } from "react-redux";
import { useResourceRequest } from "../../../hooks/useResourceRequest";

function CreateTask({ visible, onHide, member, onTaskCreated }) {
  const dispatch = useDispatch();
  const departments = useSelector(
    (state) => state.settings.employeeSetup.departments || [],
  );

  const INITIAL_DATA = {
    member: null,
    taskType: member ? "FOLLOWUP" : "TODO",
    todoType: "",
    audienceType: "MEMBER",
    nonMemberName: "",
    nonMemberOrganization: "",
    nonMemberPhone: "",
    nonMemberEmail: "",
    preferredContactMethods: [],
    assigneeScope: "EMPLOYEE",
    assigneeDepartments: [],
    assigneeEmployees: [],
    assignMode: "",
    dueDate: null,
    title: "",
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ ...INITIAL_DATA });

  const minDueDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    if (visible) {
      setData((prev) => ({
        ...INITIAL_DATA,
        member: member || null,
        audienceType: member ? "MEMBER" : "MEMBER",
      }));
    }
  }, [visible, member]);

  useEffect(() => {
    if (visible && !departments?.length) {
      dispatch(getDepartments());
    }
  }, [visible, departments?.length, dispatch]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const togglePreferredMethod = (method) => {
    setData((prev) => {
      const current = new Set(prev.preferredContactMethods || []);
      if (current.has(method)) {
        current.delete(method);
      } else {
        current.add(method);
      }
      return {
        ...prev,
        preferredContactMethods: Array.from(current),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ignoreFields = ["preferredContactMethods", "assignMode"];

    // Ignore todo-specific fields when not TODO
    if (data.taskType !== "TODO") ignoreFields.push("todoType");

    // Ignore follow-up-specific fields when not FOLLOWUP
    if (data.taskType !== "FOLLOWUP") {
      ignoreFields.push(
        "audienceType",
        "member",
        "nonMemberName",
        "nonMemberOrganization",
        "nonMemberPhone",
        "nonMemberEmail",
      );
    }

    // Ignore non-member fields when audience is MEMBER
    if (data.taskType === "FOLLOWUP" && data.audienceType === "MEMBER") {
      ignoreFields.push(
        "nonMemberName",
        "nonMemberOrganization",
        "nonMemberPhone",
        "nonMemberEmail",
      );
    }

    // Ignore member when audience is NON_MEMBER or when member is pre-set
    if (data.audienceType === "NON_MEMBER" || member) {
      ignoreFields.push("member");
    }

    // Ignore the unused assignee field based on scope
    if (data.assigneeScope === "EMPLOYEE") {
      ignoreFields.push("assigneeDepartments");
    } else {
      ignoreFields.push("assigneeEmployees");
    }

    // Ignore member for TODO tasks
    if (data.taskType === "TODO") {
      ignoreFields.push("member");
    }

    if (showFormErrors(data, setData, ignoreFields)) {
      // Build clean payload - only send relevant fields
      const payload = {
        taskType: data.taskType,
        dueDate: data.dueDate,
        title: data.title,
      };

      if (data.description) payload.description = data.description;

      // TODO-specific
      if (data.taskType === "TODO" && data.todoType) {
        payload.todoType = data.todoType;
      }

      // FOLLOWUP-specific
      if (data.taskType === "FOLLOWUP") {
        payload.audienceType = data.audienceType;
        if (data.audienceType === "MEMBER" && data.member) {
          payload.member = data.member;
        }
        if (data.audienceType === "NON_MEMBER") {
          if (data.nonMemberName) payload.nonMemberName = data.nonMemberName;
          if (data.nonMemberOrganization)
            payload.nonMemberOrganization = data.nonMemberOrganization;
          if (data.nonMemberPhone) payload.nonMemberPhone = data.nonMemberPhone;
          if (data.nonMemberEmail) payload.nonMemberEmail = data.nonMemberEmail;
        }
        if (data.preferredContactMethods?.length) {
          payload.preferredContactMethods = data.preferredContactMethods;
        }
      }

      // Member context (when opened from member page)
      if (member) payload.member = member;

      // Assignee
      payload.assigneeScope = data.assigneeScope;
      if (data.assigneeScope === "DEPARTMENT") {
        payload.assigneeDepartments = data.assigneeDepartments;
      } else {
        payload.assigneeEmployees = data.assigneeEmployees;
      }

      // Assign mode only when multiple assignees
      const assigneeCount =
        data.assigneeScope === "DEPARTMENT"
          ? (data.assigneeDepartments || []).length
          : (data.assigneeEmployees || []).length;
      if (assigneeCount > 1 && data.assignMode) {
        payload.assignMode = data.assignMode;
      }

      dispatch(
        addTask(payload, setLoading, (success, formErrors) => {
          if (success) {
            if (onTaskCreated) onTaskCreated();
            onHide();
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }),
      );
    }
  };

  const { buttons: requestButtons } = useResourceRequest({
    permission: "REQUEST-TASKS",
    targetCollection: "TASK",
    id: null,
    data,
    setData,
    ignore: ["formErrors"],
  });

  return (
    <CustomDialog
      title="Create Task"
      visible={visible}
      onHide={onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLoading={loading}
        onCancel={onHide}
        buttons={requestButtons}
      >
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="taskType"
          label="Task Type"
          options={[
            { _id: "TODO", title: "To-Do" },
            { _id: "FOLLOWUP", title: "Follow-Up" },
          ]}
          col={12}
        />

        {data.taskType === "TODO" && (
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="todoType"
            label="Type"
            options={[
              { _id: "CHECKLISTS", title: "Checklists" },
              { _id: "REMINDER", title: "Reminder" },
              { _id: "RUN_REPORT", title: "Run Report" },
              { _id: "ACCOUNT_REVIEW", title: "Account Review" },
              { _id: "MAINTENANCE", title: "Maintenance" },
            ]}
            col={12}
          />
        )}

        {data.taskType === "FOLLOWUP" && (
          <>
            <CustomDropdown
              data={data}
              onChange={handleChange}
              name="audienceType"
              label="Member or Non Member"
              options={[
                { _id: "MEMBER", title: "Member" },
                { _id: "NON_MEMBER", title: "Non Member" },
              ]}
              col={12}
            />

            {data.audienceType === "MEMBER" ? (
              <>
                {/* {!member && ( */}
                <CustomDropdown
                  data={data}
                  onChange={handleChange}
                  name="member"
                  label="Member"
                  optionsType="members"
                  col={12}
                />
                {/* )} */}
              </>
            ) : (
              <>
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="nonMemberName"
                  label="Name"
                  col={6}
                />
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="nonMemberOrganization"
                  label="Company/Organization"
                  col={6}
                />
                <CustomPhoneInput
                  data={data}
                  onChange={handleChange}
                  name="nonMemberPhone"
                  label="Phone Number"
                  col={6}
                />
                <CustomInput
                  data={data}
                  onChange={handleChange}
                  name="nonMemberEmail"
                  label="Email"
                  col={6}
                />
              </>
            )}

            <div className="c-col-12">
              <div className="text-sm text-color-secondary mb-2">
                Preferred Contact Method
              </div>
              <div className="c-grid">
                <CustomCheckbox
                  label="Call"
                  name="prefCall"
                  value={data.preferredContactMethods.includes("CALL")}
                  onChange={() => togglePreferredMethod("CALL")}
                  col={2}
                />
                <CustomCheckbox
                  label="Text"
                  name="prefText"
                  value={data.preferredContactMethods.includes("TEXT")}
                  onChange={() => togglePreferredMethod("TEXT")}
                  col={2}
                />
                <CustomCheckbox
                  label="Email"
                  name="prefEmail"
                  value={data.preferredContactMethods.includes("EMAIL")}
                  onChange={() => togglePreferredMethod("EMAIL")}
                  col={2}
                />
              </div>
            </div>
          </>
        )}

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="assigneeScope"
          label="Department or Individual Employee"
          options={[
            { _id: "DEPARTMENT", title: "Department" },
            { _id: "EMPLOYEE", title: "Individual Employee" },
          ]}
          col={12}
        />

        {data.assigneeScope === "DEPARTMENT" ? (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="assigneeDepartments"
            label="Departments"
            options={departments}
            optionLabel="title"
            col={12}
          />
        ) : (
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="assigneeEmployees"
            label="Staff"
            optionsType="employees"
            col={12}
          />
        )}

        {((data.assigneeScope === "DEPARTMENT" &&
          (data.assigneeDepartments || []).length > 1) ||
          (data.assigneeScope === "EMPLOYEE" &&
            (data.assigneeEmployees || []).length > 1)) && (
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="assignMode"
            label="Assign individually or as a group"
            options={[
              { _id: "INDIVIDUAL", title: "Individually" },
              { _id: "GROUP", title: "As a group" },
            ]}
            col={12}
          />
        )}

        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="dueDate"
          label="Due Date"
          dateString
          col={12}
          required
          minDate={minDueDate}
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          label="Title"
          col={12}
          required
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
          label="Additional Details"
          col={12}
        />
      </CustomForm>
    </CustomDialog>
  );
}

export default React.memo(CreateTask);
