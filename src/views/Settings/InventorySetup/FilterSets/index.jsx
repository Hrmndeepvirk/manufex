import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFilterSet,
  getFilterSets,
  addOrUpdateFilterSet,
} from "@store/settings/inventory/filterSetActions";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomInput from "@shared/inputs/CustomInput";
import CustomCheckbox from "@shared/inputs/CustomCheckbox";
import CustomForm from "@inputs/CustomForm";
import formValidation, { showFormErrors } from "@formValidations";

export default function FilterSets() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedFilterSet, setSelectedFilterSet] = useState(null);

  const [data, setData] = useState({
    title: "",
    isActive: true,
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleHide = () => {
    setVisible(false);
    setData({
      title: "",
      isActive: true,
    });
    setSelectedFilterSet(null);
  };

  const filterSets = useSelector(
    (state) => state.settings.inventory.filterSets
  );

  useEffect(() => {
    dispatch(getFilterSets(setLoading));
  }, [dispatch]);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onDelete = (id) => {
    dispatch(deleteFilterSet(id));
  };

  const onEdit = (id, navigate, rowData) => {
    setSelectedFilterSet(id);
    setData({
      title: rowData?.title,
      isActive: rowData?.isActive,
    });
    setVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateFilterSet(
          selectedFilterSet,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              setVisible(false);
              setData({
                title: "",
                isActive: true,
              });
              setSelectedFilterSet(null);
              dispatch(getFilterSets());
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
        title={selectedFilterSet ? "Edit Filter Set" : "Add Filter Set"}
        visible={visible}
        onHide={handleHide}
      >
        <CustomForm
          onSubmit={handleSubmit}
          submitLabel="Save"
          submitLoading={loading}
          onCancel={handleHide}
        >
          <CustomInput
            name="title"
            data={data}
            onChange={handleChange}
            col={12}
            required
          />
          <CustomCheckbox
            name="isActive"
            label="Active"
            data={data}
            onChange={handleChange}
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      <ListPageLayout
        buttonLabel="Add Filter Set"
        onClick={() => {
          setSelectedFilterSet(null);
          setData({
            title: "",
            isActive: true,
          });
          setVisible(true);
        }}
        searchable={["title"]}
        tableData={filterSets}
        columns={columns}
        loading={loading}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  );
}
