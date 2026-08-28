import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";

export default function PrimaryButton({
  label,
  icon,
  size = "small",
  onClick,
  disabled,
  loading,
  severity = "primary",
  className,
  iconPos,
  ...props
}) {
  return (
    <Button
      className={`gap-2 ${className}`}
      severity={severity}
      label={label}
      icon={icon}
      iconPos={iconPos}
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      {...props}
    />
  );
}

export function PrimaryButtonSmall({
  label,
  icon,
  loading,
  className,
  outlined = false,
  secondary = false,
  ...props
}) {
  return (
    <button
      className={`custom-small-button p-ripple gap-2
      ${className}
      ${secondary && "secondary"}
      ${outlined && "outlined"}`}
      {...props}
    >
      {icon && <i className={`${icon} mr-2`}></i>}
      {label}
      <Ripple />
    </button>
  );
}
