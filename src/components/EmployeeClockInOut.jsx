import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomPassword from "@inputs/CustomPassword";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomTextArea from "@inputs/CustomTextArea";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import formValidation, { showFormErrors } from "@formValidations";
import defaultUser from "../assets/images/default-user.jpeg";
import {
  employeeCheckInOut,
  validateEmployeeForCheckIn,
} from "../store/checkin/checkinActions";
import CustomInput from "@shared/inputs/CustomInput";
import UserProfileImage from "../shared/userCards/UserProfileImage";
import AccessCodeConfirmDialog from "./AccessCodeConfirmDialog";

function EmployeeClockInOut({ visible, onHide }) {
  const dispatch = useDispatch();
  const [findLoading, setFindLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [employeeFound, setEmployeeFound] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const initialState = {
    employee: null,
    employeeCode: "",
    club: null,
    employeeName: "",
    department: null,
    isEmployeeActive: false,
    comment: "",
    formErrors: {},
  };
  const [data, setData] = useState(initialState);
  const companySettings = useSelector((state) => state.company.details);
  const { clockInDepartmentRequired } = companySettings || {};

  let _ignore = useMemo(() => {
    let arr = [];
    if (!clockInDepartmentRequired) {
      arr.push("department");
    }
    return arr;
  }, [employeeDetails]);

  function onFindEmployee(e) {
    e.preventDefault();
    if (showFormErrors(data, setData, ["club", "department"])) {
      dispatch(
        validateEmployeeForCheckIn(
          data?.employeeCode,
          setFindLoading,
          (res, error) => {
            if (error) {
              setData((prev) => ({
                ...prev,
                formErrors: {
                  ...prev.formErrors,
                  employeeCode: error,
                },
              }));
              return;
            } else {
              setEmployeeFound(true);
              setEmployeeDetails({
                clubs: res.clubs,
                departments: res.departments,
                employeeTimesheets: res.employeeTimesheet,
                employeeName: res.name,
                image: res.image,
                gender: res.gender,
                isEmployeeActive: res.isActive,
              });
              setData((prev) => ({
                ...prev,
                employee: res._id,
                club: res.clubs?.[0]?._id,
                department: res.departments?.[0]?._id,
              }));
            }
          },
        ),
      );
    }
  }

  const handleHide = () => {
    setData(initialState);
    setEmployeeFound(false);
    setEmployeeDetails({});
    setShowAccessCode(false);
    setPendingPayload(null);
    onHide();
  };

  const handleClockInOut = (e) => {
    e.preventDefault();
    if (!employeeFound) return;
    if (showFormErrors(data, setData, _ignore)) {
      const payload = {
        ...data,
        clockIn: new Date(),
        status:
          employeeDetails?.employeeTimesheets?.status === "CLOCK_IN"
            ? "CLOCK_OUT"
            : "CLOCK_IN",
      };
      setPendingPayload(payload);
      setShowAccessCode(true);
    }
  };

  const proceedClockInOut = () => {
    if (!pendingPayload) return;
    dispatch(
      employeeCheckInOut(
        data?.employee,
        pendingPayload,
        setSubmitLoading,
        () => {
          setShowAccessCode(false);
          setPendingPayload(null);
          handleHide();
        },
      ),
    );
  };

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, _ignore);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  function EmployeeCard({ name, isActive, imageUrl, col = 12 }) {
    const now = new Date();
    const date = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className={`c-col-12 md:c-col-${col}`}>
        <div className="surface-card border-round-xl p-2 w-full border-1 border-200">
          <div className="flex align-items-center gap-2">
            {/* Left side - Image */}
            <UserProfileImage
              src={employeeDetails?.image}
              gender={employeeDetails?.gender}
              height={60}
              width={60}
            />

            {/* Right side - Details */}
            <div className="flex flex-column justify-content-center w-full">
              {/* Name and Status Row */}
              <div className="flex align-items-center justify-content-between w-full">
                <h2 className="my-auto text-xl font-semibold text-900">
                  {name}
                </h2>
                <span
                  className={`text-sm font-medium border-round-xl px-2 py-1 text-center`}
                  style={{
                    minWidth: "80px",
                    border: "1px solid",
                    borderColor: isActive ? "#86efac" : "#fca5a5",
                    backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                    color: isActive ? "#15803d" : "#b91c1c",
                  }}
                >
                  {isActive ? "Active" : "Not Active"}
                </span>
              </div>

              {/* Date & Time */}
              <div>
                {date} | {time}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomDialog
        title="Employee Clock In/Out"
        visible={visible}
        onHide={handleHide}
      >
        <CustomForm
          onSubmit={handleClockInOut}
          submitLabel={
            employeeDetails?.employeeTimesheets?.status === "CLOCK_IN"
              ? "Clock Out"
              : "Clock In"
          }
          submitLoading={submitLoading}
          onCancel={() => {
            handleHide();
          }}
        >
          <CustomInput
            name="employeeCode"
            placeholder="Enter Employee Code"
            col={9}
            useGrouping={false}
            data={data}
            onChange={handleChange}
            hideLabel
          />
          <div className="c-col-12 md:c-col-3">
            <PrimaryButton
              type="button"
              className="w-full"
              label={"Find"}
              loading={findLoading}
              onClick={onFindEmployee}
            />
          </div>
          {employeeFound && (
            <>
              <EmployeeCard
                name={employeeDetails?.employeeName}
                isActive={employeeDetails?.isEmployeeActive}
              />

              <CustomDropdown
                name="club"
                options={employeeDetails.clubs}
                col={12}
                onChange={handleChange}
                data={data}
                required
              />
              <CustomDropdown
                name="department"
                showClear
                options={employeeDetails.departments}
                col={12}
                data={data}
                onChange={handleChange}
                required={clockInDepartmentRequired}
              />
            </>
          )}
          <CustomTextArea name="comment" onChange={handleChange} data={data} />
        </CustomForm>
      </CustomDialog>
      <AccessCodeConfirmDialog
        visible={showAccessCode}
        employeeId={data?.employee}
        onHide={() => {
          setShowAccessCode(false);
          setPendingPayload(null);
        }}
        onVerified={proceedClockInOut}
      />
    </>
  );
}
export default React.memo(EmployeeClockInOut);
