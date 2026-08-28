import { Link } from "react-router-dom";

export default function MarketingButton({
  children,
  to,
  href,
  variant = "primary",
  icon = "pi pi-arrow-up-right",
  className = "",
  ...props
}) {
  const classes = `manufacturing-btn manufacturing-btn--${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon && <i className={icon} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <a className={classes} href={href || "#contact"} {...props}>
      {content}
    </a>
  );
}
