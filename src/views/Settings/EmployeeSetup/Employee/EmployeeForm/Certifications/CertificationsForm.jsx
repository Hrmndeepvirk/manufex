import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useServerTime } from "../../../../../../hooks/useServerTime";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateEmployeeCertificate,
  getEmployeeCertificate,
} from "@store/settings/employeeSetup/manageEmployee/employeeCertifications";
import CustomFileInput from "../../../../../../shared/inputs/CustomFileInput";

function CertificationsForm() {
  const { getServerDate } = useServerTime();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, certificateId } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    certificationNumber: "",
    issuer: "",
    acquiredDate: "",
    expirationDate: "",
    description: "",
    certificates: [],
  });

  useEffect(() => {
    if (certificateId) {
      dispatch(
        getEmployeeCertificate(id, certificateId, setLoading, (res) => {
          setData({
            title: res.title,
            certificationNumber: res.certificationNumber,
            issuer: res.issuer,
            acquiredDate: res.acquiredDate,
            expirationDate: res.expirationDate,
            description: res.description,
            certificates: res.certificates || [],
          });
        }),
      );
    }
  }, [certificateId]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      if (id) {
        dispatch(
          addOrUpdateEmployeeCertificate(
            id,
            certificateId,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                navigate(-1);
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            },
          ),
        );
      }
    }
  };

  console.log(data);

  return (
    <FormPageLayout
      backText="Certificates"
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      <CustomCard title="Personal">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="certificationNumber"
          required
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="issuer"
          required
        />
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="acquiredDate"
          dateString
          maxDate={getServerDate()}
        />
        <CustomCalendarInput
          data={data}
          onChange={handleChange}
          name="expirationDate"
          dateString
          minDate={
            data?.acquiredDate ? new Date(data?.acquiredDate) : new Date()
          }
        />
        <CustomFileInput
          data={data}
          onChange={handleChange}
          name="certificates"
        />
        <CustomTextArea
          data={data}
          onChange={handleChange}
          name="description"
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(CertificationsForm);
