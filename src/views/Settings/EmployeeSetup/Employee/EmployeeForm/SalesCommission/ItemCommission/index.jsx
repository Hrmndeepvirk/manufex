import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { formatEnum } from "@utils/common";
import CustomNumberInput from "@inputs/CustomNumberInput";
import { useCurrencyFormatter } from "../../../../../../../hooks/useCurrencyFormatter";
import { AmountUnits } from "@utils/dropdownConstants";
import {
  addOrUpdateItemCommission,
  deleteItemCommission,
  getItemCommissions,
} from "@store/settings/employeeSetup/manageEmployee/itemCommissionsActions";
import { useResourceRequest } from "../../../../../../../hooks/useResourceRequest";

function ItemCommission({ employee }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { formatCurrency } = useCurrencyFormatter();

  const itemCommissions = useSelector(
    (state) => state.settings.employeeSetup.itemCommission,
  );

  const commissionGroups = useSelector(
    (state) => state.dropdown.commissionGroups,
  );

  const filteredComissionGroups = commissionGroups.filter(
    (item) => !itemCommissions.some((s) => s.commissionGroup === item._id),
  );

  useEffect(() => {
    if (employee?._id) {
      dispatch(getItemCommissions(employee?._id, setLoading));
    }
  }, []);

  const [data, setData] = useState({
    commissionGroup: null,
    commissionType: "PER_ITEM",
    pay: 0,
    amountType: "FIXED",
  });

  let columns = [
    {
      header: "Commission Group",
      field: "commissionGroup",
      optionsKey: "commissionGroups",
    },
    {
      header: "Commission Type",
      field: "commissionType",
      body: (row) => `${formatEnum(row?.commissionType)}`,
    },

    {
      header: "Pay",
      field: "pay",
      body: (row) =>
        row?.amountType === "FIXED"
          ? `${formatCurrency(row.pay)}`
          : `${row.pay}%`,
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
      commissionGroup: null,
      commissionType: "PER_ITEM",
      pay: 0,
      amountType: "FIXED",
    });
    setSelectedItem(null);
  };

  const onEdit = (_, __, row) => {
    setShowFormDialog(true);
    setSelectedItem(row?._id);
    setData(row);
  };

  const onDelete = (id) => {
    dispatch(deleteItemCommission(employee?._id, id));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateItemCommission(
          employee?._id,
          selectedItem,
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
  const { buttons: commissionRequestButtons } = useResourceRequest({
    permission: "REQUEST-COMMISSION",
    targetCollection: "COMMISSION",
    id: selectedItem,
    data,
    setData,
  });

  return (
    <>
      <CustomDialog
        title={selectedItem ? "Edit Item Commission" : "Add Item Commission"}
        visible={showFormDialog}
        onHide={onHide}
      >
        <CustomForm
          onSubmit={onFormSubmit}
          submitLoading={submitLoading}
          onCancel={onHide}
          buttons={commissionRequestButtons}
        >
          <CustomDropdown
            name="commissionGroup"
            data={data}
            options={selectedItem ? commissionGroups : filteredComissionGroups}
            onChange={handleChange}
            col={12}
          />
          <CustomDropdown
            name="commissionType"
            data={data}
            optionsType="salesCommissionOptions"
            onChange={handleChange}
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
            options={AmountUnits}
            col={4}
          />
        </CustomForm>
      </CustomDialog>
      <ListPageLayout
        buttonLabel="Add Item Commission"
        onClick={onShow}
        addPadding
        tableData={itemCommissions}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
export default React.memo(ItemCommission);
