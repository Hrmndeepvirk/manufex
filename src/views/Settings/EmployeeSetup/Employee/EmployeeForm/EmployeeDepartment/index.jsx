import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  getEmployeeDepartments,
  deleteEmployeeDepartment,
} from "@store/settings/employeeSetup/manageEmployee/employeeDepartmentActions";
import EmployeeDepartmentForm from "./EmployeeDepartmentForm";

function EmployeeDepartment({ employee, onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const data = useSelector(
    (state) => state.settings.employeeSetup.employeeDepartments,
  );

  const onHide = () => {
    setShowForm(false);
  };

  const onShow = () => {
    setShowForm(true);
  };

  useEffect(() => {
    getDepartments();
  }, [dispatch, employee]);

  function getDepartments() {
    if (employee) {
      dispatch(getEmployeeDepartments(employee?._id));
    }
  }

  let columns = [
    {
      field: "department",
      header: "Department",
      body: (row) => `${row?.department?.title}`,
      sortable: true,
    },
    { field: "wage", header: "Wage", isCurrency: true },
  ];

  const onEdit = (id) => {
    setShowForm(true);
    setSelectedId(id);
  };

  const onDelete = (id) => {
    if (employee) {
      dispatch(deleteEmployeeDepartment(employee?._id, id));
    }
  };

  const handleNext = () => {
    onSaveSuccess?.();
  };

  return (
    <>
      <EmployeeDepartmentForm
        show={showForm}
        onHide={onHide}
        departmentId={selectedId}
        employeeDepartmentList={data}
        getDepartments={getDepartments}
      />
      <ListPageLayout
        buttonLabel="Add Employee Department"
        onClick={onShow}
        addPadding
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
        footerContent={
          <div className="flex justify-content-end p-3">
            <button
              type="button"
              className="p-button p-component"
              onClick={() => navigate(-1)}
            >
              <span className="p-button-label">Back</span>
            </button>
            <button
              type="button"
              className="p-button p-component p-button-primary ml-2"
              onClick={handleNext}
            >
              <span className="p-button-label">Next</span>
            </button>
          </div>
        }
      />
    </>
  );
}
export default React.memo(EmployeeDepartment);
