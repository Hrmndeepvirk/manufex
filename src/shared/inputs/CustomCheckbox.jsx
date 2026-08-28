import React from "react";

function CustomCheckbox({
  label,
  name,
  data,
  value,
  checked,
  onChange,
  extraClassName,
  col = 6,
  ...props
}) {
  return (
    <div className={`input-layout c-col-${col} ${extraClassName}`}>
      <div className="flex justify-content-start">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked ?? value ?? data?.[name] ?? false}
          onChange={(e) =>
            onChange && onChange({ ...e, name: name, value: e.target.checked })
          }
          {...props}
        />
        <label
          htmlFor={name}
          className="ml-2 my-auto cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    </div>
  );
}
export default React.memo(CustomCheckbox);
