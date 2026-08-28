import React, { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployeeClassSetup,
  getEmployeeClassSetups,
} from "@store/settings/employeeSetup/manageEmployee/classSetupActions";
import PayForm from "./PayForm";
import DataViewLayout from "@shared/layout/DataViewLayout";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import { updateEmployeeClassLevels } from "@store/settings/employeeSetup/employeeActions";

import { addOrUpdateEmployeeClassSetup } from "@store/settings/employeeSetup/manageEmployee/classSetupActions";
import { useParams } from "react-router-dom";

function Pay({ employee, refetchEmployee }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedPay, setSelectedPay] = useState(null);
  const [classLevels, setClassLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const onHide = () => {
    setShowForm(false);
    setSelectedPay(null);
  };

  const data = useSelector((state) => state.settings.employeeSetup.classSetup);

  useEffect(() => {
    getClasses();
  }, [dispatch, employee]);

  function getClasses() {
    if (employee) {
      dispatch(getEmployeeClassSetups(employee?._id));
    }
  }

  const [isDefalutLoading, setIsDefaultLoading] = useState(false);

  // TODO: Add a default toggle switch here, in the default field body
  let columns = [
    {
      field: "payType",
      header: "Pay Type",
      sortable: true,
      optionsKey: "payTypes",
    },
    { field: "payTypeDetails", header: "Details", sortable: false },
    {
      field: "Default",
      header: "Default",
      sortable: false,
      type: "boolean",
      body: (row) => (
        <>
          <InputSwitch
            checked={row?.isDefaultPay}
            onChange={(e) => onDefalutChange(row._id, e.value)}
            disabled={isDefalutLoading}
          />
        </>
      ),
    },
  ];

  const onEdit = (id, navigate) => {
    setSelectedPay(id);
    setShowForm(true);
  };

  const onDelete = (id) => {
    if (employee) {
      dispatch(deleteEmployeeClassSetup(employee?._id, id));
    }
  };

  let levels = useSelector((state) => state.dropdown.levels);
  let levelsOptions = levels.filter((item) => item.type === "CLASS");

  const handleClassLevelChange = ({ name, value }) => {
    setClassLevels(value);
    dispatch(
      updateEmployeeClassLevels(
        employee?._id,
        { classLevels: value },
        setLoading,
        (success) => {
          if (success) {
            refetchEmployee();
          }
        },
      ),
    );
  };

  useEffect(() => {
    if (employee?.classLevels?.length) {
      setClassLevels(employee?.classLevels);
    }
  }, [employee]);

  const onSelectClassLevel = () => {
    return (
      <>
        <div className="w-3">
          <CustomMultiSelect
            value={classLevels}
            onChange={handleClassLevelChange}
            name="classLevels"
            loading={loading}
            hideLabel
            options={levelsOptions}
            showPlaceholder
            placeholder="Select class levels"
          />
        </div>
      </>
    );
  };

  function onDefalutChange(selectedPay, isDefaultPay) {
    if (id && selectedPay) {
      dispatch(
        addOrUpdateEmployeeClassSetup(
          id,
          selectedPay,
          { isDefaultPay },
          setIsDefaultLoading,
          (success, formErrors) => {
            if (success) {
              getClasses();
              onHide();
            }
          },
        ),
      );
    }
  }

  return (
    <>
      <PayForm
        showForm={showForm}
        onHide={onHide}
        selectedPay={selectedPay}
        getClasses={getClasses}
      />

      <DataViewLayout
        buttonLabel="Add Pays"
        onClick={() => {
          setShowForm(true);
        }}
        addPadding
        extraContent
        content={onSelectClassLevel()}
        tableData={data}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  );
}
export default React.memo(Pay);
