const filters = {
  alpha: /[^a-zA-Z\s.\-']/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
  alphanumericHyphen: /[^a-zA-Z0-9\-]/g,
  address: /[^a-zA-Z0-9\s#,.\-/]/g,
  email: /[^a-zA-Z0-9@._\-+]/g,
  phone: /[^0-9()\-\s+]/g,
  taxId: /[^0-9\-]/g,
  zipCode: /[^0-9\-]/g,
  url: /[^a-zA-Z0-9:/.?&=\-_#%+@~]/g,
};

const maxLengths = {
  taxId: 10,
  phone: 15,
  zipCode: 10,
};

const fieldFilterMap = {
  legalName: "alpha",
  name: "alpha",
  firstName: "alpha",
  lastName: "alpha",
  city: "alpha",
  state: "alpha",
  country: "alpha",
  shortName: "alphanumeric",
  companyCode: "alphanumeric",
  batchId: "alphanumericHyphen",
  addressLine1: "address",
  addressLine2: "address",
  primaryEmail: "email",
  alternateEmail: "email",
  workNumber: "phone",
  workExtention: "phone",
  faxNumber: "phone",
  taxId: "taxId",
  zipCode: "zipCode",
  companyUrl: "url",
};

const fieldMaxLengthMap = {
  taxId: maxLengths.taxId,
  workNumber: maxLengths.phone,
  workExtention: maxLengths.phone,
  faxNumber: maxLengths.phone,
  zipCode: maxLengths.zipCode,
};

const sanitizeInput = (name, value) => {
  if (typeof value !== "string") return value;

  const filterKey = fieldFilterMap[name];
  if (filterKey && filters[filterKey]) {
    value = value.replace(filters[filterKey], "");
  }

  const maxLen = fieldMaxLengthMap[name];
  if (maxLen && value.length > maxLen) {
    value = value.slice(0, maxLen);
  }

  return value;
};

export default sanitizeInput;
