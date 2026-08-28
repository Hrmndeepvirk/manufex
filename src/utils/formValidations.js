import {
  whiteSpaceCheck,
  validMeaningfulStringCheck,
  validDescriptionCheck,
  emailValidation,
  passwordValidation,
  firstLetterToUppercase,
} from "./regex";
import { entries, values, notEqual } from "./javascript";

const showFormErrors = (data, setData, ignore, required = []) => {
  let formErrors = {};

  if (required?.length) {
    entries(data).forEach(([key, value]) => {
      formErrors = {
        ...formErrors,
        [key]: requiredFieldsValidation(key, value, data, required)[key] || "",
      };
    });
  } else {
    entries(data).forEach(([key, value]) => {
      formErrors = {
        ...formErrors,
        [key]: formValidation(key, value, data, ignore)[key] || "",
      };
    });
  }

  ignore?.forEach((name) => {
    if (formErrors[name]) {
      formErrors[name] = "";
    }
  });
  setData((prev) => ({ ...prev, formErrors }));
  setTimeout(() => {
    const element = document.getElementById("error-element");
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
  return !values(formErrors).some((v) => notEqual(v, ""));
};

const formValidation = (name, value, state, ignore = []) => {
  let formErrors = { ...state.formErrors };

  if (ignore.includes(name)) {
    formErrors[name] = "";
    return formErrors;
  }

  switch (true) {
    
    case name === "address": {
      let addressValue = value;
      if (typeof value === "object" && value?.value?.label) {
        addressValue = value.value.label; // Use the display label for validation
      } else if (typeof value === "object" && value?.value) {
        addressValue = value.value; // Fallback
      }
      if (!addressValue) {
        formErrors[name] = "Address is required!";
      } else if (whiteSpaceCheck(addressValue)) {
        formErrors[name] = "Unnecessary space!";
      } else if (validMeaningfulStringCheck(addressValue)) {
        formErrors[name] = "Please enter a valid value!";
      } else {
        formErrors[name] = "";
      }
      break;
    }
    // email field
    case name === "email":
      if (!value) {
        formErrors[name] = "Email is required!";
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space in email!";
      } else if (!emailValidation(value)) {
        formErrors[name] = "Please enter a valid email!";
      } else {
        formErrors[name] = "";
      }
      break;
    case name === "otpCode":
      if (!value) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (value.toString().length !== 6) {
        formErrors[name] = "OTP must be 6 digits!";
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space in OTP!";
      } else {
        formErrors[name] = "";
      }
      break;
    // password field
    case name === "password":
      if (!value) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
        console.log("formErrors", formErrors);
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space in password!";
      } else if (!passwordValidation(value)) {
        formErrors[name] =
          "Please enter a password with 8-16 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character!";
      } else {
        formErrors[name] = "";
      }
      break;

    case name === "confirmPassword":
      if (!value) {
        formErrors[name] = "Confirm Password is required!";
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space in password!";
      } else if (value !== state.password) {
        formErrors[name] = "Password do not match!";
      } else {
        formErrors[name] = "";
      }
      break;

    case name === "description":
      if (value === undefined) {
        formErrors[name] = "";
      } else if (validDescriptionCheck(value)) {
        formErrors[name] = "Please enter a valid value!";
      } else {
        formErrors[name] = "";
      }
      break;

    // text fields with same rules
    case textFields.includes(name):
      if (!value) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (whiteSpaceCheck(value)) {
        formErrors[name] = "Unnecessary space!";
      } else if (validMeaningfulStringCheck(value)) {
        formErrors[name] = "Please enter a valid value!";
      } else {
        formErrors[name] = "";
      }
      break;
    // number fields with same rules
    case numberFields.includes(name):
      if (!value) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case selectFields.includes(name):
      if (!value) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case multiSelectFields.includes(name):
      if (!value?.length) {
        formErrors[name] = `${firstLetterToUppercase(name)} are required!`;
      } else {
        formErrors[name] = "";
      }
      break;

    default:
      break;
  }

  return formErrors;
};

// arrays of fields
const textFields = [
  "accessCode",
  "name",
  "title",
  "shortName",
  "notes",
  "legalName",
  "firstName",
  "lastName",
  "departmentCode",
  "discountCode",
  "startTime",
  "endTime",
  "upc",
  "sku",
  "itemCaption",
  "glCode",
  "dueDate",
  "club",
  "department",
  "gender",
  "dob",
  "oldPassword",
  "emergencyContactName",
  "emergencyContactNumber",

  "certificationNumber",
  "issuer",
  "activationCode",
  "street",
  "city",
  "zipCode",
  "companyUrl",
  "tpn",
  "authToken",
];

const numberFields = [
  "points",
  "quantity",
  "employeeCode",
  "minimumQuantity",
  "defaultQuantity",
  "defaultMaxAttendes",
  "maximumQuantity",
  "primaryPhone",
  "mobilePhone",
  "barCode",
];

const selectFields = [
  "type",
  "eventLevel",
  "duration",
  "codeType",
  "jobTitle",
  "employeeId",
  "profitCenter",
  "category",
  "locationType",
  "resourceType",
  "catalogItem",
  "campaignGroup",
  "eventType",
  "member",
  "commissionGroup",
  "salesPerson",
  "campaign",
  "taskType",
  "assigneeScope",
  "club",
  "membershipType",
  "agreementTemplate",
];
const multiSelectFields = [
  "securityRoles",
  "clubs",
  "days",
  "locations",
  "services",
  "events",
  "catalogItems",
  "profitCenters",
  "categories",
  "assigneeDepartments",
  "assigneeEmployees",
  "agreementPlans",
];

const requiredFieldsValidation = (name, value, state, required = []) => {
  let formErrors = { ...state.formErrors };

  if (!required.includes(name)) {
    if (formErrors[name]) {
      formErrors[name] = "";
    }
    return formErrors;
  } else {
    const isEmptyArray = Array.isArray(value) && value.length === 0;
    if (value === undefined || value === null || value === "" || isEmptyArray) {
      formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
    } else if (whiteSpaceCheck(value) && typeof value === "string") {
      formErrors[name] = `Unnecessary space in word!`;
    } else {
      formErrors[name] = "";
    }
  }

  return formErrors;
};

export { showFormErrors, requiredFieldsValidation };
export default formValidation;
