import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import formValidation, { showFormErrors } from "@formValidations";

import CustomInputDropdown from "@inputs/CustomInputDropdown";
import {
  addOrUpdateReferralGroup,
  getReferralGroup,
} from "@store/settings/inventory/referralGroupActions";
import AddCatalog from "../../PointOfSale/Discount/AddCatalog";

const getIds = (arr) =>
  arr?.map((item) => (typeof item === "string" ? item : item._id)) || [];

const resolveIds = (ids, source) => {
  if (!ids?.length || !source?.length) return [];
  return ids
    .map((id) => {
      if (typeof id === "object" && id._id) return id;
      return source.find((item) => item._id === id);
    })
    .filter(Boolean);
};

function ReferralGroupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const catalogItems = useSelector(
    (state) => state.settings.inventory.catalogItems
  );

  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    amount: { value: 0, unit: "FIXED" },
    catalogs: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getReferralGroup(id, setLoading, (res) => {
          setRawData(res);
          setData({
            title: res.title || "",
            description: res.description || "",
            amount: res.amount || { value: 0, unit: "FIXED" },
            catalogs: res?.catalogs || [],
          });
        })
      );
    }
  }, [id]);

  useEffect(() => {
    if (!rawData || !catalogItems.length) return;
    setData((prev) => ({
      ...prev,
      catalogs: resolveIds(rawData.catalogs, catalogItems),
    }));
  }, [catalogItems, rawData]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["catalogs"])) {
      const payload = {
        ...data,
        catalogs: getIds(data.catalogs),
      };
      dispatch(
        addOrUpdateReferralGroup(
          id,
          payload,
          setLoading,
          (success, formErrors) => {
            if (success) {
              navigate(-1);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          }
        )
      );
    }
  };

  return (
    <FormPageLayout
      backText="Referral Groups"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Add New Referral Group">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          label="Name"
          required
        />
        <CustomInputDropdown
          data={data}
          onChange={handleChange}
          name="amount"
          optionsType="AmountUnits"
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
      </CustomCard>

      <AddCatalog
        data={data}
        onChange={handleChange}
        name="catalogs"
        label="Catalog Items"
        filterFn={(item) =>
          item.itemSold === "AGREEMENTS" ||
          item.itemSold === "POS_AGREEMENTS"
        }
      />
    </FormPageLayout>
  );
}
export default React.memo(ReferralGroupForm);
