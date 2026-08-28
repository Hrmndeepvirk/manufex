import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomDropdown from "@inputs/CustomDropdown";
import {
  addOrUpdateAppointmentPay,
  deleteAppointmentPays,
  getAppointmentPays,
} from "@store/settings/employeeSetup/manageEmployee/appointmentPayActions";
import formValidation, { showFormErrors } from "@formValidations";
import { formatEnum } from "@utils/common";
import CustomNumberInput from "@inputs/CustomNumberInput";
import { useCurrencyFormatter } from "../../../../../../../hooks/useCurrencyFormatter";
import { updateEmployeeAppointmentLevels } from "@store/settings/employeeSetup/employeeActions";

function Pay({ employee, refetchEmployee }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedPay, setSelectedPay] = useState(null);
  const [appointmentLevels, setAppointmentLevels] = useState([]);

  const { formatCurrency } = useCurrencyFormatter();

  const appointmentPays = useSelector(
    (state) => state.settings.employeeSetup.appointmentPays,
  );

  const eventOptions = useSelector((state) => state.dropdown.eventSetups);

  const filteredOptions = useMemo(() => {
    let _options = eventOptions.filter((e) => e.eventType === "APPOINTMENT");
    if (appointmentPays.length) {
      let _alreadyAdded = appointmentPays.map((item) => item.event);
      _options = _options.filter((e) => !_alreadyAdded.includes(e._id));
    }

    return _options;
  }, [appointmentPays]);

  let levels = useSelector((state) => state.dropdown.levels);
  let levelsOptions = levels.filter((item) => item.type === "APPOINTMENT");

  useEffect(() => {
    if (employee?._id) {
      dispatch(getAppointmentPays(employee?._id, setLoading));
    }
  }, [employee]);

  useEffect(() => {
    if (employee?.appointmentLevels?.length) {
      setAppointmentLevels(employee?.appointmentLevels);
    }
  }, [employee]);

  const [data, setData] = useState({
    events: [],
    priority: "PER_EVENT",
    pay: 0,
    amountType: "FIXED",
  });

  let columns = useMemo(
    () => [
      {
        header: "Appointment",
        field: "event",
        optionsKey: "eventSetups",
      },
      {
        header: "Priority",
        field: "priority",
        body: (row) => formatEnum(row?.priority),
      },
      {
        header: "Pay",
        field: "pay",
        body: (row) =>
          row?.amountType === "FIXED"
            ? `${formatCurrency(row.pay)}`
            : `${row.pay}%`,
      },
    ],
    [],
  );

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onShow = () => {
    setShowFormDialog(true);
  };

  const onHide = () => {
    setShowFormDialog(false);
    setData({
      events: [],
      priority: "PER_EVENT",
      pay: 0,
      amountType: "FIXED",
    });
    setSelectedPay(null);
  };

  const onEdit = (_, __, row) => {
    setShowFormDialog(true);
    setSelectedPay(row?._id);
    setData(row);
  };

  const onDelete = (id) => {
    dispatch(deleteAppointmentPays(employee?._id, id));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateAppointmentPay(
          employee?._id,
          selectedPay,
          data,
          setSubmitLoading,
          (success, formErrors) => {
            if (success) {
              onHide();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };

  const handleAppointmentLevelChange = ({ name, value }) => {
    setAppointmentLevels(value);
    dispatch(
      updateEmployeeAppointmentLevels(
        employee?._id,
        { appointmentLevels: value },
        setLoading,
        (success) => {
          if (success) {
            refetchEmployee();
          }
        },
      ),
    );
  };

  const onSelectAppointmentLevel = () => {
    return (
      <>
        <CustomMultiSelect
          value={appointmentLevels}
          onChange={handleAppointmentLevelChange}
          name="appointmentLevels"
          loading={loading}
          hideLabel
          options={levelsOptions}
          showPlaceholder
          placeholder="Select appointment levels"
        />
      </>
    );
  };

  return (
    <>
      <CustomDialog
        title={selectedPay ? "Edit Pay" : "Add Pay"}
        visible={showFormDialog}
        onHide={onHide}
      >
        <CustomForm
          onSubmit={onFormSubmit}
          submitLoading={submitLoading}
          onCancel={onHide}
        >
          <CustomMultiSelect
            name="events"
            data={data}
            options={selectedPay ? eventOptions : filteredOptions}
            onChange={handleChange}
            col={12}
          />
          <CustomDropdown
            name="priority"
            data={data}
            onChange={handleChange}
            optionsType="appointmentPayPriorityTypes"
            col={12}
          />
          <CustomNumberInput
            name="pay"
            col={8}
            data={data}
            onChange={handleChange}
          />
          <CustomDropdown
            name="amountType"
            data={data}
            onChange={handleChange}
            optionsType="AmountUnits"
            col={4}
          />
        </CustomForm>
      </CustomDialog>

      <ListPageLayout
        buttonLabel="Add Pay"
        onClick={onShow}
        addPadding
        extraContent
        content={onSelectAppointmentLevel()}
        tableData={appointmentPays}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
export default React.memo(Pay);
