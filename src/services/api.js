import axiosInstance from "./axiosInstance";
import { store } from "../store";
import { isAuthenticatedAccess } from "./auth";

let pendingForbiddenRequest = null;
let pendingForbiddenFallback = null;
let pendingForbiddenDeferred = null;

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function clonePayload(value) {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (value instanceof FormData) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => clonePayload(item));
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function buildResponseFromError(error) {
  let { success, message, data, formErrors } = error?.response?.data || {};
  let status = error?.response?.status || 500;

  return {
    status,
    success: success || false,
    message: message || "Oops! Something went wrong.",
    data: data || null,
    formErrors: formErrors || null,
  };
}

function shouldShowForbiddenPopup(message, options) {
  if (options?.showForbiddenPopup === false) {
    return false;
  }

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const normalizedMessage = (message || "").toLowerCase();

  if (
    pathname.startsWith("/settings/employee-setup") &&
    normalizedMessage.includes("view members")
  ) {
    return false;
  }

  return true;
}

function clearPendingForbiddenRequest() {
  pendingForbiddenRequest = null;
  pendingForbiddenFallback = null;
  pendingForbiddenDeferred = null;
}

function storePendingForbiddenRequest(request, fallbackResponse) {
  if (pendingForbiddenDeferred?.resolve) {
    pendingForbiddenDeferred.resolve(pendingForbiddenFallback);
  }

  pendingForbiddenRequest = request;
  pendingForbiddenFallback = fallbackResponse;
  pendingForbiddenDeferred = createDeferred();

  return pendingForbiddenDeferred.promise;
}

async function retryPendingForbiddenRequest() {
  if (!pendingForbiddenRequest || !pendingForbiddenDeferred) {
    return null;
  }

  const request = pendingForbiddenRequest;
  const deferred = pendingForbiddenDeferred;
  const access = isAuthenticatedAccess();

  clearPendingForbiddenRequest();

  try {
    const response = await axiosInstance({
      method: request.method,
      url: request.url,
      data: request.data,
      params: request.params,
      headers: {
        "Content-Type": request.contentType,
        club: localStorage.getItem("club") || "",
        ...(access?.token ? { "x-access-token": access.token } : {}),
      },
    });

    const res = response.data;
    deferred.resolve({
      success: res.success,
      message: res.message,
      data: res.data,
      meta: res.meta,
    });
  } catch (error) {
    deferred.resolve(buildResponseFromError(error));
  }

  return deferred.promise;
}

function cancelPendingForbiddenRequest() {
  if (!pendingForbiddenDeferred) {
    return null;
  }

  const deferred = pendingForbiddenDeferred;
  const fallback = pendingForbiddenFallback || {
    status: 403,
    success: false,
    message: "Access denied.",
    data: null,
    formErrors: null,
  };

  clearPendingForbiddenRequest();
  deferred.resolve(fallback);
  return deferred.promise;
}

const api = async (
  method,
  url,
  data = {},
  params = {},
  contentType = "application/json",
  options = {},
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
      headers: {
        "Content-Type": contentType,
        club: localStorage.getItem("club") || "",
      },
    });
    let res = response.data;
    return {
      success: res.success,
      message: res.message,
      data: res.data,
      meta: res.meta,
    };
  } catch (error) {
    console.log("API Error:", error);
    const fallbackResponse = buildResponseFromError(error);

    if (fallbackResponse.status === 403) {
      if (!shouldShowForbiddenPopup(fallbackResponse.message, options)) {
        return fallbackResponse;
      }

      store.dispatch({
        type: "common/setIsForbidden",
        payload: {
          isForbidden: true,
          message: fallbackResponse.message,
        },
      });

      return await storePendingForbiddenRequest(
        {
          method,
          url,
          data: clonePayload(data),
          params: clonePayload(params),
          contentType,
        },
        fallbackResponse,
      );
    }

    if (fallbackResponse.status === 401) {
      store.dispatch({
        type: "common/setIsUnAuthenticated",
        payload: {
          isUnAuthenticated: true,
          message: fallbackResponse.message,
        },
      });
    }

    if (fallbackResponse.formErrors) {
      setTimeout(() => {
        const element = document.getElementById("error-element");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }

    return fallbackResponse;
  }
};

export {
  cancelPendingForbiddenRequest,
  retryPendingForbiddenRequest,
};

export default api;
