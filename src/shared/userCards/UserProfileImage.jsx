import React from "react";
import female from "@assets/images/female-avatar.png";
import male from "@assets/images/male-avatar.png";
import dummy from "@assets/images/default-avatar.png";

export default function UserProfileImage({
  src,
  gender,
  type = "circle", // circle | square
  width = 70,
  height = 70,
}) {
  const getFallbackImage = () => {
    if (gender === "MALE") return male;
    if (gender === "FEMALE") return female;
    return dummy;
  };

  const finalSrc = src ? src : getFallbackImage();

  return (
    <img
      src={finalSrc}
      alt="user-avatar"
      className={`custom-avatar-container avatar-${type}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
