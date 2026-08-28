import moment from "moment";

const getDate = (date) => {
  return moment(date).format("MM/DD/YYYY");
};

const getTime = (time) => {
  return moment(time, "HH:mm").format("hh:mm A");
};

const getDateTime = (date) => {
  return moment(date).format("MM/DD/YYYY hh:mm A");
};

const getOnlyDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN");
};

function addMinutes(time, minsToAdd) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minsToAdd);

  const newH = String(date.getHours()).padStart(2, "0");
  const newM = String(date.getMinutes()).padStart(2, "0");

  return `${newH}:${newM}`;
}

const getMinutesAgo = (date) => {
  const now = moment();
  const then = moment(date);
  const minutesAgo = now.diff(then, "minutes");
  return minutesAgo;
};

function substractYears(years) {
  const newDate = new Date();
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
}

export {
  getDate,
  getTime,
  getDateTime,
  addMinutes,
  getOnlyDate,
  getMinutesAgo,
  substractYears,
};
