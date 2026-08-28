import React from "react";
import UserProfileImage from "./UserProfileImage";

export default function UserProfile({ user }) {
  const { firstName, lastName, gender, image, barCode } = user;

  return (
    <div className="custom-user-profile">
      <UserProfileImage
        src={image}
        gender={gender} // MALE/FEMALE → male/female
      />

      <div>
        <div className="text-primary-color font-bold text-lg capitalize">
          {firstName} {lastName}
        </div>
        <div className="text-primary-color font-medium text-lg">{barCode}</div>
      </div>
    </div>
  );
}
