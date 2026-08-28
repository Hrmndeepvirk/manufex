import React, { useEffect, useMemo, useState } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomInput from '@shared/inputs/CustomInput';
import CustomDropdown from '@shared/inputs/CustomDropdown';
import CustomTextArea from '@shared/inputs/CustomTextArea';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import CashCalculator from '../CashCalculator/CashCalculator';
import { useSelector, useDispatch } from 'react-redux';
import { getDateTime } from "@utils/dateTime";
import {
  getCashRegisterById,
  startRegisterSession,
  getCashRegisters
} from '../../../store/pointOfSale/pointOfSaleActions';

export default function OpenRegisterDialog({ visible, setVisible }) {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    register: '',
    accessCode: '',
    totalCash: 0,
    comment: ''
  });
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  const [errors, setErrors] = useState({});

  const { cashRegisters } = useSelector((state) => state.pos);

  const registersDropdown = useMemo(
    () => cashRegisters?.filter((item) => item?.registerStatus !== 'OPEN') || [],
    [cashRegisters]
  );

  useEffect(() => {
    if (visible) {
      dispatch(getCashRegisters());
    }
  }, [dispatch, visible]);

  useEffect(() => {
    if (data?.register && access) {
      getCashRegisterById(data.register, setLoading)(dispatch).then((res) => {
        if (res?.success) {
          setRegisterData(res.data);
        }
      });
    }
  }, [access, data?.register, dispatch]);

  const onClose = () => {
    setVisible(false);
    setData({ register: '', accessCode: '', totalCash: 0, comment: '' });
    setAccess(null);
    setRegisterData(null);
    setErrors({});
  };

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFirstStep = () => {
    const newErrors = {};
    if (!data.register) {
      newErrors.register = 'Please select a register';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const onSubmit = () => {
    if (access) {


      const payload = {
        cashRegister: data.register,
        cashAtStart: data.totalCash,
        commentAtStart: data.comment,
        accessCode: data.accessCode,
      };

      dispatch(startRegisterSession(payload, setLoading, () => {
        onClose();
        dispatch(getCashRegisters());
      }));
    } else {
      if (!validateFirstStep()) {
        return;
      }

      setAccess(true);
    }
  };

  const registerStatus = registerData?.registerStatus;

  return (
    <CustomDialog
      title="Open Register"
      visible={visible}
      onHide={onClose}
      size={access ? 'large' : 'medium'}
    >
      {access ? (
        <>
          <CashCalculator onChange={handleChange} error={errors.totalCash} />
          <div className="grid mt-3">
            <div className="col-6">
              <CustomTextArea
                label="Comment"
                name="comment"
                value={data.comment}
                onChange={(e) => handleChange({ name: 'comment', value: e.target.value })}
              />
            </div>
            <div className="col-6">
              <div className="text-sm font-semibold mb-2">Last Close Out</div>
              <div className="border-round-md border-1 border-300 p-3">
                <div className="flex justify-content-between mb-2">
                  <span className="text-600">Closed By:</span>
                  <span className="font-medium">
                    {registerStatus?.closedBy?.firstName || ''} {registerStatus?.closedBy?.lastName || ''}
                  </span>
                </div>
                <div className="flex justify-content-between">
                  <span className="text-600">Closed At:</span>
                  <span className="font-medium">
                    {registerStatus?.updatedAt ? getDateTime(registerStatus.updatedAt) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-content-end gap-2 mt-4">
            <PrimaryButton
              label="Cancel"
              outlined
              onClick={onClose}
              disabled={loading}
            />
            <PrimaryButton
              label="Start Drawer"
              onClick={onSubmit}
              loading={loading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid">
            <div className="col-12">
              <CustomDropdown
                label="Register"
                name="register"
                value={data.register}
                onChange={(e) => handleChange({ name: 'register', value: e.value })}
                options={registersDropdown}
                errorMessage={errors.register}
                required
              />
            </div>
            {/* <div className="col-12">
              <CustomInput
                label="Access Code"
                name="accessCode"
                value={data.accessCode}
                onChange={(e) => handleChange({ name: 'accessCode', value: e.target.value })}
                type="password"
                autoComplete="off"
                errorMessage={errors.accessCode}
                required
              />
            </div> */}
          </div>

          <div className="flex justify-content-end gap-2 mt-4">
            <PrimaryButton
              label="Cancel"
              outlined
              onClick={onClose}
              disabled={loading}
            />
            <PrimaryButton
              label="Next"
              onClick={onSubmit}
              loading={loading}
            />
          </div>
        </>
      )}
    </CustomDialog>
  );
}
