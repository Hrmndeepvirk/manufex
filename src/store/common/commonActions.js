import api from "@api";
import endPoints from "@endPoints";
import { toast } from "react-hot-toast";
import { authenticateAccess } from "@services/auth";

import { clearMessage, clearToast, setMessage, setToast } from "./commonSlice";

const showToastAction =
  ({ title, description, type = "info", life = 3000 }) =>
  async (dispatch) => {
    dispatch(setToast({ title, description, type, life }));
    setTimeout(() => {
      dispatch(clearToast());
    }, 100);
  };

const displayToast =
  ({
    title = "",
    description = "",
    type = "info",
    life = 3000,
    promise,
    messages,
  }) =>
  () => {
    // PROMISE TOAST MODE
    if (promise) {
      toast.promise(promise, {
        loading: messages?.loading || title || "Loading...",
        success: messages?.success || title || "Success",
        error: messages?.error || title || "Something went wrong",
        duration: life,
      });
      return;
    }

    // NORMAL TOAST MODE
    // toast[type](`${title}${description ? description : ""}`, {
    //   duration: life,
    // });

    toast[type](`${title}${description ? description : ""}`, {
      duration: life,
      style: {
        gap: "10px",
        display: "flex",
        alignItems: "center",
      },
    });
  };

const showMessageAction =
  ({ title, description, type = "info", life = 3000 }) =>
  async (dispatch) => {
    dispatch(setMessage({ title, description, type, life }));
    setTimeout(() => {
      dispatch(clearMessage());
    }, 100);
  };

const requestAccess = (payload, setLoading, next) => async (dispatch) => {
  setLoading(true);
  const res = await api("post", endPoints.ACCESS, payload);
  if (res.success) {
    authenticateAccess(res.data.token, () => {
      // dispatch(showToastAction({ description: res.message, type: "success" }));
      next(true, null);
    });
  } else {
    next(null, res.formErrors);
  }
  setLoading(false);
};

const uploadFile = async (file) => {
  if (!file) {
    return null;
  }
  if (isBase64Image(file)) {
    file = base64ToFile(file, "upload_image.png");
  }
  if (typeof file === "string") {
    return file;
  } else {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api(
      "post",
      endPoints.UPLOAD_FILE,
      formData,
      {},
      "multipart/form-data",
    );

    if (res.success && res.data) {
      return res.data.url;
    }
  }
};

const upload = async (file) => {
  if (!file) {
    return null;
  }
  if (isBase64Image(file)) {
    file = base64ToFile(file, "upload_image.png");
  }
  if (typeof file === "string") {
    return file;
  } else {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api(
      "post",
      endPoints.UPLOAD_FILE,
      formData,
      {},
      "multipart/form-data",
    );

    if (res.success && res.data) {
      return res.data;
    }
  }
};

const uploadFiles = async (files) => {
  const uploadedFiles = [];
  for (let i = 0; i < files.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    if (files[i]?.url) {
      return files[i];
    } else {
      const uploadedFile = await upload(files[i]);
      if (uploadedFile) {
        uploadedFiles.push(uploadedFile);
      }
    }
    return uploadedFiles;
  }
};
const uploadImages = async (files) => {
  const uploadedFiles = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i]?.url) {
      uploadedFiles.push(files[i]);
    } else {
      const uploadedFile = await uploadFile(files[i]);
      if (uploadedFile) {
        uploadedFiles.push(uploadedFile);
      }
    }
  }
  return uploadedFiles;
};

export {
  showToastAction,
  displayToast,
  showMessageAction,
  requestAccess,
  uploadFile,
  uploadFiles,
  uploadImages,
};
// helper.js
function base64ToFile(base64String, filename) {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

function isBase64Image(str) {
  return /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(str);
}
