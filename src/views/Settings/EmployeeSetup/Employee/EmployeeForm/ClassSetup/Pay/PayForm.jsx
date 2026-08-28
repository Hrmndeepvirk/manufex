import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCheckbox from "@inputs/CustomCheckbox";
import formValidation, { showFormErrors } from "@formValidations";
import { payTypes } from "@utils/dropdownConstants";
import CustomNumberInput from "@shared/inputs/CustomNumberInput";
import {
  addOrUpdateEmployeeClassSetup,
  getEmployeeClassSetup,
} from "@store/settings/employeeSetup/manageEmployee/classSetupActions";

function PayForm({ showForm, onHide, selectedPay, getClasses }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  let _initialState = {
    payType: "INCREMENTAL_PAY",
    oneToFiveClients: 0,
    sixToTenClients: 0,
    elevenToFifteenClients: 0,
    sixteenToTwentyClients: 0,
    twentyOneToTwentyFiveClients: 0,
    twentySixPlusClients: 0,
    payPerClassRate: 0,
    baseRate: 0,
    payPerClientRate: 0,
    noRegistrationPay: 0,
    maxPayPerClient: 0,
    percentage: 0,
    countUnpaidService: false,
    eachClientOver: [
      {
        noOfClients: 0,
        rate: 0,
      },
      {
        noOfClients: 0,
        rate: 0,
      },
      {
        noOfClients: 0,
        rate: 0,
      },
    ],
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(_initialState);

  useEffect(() => {
    if (selectedPay) {
      dispatch(
        getEmployeeClassSetup(id, selectedPay, setLoading, (res) => {
          setData({
            payType: res.payType,
            oneToFiveClients: res.oneToFiveClients,
            sixToTenClients: res.sixToTenClients,
            elevenToFifteenClients: res.elevenToFifteenClients,
            sixteenToTwentyClients: res.sixteenToTwentyClients,
            twentyOneToTwentyFiveClients: res.twentyOneToTwentyFiveClients,
            twentySixPlusClients: res.twentySixPlusClients,
            payPerClassRate: res.payPerClassRate,
            baseRate: res.baseRate,
            payPerClientRate: res.payPerClientRate,
            noRegistrationPay: res.noRegistrationPay,
            maxPayPerClient: res.maxPayPerClient,
            percentage: res.percentage,
            countUnpaidService: res.countUnpaidService,
            eachClientOver: res.eachClientOver,
          });
        }),
      );
    }
  }, [selectedPay]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      if (id) {
        dispatch(
          addOrUpdateEmployeeClassSetup(
            id,
            selectedPay,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                getClasses();
                onHide();
                setData(_initialState);
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            },
          ),
        );
      }
    }
  };

  const handleEachClientOverChange = (index, name, value) => {
    const updatedEachClientOver = [...data.eachClientOver];
    updatedEachClientOver[index][name] = value;
    setData((prev) => ({ ...prev, eachClientOver: updatedEachClientOver }));
  };

  const _onHide = () => {
    onHide();
    setData(_initialState);
  };

  return (
    <CustomDialog
      title={selectedPay ? "Edit Class Pay Rate" : "Add Class Pay Rate"}
      visible={showForm}
      onHide={_onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel={selectedPay ? "Update" : "Save"}
        submitLoading={loading}
        onCancel={_onHide}
      >
        <CustomDropdown
          data={data}
          name="payType"
          onChange={handleChange}
          options={payTypes}
          col={12}
        />

        {data?.payType === "INCREMENTAL_PAY" && (
          <>
            <CustomNumberInput
              name="oneToFiveClients"
              onChange={handleChange}
              data={data}
              minFractionDigits={2}
              label={"1-5 Clients"}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="sixToTenClients"
              minFractionDigits={2}
              onChange={handleChange}
              label={"6-10 Clients"}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="elevenToFifteenClients"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              label={"11-15 Clients"}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="sixteenToTwentyClients"
              minFractionDigits={2}
              onChange={handleChange}
              data={data}
              label={"16-20 Clients"}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="twentyOneToTwentyFiveClients"
              onChange={handleChange}
              label={"21-25 Clients"}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="twentySixPlusClients"
              onChange={handleChange}
              minFractionDigits={2}
              label={"26+ Clients"}
              data={data}
              col={6}
              prefix={"$"}
            />

            <CustomNumberInput
              name="noRegistrationPay"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomCheckbox
              name="countUnpaidService"
              label="Count Unpaid Service"
              onChange={handleChange}
              data={data}
              col={12}
            />
          </>
        )}

        {data?.payType === "PAY_PER_CLASS" && (
          <>
            <CustomNumberInput
              name="payPerClassRate"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="noRegistrationPay"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
          </>
        )}

        {data?.payType === "PAY_PER_CLIENT" && (
          <>
            <CustomNumberInput
              name="baseRate"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="payPerClientRate"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />

            {data?.eachClientOver?.map((client, index) => (
              <React.Fragment key={index}>
                <CustomNumberInput
                  name="noOfClients"
                  value={client.noOfClients}
                  onChange={(e) =>
                    handleEachClientOverChange(index, "noOfClients", e.value)
                  }
                  col={6}
                />
                <CustomNumberInput
                  name="rate"
                  value={client.rate}
                  onChange={(e) =>
                    handleEachClientOverChange(index, "rate", e.value)
                  }
                  col={6}
                  minFractionDigits={2}
                  data={data}
                  prefix={"$"}
                />
              </React.Fragment>
            ))}

            <CustomNumberInput
              name="noRegistrationPay"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
            <CustomNumberInput
              name="maxPayPerClient"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />

            <CustomCheckbox
              name="countUnpaidService"
              label="Count Unpaid Service"
              onChange={handleChange}
              data={data}
              col={12}
            />
          </>
        )}

        {data?.payType === "PERCENTAGE_RATE" && (
          <>
            <CustomNumberInput
              name="percentage"
              onChange={handleChange}
              data={data}
              col={6}
              suffix={"%"}
            />
            <CustomNumberInput
              name="noRegistrationPay"
              onChange={handleChange}
              minFractionDigits={2}
              data={data}
              col={6}
              prefix={"$"}
            />
          </>
        )}
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(PayForm);
