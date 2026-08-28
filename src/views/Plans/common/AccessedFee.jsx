import React, { useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomCurrencyInput from "@inputs/CustomCurrencyInput";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import { capitalizeSnakeCase } from "../../../utils/common";

function AccessedFee({ agreementInfo, setAgreementInfo }) {
  let assessedFees = agreementInfo?.assessedFees;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  const columns = [
    { header: "Name", field: "title" },
    {
      header: "Type",
      field: "type",
      body: (row) => {
        return capitalizeSnakeCase(row.type);
      },
    },
    { header: "Due Date", field: "dueDate", isDate: true },
    { header: "Apply", field: "isApplied", isBoolean: true },
    { header: "Recurring", field: "isRecurring", isBoolean: true },
    { header: "Amount", field: "amount", isCurrency: true },
  ];

  const onEdit = (row) => {
    setVisible(true);
    setData(row);
  };

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onHide = () => {
    setVisible(false);
    setData({});
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let _index = assessedFees.findIndex((item) => item._id === data._id);
    if (_index !== -1) {
      let _assessedFees = [...assessedFees];
      _assessedFees[_index] = data;
      setAgreementInfo((prev) => ({ ...prev, assessedFees: _assessedFees }));
      onHide();
    }
  };

  return (
    <>
      <CustomDialog title={data?.title} visible={visible} onHide={onHide}>
        <CustomForm onSubmit={onSubmit} onCancel={onHide}>
          <CustomCalendarInput
            data={data}
            onChange={handleChange}
            name="dueDate"
            minDate={agreementInfo?.beginDate}
            col={12}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isApplied"
            booleanOptions
            col={12}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isRecurring"
            booleanOptions
            col={12}
          />
          <CustomCurrencyInput
            data={data}
            onChange={handleChange}
            name="amount"
            col={12}
          />
        </CustomForm>
      </CustomDialog>
      <div className="c-col-12">
        <CustomSimpleTable
          columns={columns}
          onEdit={onEdit}
          data={assessedFees}
        />
      </div>
    </>
  );
}
export default React.memo(AccessedFee);
