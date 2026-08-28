import React, { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import formValidation, { showFormErrors } from "@formValidations";
import { updateSalesCode } from "@store/settings/employeeSetup/employeeActions";

function SalesCode({ employee }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ salesCode: "" });

  useEffect(() => {
    if (employee) {
      setData({ salesCode: employee?.salesCode });
    }
  }, [employee]);

  console.log("daatttt ===>", data);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        updateSalesCode(
          employee?._id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              setLoading(false);
              
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
      <FormPageLayout onSubmit={handleSubmit} submitLoading={loading}>
        <CustomCard title="Employee Sales Code">
          <CustomInput
            data={data}
            onChange={handleChange}
            name="salesCode"
            required
          />
        </CustomCard>
      </FormPageLayout>
    </>
  );
}
export default React.memo(SalesCode);
