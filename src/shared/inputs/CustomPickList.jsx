import React, { useEffect, useState } from "react";
import InputLayout from "./InputLayout";
import { PickList } from "primereact/picklist";
import { useSelector } from "react-redux";

function CustomPickList({
  label,
  name,
  data = {},
  value,
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 12,
  disabled = false,
  hideLabel = false,

  options = [],
  optionsType = null,

  breakpoint = "640px",
  sourceHeader = "Available",
  targetHeader = "Selected",
  sourceStyle = { height: "24rem" },
  targetStyle = { height: "24rem" },
  showSourceControls = false,
  showTargetControls = false,

  itemTemplate,
  ...props
}) {
  const _value = value ?? data?.[name] ?? [];

  const dropdowns = useSelector((state) => state.dropdown);
  if (optionsType) {
    options = dropdowns[optionsType] || [];
  }

  useEffect(() => {
    if (options.length) {
      let _source = options.filter((item) => !_value.includes(item._id));
      let _target;
      if (showTargetControls) {
        _target = _value.map((item) =>
          options.find((option) => option._id === item)
        );
      } else {
        _target = options.filter((item) => _value.includes(item._id));
      }

      setSource(_source);
      setTarget(_target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, _value?.length]);

  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);

  const handlePickListChange = ({ target, source }) => {
    setSource(source);
    setTarget(target);

    if (onChange) {
      let _values = target.map((item) => item._id);
      onChange({ name, value: _values });
    }
  };

  const defaultItemTemplate = (item) => {
    return (
      <div className="p-1 align-items-center gap-3">
        <div>{item.title || item?.name}</div>
        {item.description && <div className="text-sm">{item.description}</div>}
      </div>
    );
  };

  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      hideLabel={hideLabel}
    >
      <PickList
        source={source}
        target={target}
        onChange={handlePickListChange}
        itemTemplate={itemTemplate || defaultItemTemplate}
        breakpoint={breakpoint}
        sourceHeader={sourceHeader}
        targetHeader={targetHeader}
        sourceStyle={sourceStyle}
        targetStyle={targetStyle}
        showSourceControls={showSourceControls}
        showTargetControls={showTargetControls}
        {...props}
      />
    </InputLayout>
  );
}

export default React.memo(CustomPickList);
