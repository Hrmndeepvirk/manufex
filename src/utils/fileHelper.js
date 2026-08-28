const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1102";

import placeholderImage from "../assets/images/placeholder.png";

export const getFileURL = (path) => {
  console.log(path);

  if (typeof path === "string") {
    if (path.includes("http")) {
      return path;
    } else {
      return baseURL + path;
    }
  } else if (typeof path === "object") {
    if (path.url) {
      return path.url;
    }
    return URL.createObjectURL(path);
  } else {
    return "";
  }
};
export const getDefaultImage = () => {
  return placeholderImage;
};
export const base64ToFile = (base64, mime, fileName) => {
  const blob = base64ToBlob(base64, mime);
  return blobToFile(blob, fileName);
};
function base64ToBlob(base64, mime) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}
function blobToFile(blob, fileName) {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
}
