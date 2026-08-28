import React, { useEffect, useMemo, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import { usePos } from "../PosContext";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import { getFileURL } from "../../../utils/fileHelper";

function VariationDialog() {
  const { onSelectProduct, variationProduct, onCloseVariation } = usePos();

  const [data, setData] = useState({ variation: null, subVariation: null });

  const variationsDropdown = useMemo(() => {
    return variationProduct?.variations.map((item) => ({
      _id: item._id,
      title: item.title,
      catalogItems: item.catalogItems,
    }));
  }, [variationProduct]);

  useEffect(() => {
    if (variationsDropdown?.length === 1) {
      setData((prev) => ({ ...prev, variation: variationsDropdown[0]._id }));
    }
  }, [variationsDropdown]);

  const subVariationDropdown = useMemo(
    () =>
      variationsDropdown?.find((item) => item._id === data?.variation)
        ?.catalogItems || [],
    [data?.variation, variationsDropdown],
  );

  console.log(subVariationDropdown);

  useEffect(() => {
    if (subVariationDropdown?.length === 1) {
      setData((prev) => ({
        ...prev,
        subVariation: subVariationDropdown[0]._id,
      }));
    }
  }, [subVariationDropdown]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (data?.subVariation) {
      const selectedItem = subVariationDropdown.find(
        (item) => item._id === data.subVariation,
      );

      if (selectedItem) {
        onSelectProduct(selectedItem);
        onCloseVariation();
        setData({ variation: null, subVariation: null });
      }
    }
  };

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            src={option?.images?.length && getFileURL(option?.images[0])}
            className={`mr-2 border-round-xs`}
            style={{ width: "35px" }}
          />
          <div>{option.title}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          src={option?.images?.length && getFileURL(option?.images[0])}
          className={`mr-2 border-round-xs`}
          style={{ width: "40px" }}
        />
        <div>{option.title}</div>
      </div>
    );
  };

  return (
    <>
      <CustomDialog
        visible={variationProduct}
        onHide={onCloseVariation}
        title="Select Variation"
      >
        <CustomForm
          onSubmit={onSubmit}
          submitLabel={"Add To Cart"}
          onCancel={onCloseVariation}
        >
          <CustomDropdown
            data={data}
            name="variation"
            options={variationsDropdown}
            onChange={handleChange}
            col={12}
          />{" "}
          <CustomDropdown
            data={data}
            name="subVariation"
            options={subVariationDropdown}
            onChange={handleChange}
            col={12}
            valueTemplate={selectedCountryTemplate}
            itemTemplate={countryOptionTemplate}
          />
        </CustomForm>
      </CustomDialog>
    </>
  );
}

export default React.memo(VariationDialog);
