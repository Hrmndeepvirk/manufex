import React from "react";
import UserProfileImage from "./UserProfileImage";
import { Skeleton } from "primereact/skeleton";
import { formatEnum } from "../../utils/common";

function MemberProfile({
  user,
  loading = false,
  textClassName = "",
  agreementStatus,
  children,
  nameOffset = "0",
}) {
  let {
    firstName,
    lastName,
    barCode,
    status = "active" || agreementStatus,
  } = user || {};

  return (
    <div className={`flex gap-4 ${textClassName}`}>
      <div>
        {loading ? (
          <Skeleton shape="rectangle" width="120px" height="120px" />
        ) : (
          <UserProfileImage
            type="square"
            width={120}
            height={120}
            gender={user?.gender}
            src={user?.image}
          />
        )}
      </div>

      <div className="my-auto text-lg">
        {loading ? (
          <>
            <Skeleton width="20rem" height="2rem" className="mb-2" />
            <Skeleton width="15rem" height="1.2rem" className="mb-2" />
            <Skeleton width="16rem" height="1.2rem" />
          </>
        ) : (
          <>
            <div
              className="text-3xl capitalize"
              style={{ paddingLeft: nameOffset }}
            >
              {firstName} {lastName}
            </div>
            <div style={{ paddingLeft: nameOffset }}>{barCode}</div>
            {agreementStatus && (
              <span className="text-green-700 capitalize bg-gray-100 px-2 border-round-md text-sm">
                {formatEnum(agreementStatus) || status}
              </span>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(MemberProfile);
