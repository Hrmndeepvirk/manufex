import React, { useState, useEffect } from "react";
import { addMemberToEvent } from "@store/calendar/calendarEventActions";
import CustomDialog from "@shared/overlays/CustomDialog";
import { CustomSimpleSelectionTable } from "../../../../shared/table/CustomSimpleTable";
import { useDispatch, useSelector } from "react-redux";
import { getMembers } from "@store/member/memberActions";
import PrimaryButton from "../../../../shared/buttons/PrimaryButton";
import { getDate } from "../../../../utils/dateTime";

export default function AddMemberDialog({
  visible,
  onHide,
  calendarEventId,
  onSuccess,
  max,
  enrolled,
  excludedMemberIds = [],
}) {
  const dispatch = useDispatch();
  const memberList = useSelector((state) => state.member.members || []);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const memberColumns = [
    { field: "firstName", header: "First Name" },
    { field: "lastName", header: "Last Name" },
    { field: "barCode", header: "Barcode" },
    {
      field: "dob",
      header: "Birth Date",
      body: (row) => (row?.dob ? getDate(row?.dob) : ""),
    },
    { field: "primaryPhone", header: "Primary Phone" },
  ];

  const isFull = Number(enrolled) >= Number(max);
  const remainingSlots = Number(max) - Number(enrolled);

  useEffect(() => {
    dispatch(getMembers());
  }, [dispatch]);

  const handleCancel = () => {
    setSelectedMembers([]);
    setError("");
    setActivated(false);
    onHide();
  };

  const handleSearchActivity = (e) => {
    // find all inputs inside the table wrapper
    const wrapper = e.currentTarget;
    const inputs = wrapper.querySelectorAll("input");
  
    const hasValue = [...inputs].some(
      (input) => input.type !== "checkbox" && input.value.trim() !== "",
    );
  
    setActivated(hasValue);
  };

  
  const handleAddMembers = () => {
    if (isFull) {
      setError(`Only ${max} members are allowed for this event.`);
      return;
    }

    if (!selectedMembers || selectedMembers.length === 0) {
      setError("Please select at least one member");
      return;
    }

    if (selectedMembers.length > remainingSlots) {
      setError(
        `You can only add ${remainingSlots} member${remainingSlots > 1 ? "s" : ""}.`,
      );
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    const addMemberPromises = selectedMembers.map((member) => {
      return new Promise((resolve) => {
        const data = {
          calendarEventId: calendarEventId,
          memberId: member._id,
        };

        dispatch(
          addMemberToEvent(data, null, (success, errors) => {
            if (success) {
              successCount++;
            } else {
              failCount++;
            }
            resolve();
          }),
        );
      });
    });

    Promise.all(addMemberPromises).then(() => {
      setLoading(false);
      if (successCount > 0) {
        setSelectedMembers([]);
        setError("");
        onHide();
        if (onSuccess) onSuccess(selectedMembers);
      } else {
        setError("Failed to add members");
      }
    });
  };

  return (
    <CustomDialog
      title="Add Members"
      visible={visible}
      size="large"
      onHide={handleCancel}
    >
      {error && (
        <div className="p-3 mb-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* <CustomSimpleSelectionTable
        columns={memberColumns}
        data={memberList.filter(
          (member) => !excludedMemberIds.includes(member._id),
        )}
        preselectedRows={selectedMembers}
        searchFields={[
          "firstName",
          "lastName",
          "barCode",
          "dob",
          "primaryPhone",
        ]}
        onSelectionChange={(row) => setSelectedMembers(row)}
      /> */}

<div onKeyUp={handleSearchActivity}>
  <CustomSimpleSelectionTable
    columns={memberColumns}
    data={activated ? memberList : []}
    preselectedRows={selectedMembers}
    searchFields={[
      "firstName",
      "lastName",
      "barCode",
      // "dob",
      // "primaryPhone",
    ]}
    onSelectionChange={(row) => setSelectedMembers(row)}
  />
</div>



      <div className="flex justify-content-end gap-2 mt-3">
        <PrimaryButton
          label="Add"
          onClick={handleAddMembers}
          disabled={loading || selectedMembers.length === 0}
        />
        <PrimaryButton
          label="Cancel"
          severity="secondary"
          onClick={handleCancel}
          disabled={loading}
        />
      </div>
    </CustomDialog>
  );
}
