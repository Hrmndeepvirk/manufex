import api from "@api";
import endPoints from "@endPoints";
import { setEmployeeCertificates } from "../employeeSetupSlice";
import { uploadFiles } from "../../../common/commonActions";

const getEmployeeCertificates =
  (employeeId, setLoading) => async (dispatch) => {
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CERTIFICATION(
        employeeId,
      ),
    );
    if (res.success) {
      dispatch(setEmployeeCertificates(res.data));
    } else {
      next(null, res.formErrors);
    }
  };
const getEmployeeCertificate =
  (employeeId, id, setLoading, next) => async (dispatch) => {
    setLoading(true);
    const res = await api(
      "get",
      endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CERTIFICATION(
        employeeId,
      ) + id,
    );
    if (res.success) {
      next(res.data);
    }
    setLoading(false);
  };
const addOrUpdateEmployeeCertificate =
  (employeeId, id, data, setLoading, next) => async (dispatch) => {
    setLoading(true);

    if (data.certificates) {
      data.certificates = await uploadFiles(data.certificates);
    }

    console.log(data);

    let res;
    if (id) {
      res = await api(
        "put",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CERTIFICATION(
          employeeId,
        ) + id,
        data,
      );
    } else {
      res = await api(
        "post",
        endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CERTIFICATION(
          employeeId,
        ),
        data,
      );
    }

    if (res.success) {
      next(true, null);
    } else {
      next(null, res.formErrors);
    }
    setLoading(false);
  };
const deleteEmployeeCertificate = (employeeId, id) => async (dispatch) => {
  const res = await api(
    "delete",
    endPoints.SETTINGS.EMPLOYEE_SETUP.MANAGE_EMPLOYEE.CERTIFICATION(
      employeeId,
    ) + id,
  );
  if (res.success) {
    dispatch(getEmployeeCertificates(employeeId));
  }
};

export {
  getEmployeeCertificates,
  deleteEmployeeCertificate,
  addOrUpdateEmployeeCertificate,
  getEmployeeCertificate,
};
