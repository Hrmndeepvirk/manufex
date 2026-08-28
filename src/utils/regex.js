export const alphabeticStringValidation = (val) => {
  const regex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
  return regex.test(val);
};

export const regularString = (val) => {
  const regex =
    /^[\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?]+(?: [\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?]+)*$/;
  return regex.test(val);
};

export const stringValidation = (val) => {
  const regex = /^[a-zA-Z0-9_.-]*$/;
  return regex.test(val);
};

export const onlyAlphabeticStringValidation = (val) => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(val);
};

export const emailValidation = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
};

export const phoneValidation = (phone) => {
  const regex =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
  return regex.test(phone.toLowerCase());
};

export const passwordValidation = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  return regex.test(password);
};

export const spaceBetweenWords = (word) =>
  word.replace(/([a-z])([A-Z])/g, "$1 $2");

export const number = (value) => {
  const regex = /^[0-9]+$|^$/;
  return regex.test(value);
};
export const isNumberOrDecimal = (value) => {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(value);
};

export const floatFromString = (value) => {
  const regex = /[+-]?\d+(\.\d+)?/g;
  return value.match(regex).map(function f(v) {
    return parseFloat(v);
  });
};

export const whiteSpaceCheck = (value) => {
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (value !== trimmed) return true;
  if (trimmed.includes("  ")) return true;
  const invisibleRegex =
    /[\u0009-\u000D\u00A0\u1680\u180E\u2000-\u200F\u202F\u205F\u2060\u3000\u3164\uFEFF\uFFA0\u2800\u061C]/;
  if (invisibleRegex.test(trimmed)) return true;
  return false;
};

export const validMeaningfulStringCheck = (value) => {
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  const symbolCount = (trimmed.match(/[^A-Za-z0-9\s]/g) || []).length;
  const totalLength = trimmed.length;
  if (symbolCount === totalLength || symbolCount / totalLength > 0.5)
    return true;
  return false;
};

export const validDescriptionCheck = (value) => {
  const trimmed = value.trim();
  if (trimmed.length <= 2) return false;
  const allowedRegex = /^[A-Za-z0-9\s.,!?'"@#$%&*()\-_=+/;:<>[\]{}|\\`~^]*$/;
  if (!allowedRegex.test(trimmed)) return true;
  const textCount = (trimmed.match(/[A-Za-z0-9]/g) || []).length;
  const symbolCount = (trimmed.match(/[^A-Za-z0-9\s]/g) || []).length;
  const totalLength = trimmed.length;
  if (textCount === 0) return true;
  if (symbolCount / totalLength > 0.6) return true;
  return false;
};

export const firstLetterToUppercase = (value) =>
  spaceBetweenWords(value.replace(/\b\w/g, (c) => c.toUpperCase()));

export const specialCharacters = (value) =>
  /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value);
