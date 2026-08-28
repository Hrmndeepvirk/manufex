import React, { useEffect, useState } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomCheckbox from "@inputs/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { getFilters, getTags } from "@store/pointOfSale/pointOfSaleActions";
import { usePos } from "../PosContext";

function FiltersDialog({ visible, onHide }) {
  const dispatch = useDispatch();

  const {
    setTags,
    setFilterSets,
    tags: appliedTags,
    filterSets: appliedFilters,
  } = usePos();

  useEffect(() => {
    if (visible) {
      setData({
        filters: appliedFilters || [],
        tags: appliedTags || [],
      });
    }
  }, [visible, appliedFilters, appliedTags]);

  const [loading, setLoading] = useState(false);

  const filters = useSelector((state) => state.pos.filters);
  const tags = useSelector((state) => state.pos.tags);

  const [data, setData] = useState({ filters: [], tags: [] });

  useEffect(() => {
    dispatch(getFilters(setLoading));
    dispatch(getTags(setLoading));
  }, [dispatch]);

  const onHidePopup = () => {
    onHide();
  };

  const handleCheckboxChange = (type, id, checked) => {
    setData((prev) => {
      const list = prev[type];

      return {
        ...prev,
        [type]: checked
          ? list.includes(id)
            ? list
            : [...list, id]
          : list.filter((itemId) => itemId !== id), // remove
      };
    });
  };

  // logic here for the application of filters
  const onApplyFilters = (e) => {
    e.preventDefault();
    setFilterSets(data.filters);
    setTags(data.tags);
    onHide();
  };

  // logic for clearing the filters
  const onClearFilters = (e) => {
    e.preventDefault();
    setData({ filters: [], tags: [] });
    setFilterSets([]);
    setTags([]);
  };

  const isEmpty = data.filters.length === 0 && data.tags.length === 0;

  return (
    <>
      <CustomDialog
        visible={visible}
        onHide={onHidePopup}
        title="Apply Filters"
      >
        <CustomForm
          onSubmit={onApplyFilters}
          submitLabel={"Apply"}
          submitDisabled={isEmpty}
          onCancel={onHidePopup}
          buttons={[
            {
              label: "Clear",
              onClick: onClearFilters,
              disabled: isEmpty,
            },
          ]}
          col={6}
        >
          <div className="c-col-12 w-full flex flex-column gap-3">
            {loading && (
              <div className="text-sm text-color-secondary">
                Loading filter options...
              </div>
            )}
            <div className="border-round surface-50 p-3 w-full">
              <div className="mb-2 font-medium text-color-secondary">
                Filter Sets
              </div>
              <div className="c-grid">
                {filters.map((filter) => (
                  <CustomCheckbox
                    key={filter._id}
                    name={`filter-${filter._id}`}
                    data={data}
                    col={6}
                    label={filter?.title}
                    checked={data.filters.includes(filter._id)}
                    onChange={({ value }) =>
                      handleCheckboxChange("filters", filter._id, value)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="border-round surface-50 p-3 w-full">
              <div className="mb-2 font-medium text-color-secondary">Tags</div>
              <div className="c-grid">
                {tags.map((tag) => (
                  <CustomCheckbox
                    key={tag._id}
                    name={`tag-${tag._id}`}
                    data={data}
                    col={6}
                    label={tag?.title}
                    checked={data.tags.includes(tag._id)}
                    onChange={({ value }) =>
                      handleCheckboxChange("tags", tag._id, value)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </CustomForm>
      </CustomDialog>
    </>
  );
}

export default React.memo(FiltersDialog);
