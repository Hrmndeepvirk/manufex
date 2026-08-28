import React, { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateSubstitutionOption,
  deleteSubstitutionOption,
  getSubstitutionOptions,
} from "@store/settings/employeeSetup/manageEmployee/substituteOptionsActions";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import { formatEnum } from "@utils/common";

function SubstituteOptions({ employee }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedSubstitute, setSelectedSubstitute] = useState(null);
  const [showFormDialog, setShowFormDialog] = useState(false);

  const eventOptions = useSelector((state) => state.dropdown.eventSetups);
  const substitutionOptions = useSelector(
    (state) => state.settings.employeeSetup.substituteOptions
  );

  const filteredOptions = eventOptions.filter(
    (e) =>
      e.eventType === "CLASS" &&
      !substitutionOptions.some((s) => s.event === e._id)
  );

  useEffect(() => {
    dispatch(getSubstitutionOptions(employee?._id, setLoading));
  }, []);

  const [data, setData] = useState({
    event: null,
    priority: "",
  });

  let columns = [
    {
      header: "Classes",
      field: "event",
      optionsKey: "eventSetups",
    },
    {
      header: "Priority",
      field: "priority",
      body: (row) => formatEnum(row?.priority),
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
    setData({ event: null, priority: "" });
    setSelectedSubstitute(null);
  };

  const onEdit = (_, __, row) => {
    setShowFormDialog(true);
    setSelectedSubstitute(row?._id);
    setData(row);
  };

  const onDelete = (id) => {
    dispatch(deleteSubstitutionOption(employee?._id, id));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateSubstitutionOption(
          employee?._id,
          selectedSubstitute,
          data,
          setSubmitLoading,
          (success, formErrors) => {
            if (success) {
              onHide();
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
      <CustomDialog
        title={
          selectedSubstitute
            ? "Edit Substitution Option"
            : "Add Substitution Option"
        }
        visible={showFormDialog}
        onHide={onHide}
      >
        <CustomForm
          onSubmit={onFormSubmit}
          submitLoading={submitLoading}
          onCancel={onHide}
        >
          <CustomDropdown
            name="event"
            data={data}
            options={selectedSubstitute ? eventOptions : filteredOptions}
            onChange={handleChange}
            col={12}
          />
          <CustomDropdown
            name="priority"
            data={data}
            onChange={handleChange}
            optionsType="substitutionOptionsPriority"
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      <ListPageLayout
        buttonLabel="Add Substitution Option"
        onClick={onShow}
        addPadding
        tableData={substitutionOptions}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
export default React.memo(SubstituteOptions);
