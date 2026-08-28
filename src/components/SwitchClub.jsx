import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import CustomDialog from "@shared/overlays/CustomDialog";
import { getAllDropdownDataAction } from "@store/dropdown/dropdownActions";
import { incrementClubVersion } from "@store/common/commonSlice";
import { resetCalendarCache } from "../store/calendar/calendarSlice";
function SwitchClub({ visible, onHide }) {
  
  const dispatch = useDispatch();
  const dropdownClubs = useSelector((state) => state?.dropdown?.clubs);
  const profileClubs = useSelector((state) => state?.user?.profile?.clubs);
  const clubOptions = useMemo(
    () => (dropdownClubs?.length ? dropdownClubs : profileClubs || []),
    [dropdownClubs, profileClubs],
  );

  const [selectedClub, setSelectedClub] = useState(null);
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      dispatch(getAllDropdownDataAction(setLoading));
    }
  }, [dispatch, visible]);

  const normalizedClubOptions = useMemo(
    () =>
      clubOptions.map((club) => ({
        ...club,
        title: club?.title || club?.name || "",
      })),
    [clubOptions],
  );

  // Set default from localStorage
  useEffect(() => {
    if (!visible || normalizedClubOptions?.length === 0) return;

    const storedClubId = localStorage.getItem("club");
    const matchedClub = storedClubId
      ? normalizedClubOptions.find((club) => club._id === storedClubId)
      : null;
    setSelectedClub(matchedClub || normalizedClubOptions?.[0] || null);
  }, [visible, normalizedClubOptions]);

  const handleChange = (e) => {
    const selected = normalizedClubOptions.find(
      (club) => club._id === e.target.value
    );
    setSelectedClub(selected);
  };

  return (
    <CustomDialog title="Switch Club" visible={visible} onHide={onHide}>
      <CustomDropdown
        name="club"
        label="Select Club"
        options={normalizedClubOptions}
        optionLabel="title"
        optionValue="_id"
        value={selectedClub?._id || ""}
        onChange={handleChange}
      />

      <div className="flex justify-content-end gap-2 mt-3">
        <PrimaryButton
          onClick={() => {
            localStorage.setItem("club", selectedClub?._id);
            dispatch(resetCalendarCache());
            dispatch(incrementClubVersion());
            onHide();
          }}
          label="Change Club"
        />
        <PrimaryButton onClick={onHide} label="Cancel" severity="secondary" />
      </div>
    </CustomDialog>
  );
}

export default React.memo(SwitchClub);
