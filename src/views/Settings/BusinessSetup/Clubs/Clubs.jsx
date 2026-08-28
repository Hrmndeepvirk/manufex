import { useEffect, useState } from "react";
import ListPageLayout from "@shared/layout/ListPageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getClub,
  getClubs,
  updateClub,
} from "@store/settings/business/clubActions";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "@inputs/CustomInput";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDialog from "@shared/overlays/CustomDialog";
import formValidation, { showFormErrors } from "@formValidations";
import CustomAddress from "@inputs/CustomAddress";
import CustomDropdown from "@shared/inputs/CustomDropdown";

const buildAddressValue = (club = {}) => {
  if (club?.address && typeof club.address === "object" && club.address.value) {
    return club.address;
  }

  const addressLine1 = club?.addressLine1 || "";
  const addressLine2 = club?.addressLine2 || "";
  const city = club?.city || "";
  const state = club?.state || "";
  const zipCode = club?.zipCode || "";
  const country = club?.country || "";

  if (!addressLine1 && !addressLine2 && !city && !state && !zipCode && !country) {
    return {};
  }

  return {
    value: [addressLine1, city, state, zipCode].filter(Boolean).join(", "),
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
  };
};

export default function Clubs() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubData, setClubData] = useState({
    name: "",
    email: "",
    address: {},
    agreementPlans: [],
    agreementPlan: null,
    isActive: true,
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const data = useSelector((state) => state.settings.business.clubs);

  useEffect(() => {
    dispatch(getClubs(setLoading));
  }, [dispatch]);

  useEffect(() => {
    if (selectedClub) {
      dispatch(
        getClub(selectedClub, setLoading, (res) => {
          setClubData({
            name: res?.name,
            email: res?.email,
            address: buildAddressValue(res),
            isActive: res?.isActive,
            agreementPlans: res?.agreementPlans,
            agreementPlan: res?.agreementPlan,
          });
        }),
      );
    }
  }, [dispatch, selectedClub]);

  let columns = [
    {
      field: "name",
      header: "Name",
      sortable: true,
    },
    { field: "email", header: "Email" },
    {
      field: "addressLine1",
      header: "Address",
      body: (row) =>
        row?.address?.value?.label ||
        row?.address?.value ||
        row?.addressLine1 ||
        "-",
    },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id) => {
    setShowEditDialog(true);
    setSelectedClub(id);
  };

  const onHide = () => {
    setShowEditDialog(false);
    setSelectedClub(null);
  };

  const handleChange = ({ name, value }) => {
    if (name === "address" && value && typeof value === "object") {
      setClubData((prev) => ({
        ...prev,
        address: value,
        formErrors: {
          ...prev.formErrors,
          address: "",
        },
      }));
      return;
    }

    let formErrors = formValidation(name, value, clubData);
    setClubData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (showFormErrors(clubData, setClubData, ["agreementPlans"])) {
      const { address, ...rest } = clubData;
      const payload = {
        ...rest,
        address,
        addressLine1: address?.addressLine1 || "",
        addressLine2: address?.addressLine2 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        country: address?.country || "",
      };

      dispatch(
        updateClub(
          selectedClub,
          payload,
          setLoading,
          (success, formErrors) => {
            if (success) {
              setLoading(false);
              onHide();
            } else {
              setClubData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };

  return (
    <>
      <CustomDialog title="Edit Club" visible={showEditDialog} onHide={onHide}>
        <CustomForm
          onSubmit={handleEdit}
          submitLoading={loading}
          onCancel={onHide}
        >
          <CustomInput
            data={clubData}
            onChange={handleChange}
            name="name"
            required
            col={12}
          />
          <CustomInput
            data={clubData}
            onChange={handleChange}
            name="email"
            required
            col={12}
          />

          <CustomAddress
            data={clubData}
            onChange={handleChange}
            name="address"
            label="Address"
            required
            col={12}
          />
          <CustomDropdown
            name="agreementPlan"
            data={clubData}
            onChange={handleChange}
            options={clubData.agreementPlans}
            col={12}
          />
          <CustomCheckbox
            data={clubData}
            onChange={handleChange}
            name="isActive"
            label="Active"
            col={12}
          />
        </CustomForm>
      </CustomDialog>
      <ListPageLayout
        tableData={data}
        columns={columns}
        loading={loading}
        onEdit={onEdit}
      />
    </>
  );
}
