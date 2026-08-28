import React, { useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import CustomCurrencyInput from "@inputs/CustomCurrencyInput";
import CustomNumberInput from "@inputs/CustomNumberInput";

function Service({ agreementInfo, setAgreementInfo }) {
  let services = agreementInfo?.services;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  const columns = [
    { header: "Service Name", field: "title" },
    { header: "First Due Date", field: "firstDueDate", isDate: true },
    {
      header: "No of Payments",
      body: (row) => {
        if (row.isRecurring) {
          return "Recurring";
        }
        return "One Time Service";
      },
    },
    {
      header: "Quantity",
      field: "quantity",
      body: (row) => {
        if (row.allowUnlimited) {
          return "Unlimited";
        }
        return row.quantity;
      },
    },
    {
      header: "Price",
      field: "price",
      isCurrency: true,
    },
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
    let _index = services.findIndex((item) => item._id === data._id);
    if (_index !== -1) {
      let _services = [...services];
      _services[_index] = data;
      setAgreementInfo((prev) => ({ ...prev, services: _services }));
      onHide();
    }
  };

  return (
    <>
      <CustomDialog title={data?.title} visible={visible} onHide={onHide}>
        <CustomForm onSubmit={onSubmit} onCancel={onHide}>
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="isRecurring"
            label="No of Payments"
            optionsType="billingTypeOptions"
            col={12}
          />
          <CustomDropdown
            data={data}
            onChange={handleChange}
            name="allowUnlimited"
            booleanOptions
            col={12}
          />
          {!data?.allowUnlimited && (
            <CustomNumberInput
              data={data}
              onChange={handleChange}
              name="quantity"
              col={12}
              useGrouping={false}
            />
          )}
          <CustomCurrencyInput
            data={data}
            onChange={handleChange}
            name="price"
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      <div className="c-col-12">
        <CustomSimpleTable columns={columns} onEdit={onEdit} data={services} />
      </div>
    </>
  );
}
export default React.memo(Service);
