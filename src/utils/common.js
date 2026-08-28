const capitalizeCamelCase = (str) => {
  let words = str.split(/(?=[A-Z])/);
  let capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  let capitalizedString = capitalizedWords.join(" ");
  return capitalizedString;
};
const spaceToDash = (inputString) => {
  return inputString.replace(/ /g, "-").toLowerCase();
};
const dashToSpace = (inputString) => {
  return inputString
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDateForCalendar = (date) =>
  date instanceof Date && !isNaN(date) ? date.toISOString().split("T")[0] : "";

const formatEnum = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map((word, idx) =>
      idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
};

const capitalizeSnakeCase = (str) => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const capitalizeDashCase = (str) => {
  if (!str) return "";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Calculate distance between two addresses using lat/long
 * @param {Object} addressA
 * @param {Object} addressB
 * @param {"km" | "miles"} unit
 * @returns {number} distance
 */
function getDistanceBetweenAddresses(addressA, addressB, unit = "km") {
  if (!addressA?.location?.coordinates || !addressB?.location?.coordinates) {
    throw new Error("Invalid address object: coordinates missing");
  }

  const [lng1, lat1] = addressA.location.coordinates;
  const [lng2, lat2] = addressB.location.coordinates;

  const toRad = (value) => (value * Math.PI) / 180;

  const R = unit === "miles" ? 3958.8 : 6371; // Earth radius
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(2));
}

const debounce = (fn, delay = 1000) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export {
  capitalizeCamelCase,
  spaceToDash,
  dashToSpace,
  formatDateForCalendar,
  formatEnum,
  getDistanceBetweenAddresses,
  capitalizeSnakeCase,
  capitalizeDashCase,
  debounce,
};
