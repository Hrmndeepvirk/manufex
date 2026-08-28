import React from "react";

export default function SmallTab({ items = [], onChange }) {
  return (
    <div className="flex w-full align-items-center justify-content-between px-2">
      {items.map((item, index) => {
        const isFirst = index === 0;

        return (
          <div
            key={index}
            className={`
              ${isFirst ? "font-bold" : ""}
              cursor-pointer
            `}
            onClick={() => {
              onChange && onChange(index);
              item?.onClick?.();
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
