import React from "react";
import maleUser from "@assets/images/male-avatar.png";
import femaleUser from "@assets/images/female-avatar.png";
import defaultUser from "@assets/images/defaultImage.png";

function CustomUserImage({
  image,
  width = "4rem",
  height = "4rem",
  gender,
  square = false,
}) {
  const getFallbackImage = () => {
    if (gender?.toUpperCase() === "MALE") return maleUser;
    if (gender?.toUpperCase() === "FEMALE") return femaleUser;
    return defaultUser;
  };

  const finalImage = image || getFallbackImage();

  const borderRadius = square ? "10%" : "50%";

  return (
    <div className="flex align-items-center justify-content-center mr-3">
      <img
        src={finalImage}
        alt="User"
        className="border-1 border-200"
        style={{
          width,
          height,
          objectFit: "cover",
          borderRadius,
        }}
      />
    </div>
  );
}

export default React.memo(CustomUserImage);
