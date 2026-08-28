import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomMultiSelect from "@shared/inputs/CustomMultiSelect";
import formValidation from "@formValidations";
import { addOrUpdateCatalog } from "@store/settings/inventory/catalogActions";

function Tracking({ editItem, pageLoading, onSaveSuccess }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const allCommissionGroups = useSelector((state) => state.dropdown.commissionGroups) || [];
  const filteredCommissionGroups = useMemo(() => {
    const catalogType = editItem?.type;
    if (!catalogType) return allCommissionGroups;
    return allCommissionGroups.filter((group) => group.commissionType === catalogType);
  }, [allCommissionGroups, editItem?.type]);

  const [data, setData] = useState({
    requireCommission: false,
    commissionGroups: [],
    referralGroups: [],
    memberRequired: false,
    deductionOnCheckIn: false,
    alternateItems: [],
    note: "",
  });

  useEffect(() => {
    if (editItem) {
      setData({
        requireCommission: editItem.requireCommission || false,
        commissionGroups: editItem.commissionGroups || [],
        referralGroups: editItem.referralGroups || [],
        memberRequired: editItem.memberRequired || false,
        deductionOnCheckIn: editItem.deductionOnCheckIn || false,
        alternateItems: editItem.alternateItems || [],
        note: editItem.note || "",
      });
    }
  }, [editItem]);

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = () => {
    const mergedPayload = {
      ...editItem,
      ...data,
    };

    dispatch(
      addOrUpdateCatalog(id, mergedPayload, setLoading, (success, payload) => {
        if (success) {
          onSaveSuccess?.(payload);
        }
      }),
    );
  };

  return (
    <FormPageLayout
      backText="Catalogs"
      submitLabel="Save & Next"
      submitLoading={loading}
      onSubmit={handleSubmit}
      pageLoading={pageLoading}
    >
      <CustomCard title="Tracking">
        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="requireCommission"
          booleanOptions
        />

        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="commissionGroups"
          options={filteredCommissionGroups}
        />

        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="referralGroups"
          optionsType="referralGroups"
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="memberRequired"
          booleanOptions
        />

        <CustomDropdown
          data={data}
          onChange={handleChange}
          name="deductionOnCheckIn"
          booleanOptions
        />

        <CustomMultiSelect
          data={data}
          onChange={handleChange}
          name="alternateItems"
        />

        <CustomTextArea name="note" data={data} onChange={handleChange} />
      </CustomCard>
    </FormPageLayout>
  );
}

export default React.memo(Tracking);
