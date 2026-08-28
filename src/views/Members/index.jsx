import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "@store/member/memberActions";
import UserTableProfile from "../../shared/userCards/UserTableProfile";
import CustomTable from "@shared/table/CustomTable";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { FilterBar } from "@filters";

function Members() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  let columns = [
    {
      field: "firstName",
      header: "Member",
      sortable: true,
      body: (rowData) => <UserTableProfile user={rowData} />,
    },
    { field: "barCode" },
    { field: "email" },
    { field: "primaryPhone" },
    { field: "dob", header: "Date of birth", isDate: true },
  ];

  const data = useSelector((state) => state.member.members);

  useEffect(() => {
    dispatch(getMembers(setLoading));
  }, [dispatch]);

  const quickFilters = [
    { column: "firstName", header: "First Name", type: "text", col: 4 },
    { column: "lastName", header: "Last Name", type: "text", col: 4 },
    { column: "email", header: "Email", type: "text", col: 4 },
  ];

  const advancedFilters = [
    { column: "barCode", header: "Bar Code", type: "text", col: 3 },
    { column: "primaryPhone", header: "Primary Phone", type: "text", col: 3 },
    {
      column: "gender",
      header: "Gender",
      type: "dropdown",
      options: [
        { _id: "MALE", title: "Male" },
        { _id: "FEMALE", title: "Female" },
        { _id: "OTHER", title: "Other" },
      ],
      col: 3,
  
    },
    {
      column: "createType",
      header: "Member Type",
      type: "dropdown",
      options: [
        { _id: "MEMBER", title: "Member" },
        { _id: "PROSPECT", title: "Prospect" },
      ],
      col: 3,
    },
  ];

  return (
    <div className="px-2">
      <FilterBar
        quickFilters={quickFilters}
        advancedFilters={advancedFilters}
        data={data}
        onFilter={setFilteredData}
      >
        <PrimaryButton
          label="Add Member"
          icon="pi pi-plus"
          onClick={() => navigate("fast-add-member")}
        />
      </FilterBar>
      <CustomTable
        data={filteredData}
        columns={columns}
        loading={loading}
        onRowClick={(e) => navigate(e.data._id)}
      />
    </div>
  );
}
export default React.memo(Members);
