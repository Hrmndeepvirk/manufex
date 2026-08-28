import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListPageLayout from "@shared/layout/ListPageLayout";
import {
  getEmployeeCertificates,
  deleteEmployeeCertificate,
} from "@store/settings/employeeSetup/manageEmployee/employeeCertifications";

function Certifications({ employee }) {
  const dispatch = useDispatch();

  const data = useSelector(
    (state) => state.settings.employeeSetup.employeeCertificates,
  );

  useEffect(() => {
    if (employee) {
      dispatch(getEmployeeCertificates(employee?._id));
    }
  }, [dispatch, employee]);

  let columns = [
    {
      field: "title",
      header: "title",
      sortable: true,
    },
    { field: "description", header: "Description" },
    { field: "certificationNumber", header: "Certification Number" },

    { field: "issuer", header: "Issuing Authority" },
    { field: "acquiredDate", header: " Acquired Date", isDate: true },
    { field: "expirationDate", header: "Expiration Date", isDate: true },
  ];

  const onEdit = (id, navigate) => {
    navigate(`certifications/${id}`);
  };

  const onDelete = (id) => {
    if (employee) {
      dispatch(deleteEmployeeCertificate(employee?._id, id));
    }
  };

  return (
    <ListPageLayout
      buttonLabel="Add Certifications"
      linkTo={"certifications"}
      searchable={["title"]}
      tableData={data}
      columns={columns}
      onDelete={onDelete}
      onEdit={onEdit}
      addPadding
    />
  );
}
export default React.memo(Certifications);
