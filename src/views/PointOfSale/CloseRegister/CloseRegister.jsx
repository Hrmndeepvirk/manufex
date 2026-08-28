import React, { useEffect, useMemo, useState } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomInput from '@shared/inputs/CustomInput';
import CustomDropdown from '@shared/inputs/CustomDropdown';
import CustomTextArea from '@shared/inputs/CustomTextArea';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import CashCalculator from '../CashCalculator/CashCalculator';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCashRegisterById,
  endRegisterSession,
  getCashRegisters
} from '../../../store/pointOfSale/pointOfSaleActions';
import { setSelectedDrawer } from '../../../store/pointOfSale/pointOfSaleSlice';
import {  getDateTime } from "@utils/dateTime";

export default function CloseRegisterDialog({ visible, setVisible }) {
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

  const { cashRegisters, selectedDrawer } = useSelector((state) => state.pos);

  const registersDropdown = useMemo(
    () => cashRegisters?.filter((item) => item?.registerStatus === 'OPEN') || [],
    [cashRegisters]
  );

  const [sales, setSales] = useState({ cash: 0, cheque: 0 });
  const [addDrop, setAddDrop] = useState({ add: 0, drop: 0 });

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

          if (res.data?.sales) {
            setSales({
              cash: res.data.sales.CASH || 0,
              cheque: res.data.sales.CHEQUE || 0
            });
          }
          if (res.data?.addDrop) {
            setAddDrop({
              add: res.data.addDrop.ADD || 0,
              drop: res.data.addDrop.DROP || 0
            });
          }
        }
      });
    }
  }, [access, data?.register, dispatch]);

  const onClose = () => {
    setVisible(false);
    setData({ register: '', accessCode: '', totalCash: 0, comment: '' });
    setAccess(null);
    setRegisterData(null);
    setSales({ cash: 0, cheque: 0 });
    setAddDrop({ add: 0, drop: 0 });
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
    if (!data.accessCode) {
      newErrors.accessCode = 'Please enter access code';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const register = registerData;
  const registerStatus = register?.registerStatus;
  const registerSessionId = registerStatus?._id; 
  // const openedBy = `${registerStatus?.openedBy?.firstName || ''} ${registerStatus?.openedBy?.lastName || ''}`.trim();
const openedAt = registerStatus?.createdAt ? getDateTime(registerStatus.createdAt) : 'N/A';
  const cashAtStart = registerStatus?.cashAtStart || 0;
  const totalCash = data?.totalCash || 0;
  const cashSale = sales?.cash || 0;
  const cashAdd = addDrop?.add || 0;
  const cashDrop = addDrop?.drop || 0;
  const amountToLeftIn = register?.amountToLeftIn || 0;

  const cashDifference = useMemo(() => {
    let _total = cashAtStart + cashSale + cashAdd;
    _total = _total - cashDrop;
    return totalCash - _total;
  }, [cashAtStart, cashSale, totalCash, cashAdd, cashDrop]);

  const totalCashAtEnd = useMemo(() => {
    return cashAtStart + cashSale + cashAdd - cashDrop;
  }, [cashAtStart, cashSale, cashAdd, cashDrop]);

  const totalCashOut = useMemo(() => {
    return totalCash - amountToLeftIn;
  }, [totalCash, amountToLeftIn]);

  const onSubmit = () => {
    if (access) {
    

   
      const payload = {
        id: registerSessionId, 
        cashRegister: data.register,
        accessCode: data.accessCode, 
        cashAtEnd: data.totalCash,
        totalCashSale: cashSale,
        cashDifference,
        totalCashAtEnd,
        cashLeftIn: amountToLeftIn,
        totalCashOut,
        commentAtEnd: data.comment,
      };

      dispatch(endRegisterSession(payload, setLoading, () => {
        onClose();

        if (selectedDrawer === data.register) {
          dispatch(setSelectedDrawer(''));
          localStorage.removeItem('drawer');
        }

        dispatch(getCashRegisters());
      }));
    } else {
      if (!validateFirstStep()) {
        return;
      }

      setAccess(true);
    }
  };

  return (
    <CustomDialog
      title="Close Register"
      visible={visible}
      onHide={onClose}
      size={access ? 'full' : 'medium'}
    >
      {access ? (
        <>
          <div className="grid">
            <div className="col-3">
              <div className="border-round-md border-1 border-300 p-3 mb-3">
                <div className="flex justify-content-between mb-2">
                  <span className="text-600">Drawer Name:</span>
                  <span className="font-medium">{register?.title || 'N/A'}</span>
                </div>
                <div className="flex justify-content-between mb-2">
                  {/* <span className="text-600">Opened By:</span> */}
                  {/* <span className="font-medium">{openedBy || 'N/A'}</span> */}
                </div>
                <div className="flex justify-content-between">
                  <span className="text-600">Opened At:</span>
                  <span className="font-medium">{openedAt }</span>
                </div>
              </div>
              <CustomTextArea
                label="Comment"
                name="comment"
                value={data.comment}
                onChange={(e) => handleChange({ name: 'comment', value: e.target.value })}
              />
            </div>

            <div className="col-9">
              <CashCalculator onChange={handleChange} error={errors.totalCash} />

              <div className="grid mt-3">
                <div className="col-6">
                  <div className="border-round-md border-1 border-300 p-3 mb-2">
                    <div className="flex justify-content-between">
                      <span className="text-600">Cheque Counted:</span>
                      <span className="font-medium text-green-600">-</span>
                    </div>
                  </div>

                  <div className="border-round-md border-1 border-300 p-3 mb-2">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Total Cheque in Drawer:</span>
                      <span className="font-medium text-green-600">${0}</span>
                    </div>
                    <div className="flex justify-content-between">
                      <span className="text-600">Total Cheque Sales:</span>
                      <span className="font-medium text-green-600">${sales?.cheque.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-round-md border-1 border-300 p-3">
                    <div className="flex justify-content-between">
                      <span className="text-600">Cheque Difference:</span>
                      <span className="font-medium text-green-600">${0}</span>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border-round-md border-1 border-300 p-3">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Cash at Start:</span>
                      <span className="font-medium text-green-600">${cashAtStart.toFixed(2)}</span>
                    </div>

                    {cashAdd > 0 && (
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Cash Add:</span>
                        <span className="font-medium text-green-600">${cashAdd.toFixed(2)}</span>
                      </div>
                    )}

                    {cashDrop > 0 && (
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Cash Drop:</span>
                        <span className="font-medium text-red-600">$-{cashDrop.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Total Cash Sales:</span>
                      <span className="font-medium text-green-600">${cashSale.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Expected Cash:</span>
                      <span className="font-medium text-blue-600">${totalCashAtEnd.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Actual Cash Counted:</span>
                      <span className="font-medium text-blue-600">${totalCash.toFixed(2)}</span>
                    </div>

                    {cashDifference !== 0 && (
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Cash Difference:</span>
                        <span className={`font-medium ${cashDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${cashDifference.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Amount to leave in Drawer:</span>
                      <span className="font-medium text-red-600">${amountToLeftIn.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-content-between border-top-1 border-300 pt-2">
                      <span className="text-600 font-semibold">Total Cash close out:</span>
                      <span className="font-semibold text-green-600">${totalCashOut.toFixed(2)}</span>
                    </div>
                  </div>
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
              label="Close Drawer"
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
            <div className="col-12">
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
