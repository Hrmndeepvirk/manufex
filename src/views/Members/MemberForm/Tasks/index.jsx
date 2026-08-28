import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getTasks } from "../../../../store/member/taskActions";
import CustomTable from "../../../../shared/table/CustomTable";

const Tasks = ({ data = [], loading = false }) => {

  let columns = [
    {
      field: "dueDate",
      isDate: true,
    },
    { field: "taskType", optionsKey: "TaskTypes" },
    { field: "title" },

    { field: "employee" },
    { field: "description" },
    { field: "Date Completed" },
  ];
  return (
    <div className="c-col-12">
      <CustomTable data={data} columns={columns} loading={loading} />
    </div>
  );
};

export default Tasks;
