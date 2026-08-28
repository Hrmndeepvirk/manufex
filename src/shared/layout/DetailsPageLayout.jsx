import React, { useMemo } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { FormPageContext } from "../context/FormPageContext";

function DetailsPageLayout({
  title,
  buttonLabel = "Add New",
  buttonIcon = "pi pi-pencil",
  onClick,
  linkTo,
  children,
  pageLoading,
}) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (linkTo) {
      navigate(linkTo);
    }
  };

  const contextValue = useMemo(
    () => ({
      loading: pageLoading,
    }),
    [pageLoading]
  );

  return (
    <div>
      <div className="flex justify-content-between my-3">
        <div className="text-primary-color text-xl font-bold my-auto">
          {title}
        </div>
        <div className="flex justify-content-between gap-2">
          {(onClick || linkTo) && (
            <PrimaryButton
              label={buttonLabel}
              icon={buttonIcon}
              onClick={handleClick}
            />
          )}
        </div>
      </div>
      <div className="c-grid">
        <FormPageContext.Provider value={contextValue}>
          {children}{" "}
        </FormPageContext.Provider>
      </div>
    </div>
  );
}
export default React.memo(DetailsPageLayout);
