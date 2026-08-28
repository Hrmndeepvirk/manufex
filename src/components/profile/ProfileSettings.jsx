import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomImageInput from "../../shared/inputs/CustomImageInput";
import UserProfileImage from "../../shared/userCards/UserProfileImage";
import CustomCard from "../../shared/cards/CustomCard";
import CustomListItem from "../../shared/cards/CustomListItem";
import { getDate } from "../../utils/dateTime";
import { formatEnum } from "../../utils/common";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import ChangePasswordDialog from "./ChangePasswordDialog";

function ProfileSettings() {
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const profile = useSelector((state) => state.user.profile);

  return (
    <>
      <ChangePasswordDialog
        visible={changePasswordDialog}
        onHide={() => setChangePasswordDialog(false)}
        profile={profile}
      />
      <div className="c-grid p-2">
        <div className="c-col-12">
          <div className="c-grid p-3 border-round-lg  border-1 border-200">
            <div className="c-col-1">
              <UserProfileImage
                type="square"
                src={profile?.image}
                // gender={profile?.gender}
                height={140}
                width={140}
              />
            </div>
            <div className="flex flex-column my-auto gap-2 c-col-10">
              <div className="font-regular text-3xl">
                {profile?.firstName} {profile?.lastName}
              </div>
              <div>
                <div>
                  Employee ID : <span>{profile?.employeeId}</span>
                </div>
                <div>
                  Access Code : <span>{profile?.accessCode}</span>
                </div>
              </div>
            </div>

            <div className="c-col-1">
              <PrimaryButton
                label={"Change Password"}
                onClick={() => {
                  setChangePasswordDialog(true);
                  console.log("Password Changed!");
                }}
              />
            </div>
          </div>
        </div>

        <CustomCard title={"Profile Details"}>
          <CustomListItem
            data={profile}
            name="role"
            value={formatEnum(profile?.role)}
          />
          <CustomListItem data={profile} name="email" />
          <CustomListItem data={profile} name="primaryPhone" />
          <CustomListItem
            data={profile}
            name="hireDate"
            value={getDate(profile.hireDate)}
          />
          <CustomListItem data={profile} name="salesCode" />
        </CustomCard>
      </div>
    </>
  );
}

export default React.memo(ProfileSettings);
