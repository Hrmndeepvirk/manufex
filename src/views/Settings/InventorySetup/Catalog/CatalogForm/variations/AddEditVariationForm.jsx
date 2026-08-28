import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomInput from "@inputs/CustomInput";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import formValidation, { showFormErrors } from "@formValidations";
import CustomChipInput from "../../../../../../shared/inputs/CustomChipInput";
import {
  addCatalogVariation,
  editCatalogVariation,
} from "../../../../../../store/settings/inventory/catalogVariationActions";

function AddEditVariationForm({
  selectedVariation,
  show,
  onHide,
  getVariations,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    subVariations: [],
  });

  useEffect(() => {
    if (selectedVariation) {
      setData({
        title: selectedVariation.title,
      });
    }
  }, [selectedVariation]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      if (id) {
        if (selectedVariation?._id) {
          dispatch(
            editCatalogVariation(
              selectedVariation._id,
              data,
              setLoading,
              (success, errors) => {
                if (success) {
                  _onHide();
                  getVariations();
                } else {
                  let formErrors = { ...data.formErrors, ...errors };
                  setData((prev) => ({ ...prev, formErrors }));
                }
              }
            )
          );
        } else {
          dispatch(
            addCatalogVariation(id, data, setLoading, (success, errors) => {
              if (success) {
                _onHide();
                getVariations();
              } else {
                let formErrors = { ...data.formErrors, ...errors };
                setData((prev) => ({ ...prev, formErrors }));
              }
            })
          );
        }
      }
    }
  };

  function _onHide() {
    setData({
      title: "",
      subVariations: [],
    });
    onHide();
  }

  return (
    <CustomDialog
      title="Add Variations"
      visible={show}
      onHide={_onHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        submitLabel="Save"
        submitLoading={loading}
        onCancel={_onHide}
      >
        <CustomInput
          data={data}
          onChange={handleChange}
          name="title"
          required
          col={12}
        />
        {!selectedVariation && (
          <CustomChipInput
            data={data}
            onChange={handleChange}
            name="subVariations"
            required
            col={12}
          />
        )}
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(AddEditVariationForm);
