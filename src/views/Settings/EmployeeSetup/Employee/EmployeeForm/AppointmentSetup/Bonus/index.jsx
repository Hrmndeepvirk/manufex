import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { formatEnum } from "@utils/common";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomInputDropdown from "@inputs/CustomInputDropdown";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import { useCurrencyFormatter } from "../../../../../../../hooks/useCurrencyFormatter";
import {
  addOrUpdateAppointmentBonus,
  deleteAppointmentBonus,
  getAppointmentBonuses,
} from "@store/settings/employeeSetup/manageEmployee/appointmentBonusActions";
import {
  employeeAppointmentBonusTimeFrameTypes,
  employeeBonusTypes,
  AmountUnits,
} from "@utils/dropdownConstants";

function Bonus({ employee }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const { formatCurrency } = useCurrencyFormatter();

  const appointmentPays = useSelector(
    (state) => state.settings.employeeSetup.appointmentBonus
  );

  const services = useSelector((state) => state.dropdown.catalogItems);

  const filteredServices = services.filter((item) => item.type === "SERVICE");

  useEffect(() => {
    if (employee?._id) {
      dispatch(getAppointmentBonuses(employee?._id, setLoading));
    }
  }, []);

  const [data, setData] = useState({
    bonusType: "SERVICE_VALUE",
    sessionsValue: 0,
    noOfSessions: 0,
    timeframe: {
      over: 0,
      duration: "DAYS",
    },
    bonusAmount: 0,
    amountType: "FIXED",
    services: [],
  });

  let columns = [
    {
      header: "Bonus Type",
      field: "bonusType",
      body: (row) => formatEnum(row?.bonusType),
    },
    {
      header: "Time Frame",
      field: "timeframe",
      body: (row) =>
        `${row?.timeframe?.over} ${formatEnum(row?.timeframe.duration)}`,
    },

    {
      header: "Bonus Amount",
      field: "bonusAmount",
      body: (row) =>
        row?.amountType === "FIXED"
          ? `${formatCurrency(row.bonusAmount)}`
          : `${row.bonusAmount}%`,
    },
  ];

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
      bonusType: "SERVICE_VALUE",
      sessionsValue: 0,
      noOfSessions: 0,
      timeframe: {
        over: 0,
        duration: "DAYS",
      },
      bonusAmount: 0,
      amountType: "FIXED",
      services: [],
    });
    setSelectedBonus(null);
  };

  const onEdit = (_, __, row) => {
    console.log("roww ===>", row);

    setShowFormDialog(true);
    setSelectedBonus(row?._id);
    setData({
      ...row,
      timeframe: {
        unit: row.timeframe?.duration,
        value: row.timeframe?.over,
      },
    });
  };

  const onDelete = (id) => {
    dispatch(deleteAppointmentBonus(employee?._id, id));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      timeframe: {
        duration: data.timeframe.unit,
        over: data.timeframe.value,
      },
    };

    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateAppointmentBonus(
          employee?._id,
          selectedBonus,
          payload,
          setSubmitLoading,
          (success, formErrors) => {
            if (success) {
              onHide();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };
  return (
    <>
      <CustomDialog
        title={"Add Bonus"}
        visible={showFormDialog}
        onHide={onHide}
      >
        <CustomForm
          onSubmit={onFormSubmit}
          submitLoading={submitLoading}
          onCancel={onHide}
        >
          <CustomDropdown
            name="bonusType"
            data={data}
            options={employeeBonusTypes}
            onChange={handleChange}
            col={12}
          />
          {data?.bonusType === "SERVICE_VALUE" && (
            <CustomNumberInput
              name="sessionsValue"
              col={12}
              data={data}
              onChange={handleChange}
            />
          )}
          {data?.bonusType === "SINGLE_CLIENT" && (
            <CustomNumberInput
              name="noOfSessions"
              col={12}
              data={data}
              onChange={handleChange}
            />
          )}
          <CustomInputDropdown
            name="timeframe"
            options={employeeAppointmentBonusTimeFrameTypes}
            onChange={handleChange}
            data={data}
            col={12}
          />
          <CustomNumberInput
            name="bonusAmount"
            col={8}
            data={data}
            onChange={handleChange}
          />
          <CustomDropdown
            name="amountType"
            data={data}
            onChange={handleChange}
            options={AmountUnits}
            col={4}
          />
          <CustomMultiSelect
            name="services"
            data={data}
            onChange={handleChange}
            options={filteredServices}
            col={12}
          />
        </CustomForm>
      </CustomDialog>
      <ListPageLayout
        buttonLabel="Add Bonus"
        onClick={onShow}
        addPadding
        tableData={appointmentPays}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
export default React.memo(Bonus);
