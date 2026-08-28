import React from "react";
import UserProfileImage from "./UserProfileImage";

function UserTableProfile({ user }) {
  const { firstName, lastName, gender, image } = user;

  return (
    <div className="flex items-center gap-2">
      <UserProfileImage src={image} gender={gender} width={40} height={40} />
      <div className="capitalize my-auto font-medium">
        {firstName} {lastName}
      </div>
    </div>
  );
}
export default React.memo(UserTableProfile);
