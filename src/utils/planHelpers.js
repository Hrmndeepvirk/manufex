import moment from "moment";

const checkAgeValidity = (dob, minimumAge, maximumAge) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minimumAge && age <= maximumAge;
};

const getDueDate = ({
  paymentOption,
  specificDate = null,
  daysFromBeginDate = 0,
  beginDate,
}) => {
  const currentDate = moment(beginDate);
  switch (paymentOption) {
    case "NO_DUE_DATE":
      return null;

    case "DAYS_FROM_BEGIN_DATE":
      return currentDate.add(daysFromBeginDate, "days").toDate();

    case "SPECIFIC_DATE":
      if (!specificDate || !moment(specificDate).isValid()) return null;
      const specificMoment = moment(specificDate);
      const yearsToAdd = currentDate.diff(specificMoment, "years") + 1;
      if (specificMoment.isBefore(currentDate, "day")) {
        specificMoment.add(yearsToAdd, "years");
      }

      return specificMoment.toDate();

    default:
      throw new Error("Invalid payment option.");
  }
};

const roundOfNumber = (num) => {
  num = num * 100;
  num = Math.round(num);
  return num / 100;
};

const calculateFinalAmount = (amount, tax) => {
  let finalAmount = amount * (1 + tax / 100);
  return roundOfNumber(finalAmount);
};

export { checkAgeValidity, getDueDate, calculateFinalAmount };
