import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTag,
  getTags,
  addOrUpdateTag,
} from "@store/settings/inventory/tagActions";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomInput from "@shared/inputs/CustomInput";
import CustomCheckbox from "@shared/inputs/CustomCheckbox";
import CustomForm from "@inputs/CustomForm";
import formValidation, { showFormErrors } from "@formValidations";

export default function Tags() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const [data, setData] = useState({
    title: "",
    isActive: true,
  });

  const tags = useSelector((state) => state.settings.inventory.tags);

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
    setSelectedTag(null);
  };

  useEffect(() => {
    dispatch(getTags(setLoading));
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
    dispatch(deleteTag(id));
  };

  const onEdit = (id, navigate, rowData) => {
    setSelectedTag(id);
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
        addOrUpdateTag(selectedTag, data, setLoading, (success, formErrors) => {
          if (success) {
            setVisible(false);
            setData({
              title: "",
              isActive: true,
            });
            setSelectedTag(null);
            dispatch(getTags());
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  return (
    <>
      <CustomDialog
        title={selectedTag ? "Edit Tag" : "Add Tag"}
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
            label="Is Active"
            data={data}
            onChange={handleChange}
            col={12}
          />
        </CustomForm>
      </CustomDialog>
      <ListPageLayout
        buttonLabel="Add Tag"
        onClick={() => {
          setVisible(true);
        }}
        searchable={["title"]}
        tableData={tags}
        columns={columns}
        loading={loading}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  );
}
// Note: onClick function for "Add Reason Code" button is currently empty and should be implemented as needed.
