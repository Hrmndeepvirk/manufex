import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomDropdown from "@inputs/CustomDropdown";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { updateMemberRelationships } from "@store/member/memberActions";

const RelationshipsDialog = ({ visible, onHide, memberData, memberId }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.dropdown.members);
  const [saving, setSaving] = useState(false);

  const normalizeId = (val) => {
    if (!val) return null;
    return typeof val === "object" ? val._id : val;
  };
  const normalizeIds = (arr) => {
    if (!arr?.length) return [];
    return arr.map((item) => (typeof item === "object" ? item._id : item)).filter(Boolean);
  };

  const [relData, setRelData] = useState({
    paysFor: [],
    paidBy: null,
    sharesWith: [],
    referrals: [],
    referredBy: null,
  });

  useEffect(() => {
    if (visible && memberData) {
      setRelData({
        paysFor: normalizeIds(memberData.paysFor),
        paidBy: normalizeId(memberData.paidBy),
        sharesWith: normalizeIds(memberData.sharesWith),
        referrals: normalizeIds(memberData.referrals),
        referredBy: normalizeId(memberData.referredBy),
      });
    }
  }, [visible, memberData]);

  const filteredMembers = members.filter((m) => m._id !== memberId);

  const handleChange = ({ name, value }) => {
    setRelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(
      updateMemberRelationships(memberId, relData, setSaving, (res) => {
        if (res) {
          if (memberData && typeof memberData === "object") {
            Object.assign(memberData, {
              paysFor: relData.paysFor,
              paidBy: relData.paidBy,
              sharesWith: relData.sharesWith,
              referrals: relData.referrals,
              referredBy: relData.referredBy,
            });
          }
          onHide();
        }
      }),
    );
  };

  return (
    <CustomDialog
      visible={visible}
      onHide={onHide}
      title="Edit Relationships"
    >
      <div className="c-grid">
        <CustomMultiSelect
          data={relData}
          onChange={handleChange}
          name="paysFor"
          label="Pays For"
          options={filteredMembers}
          col={12}
        />
        <CustomDropdown
          data={relData}
          onChange={handleChange}
          name="paidBy"
          label="Paid By"
          options={filteredMembers}
          showClear
          col={12}
        />
        <CustomMultiSelect
          data={relData}
          onChange={handleChange}
          name="sharesWith"
          label="Shares With"
          options={filteredMembers}
          col={12}
        />
        <CustomMultiSelect
          data={relData}
          onChange={handleChange}
          name="referrals"
          label="Referrals"
          options={filteredMembers}
          col={12}
        />
        <CustomDropdown
          data={relData}
          onChange={handleChange}
          name="referredBy"
          label="Referred By"
          options={filteredMembers}
          showClear
          col={12}
        />
        <div className="c-col-12 flex justify-content-end mt-2">
          <PrimaryButton
            label="Save"
            loading={saving}
            onClick={handleSave}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default RelationshipsDialog;
