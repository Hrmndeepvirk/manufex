// import React, { useState } from 'react';
// import CustomDialog from '@shared/overlays/CustomDialog';
// import CustomDropdown from '@shared/inputs/CustomDropdown';
// import CustomInput from '@shared/inputs/CustomInput';
// import { Checkbox } from 'primereact/checkbox';
// import PrimaryButton from '@shared/buttons/PrimaryButton';

// const PAYMENT_TYPES = [
//   { label: 'Cash', value: 'CASH' },
//   { label: 'Credit Card', value: 'CREDIT_CARD' },
//   { label: 'Debit Card', value: 'DEBIT_CARD' },
//   { label: 'Check', value: 'CHECK' },
//   { label: 'Pre-Pay', value: 'PRE_PAY' },
// ];

// export default function ReturnDialog({ visible, onCancel, onSave, loading, cartDetails, payType }) {
//   const [data, setData] = useState({
//     paymentType: payType || '',
//     accessCode: '',
//     printReceipt: false,
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = ({ name, value }) => {
//     setData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!data.paymentType) newErrors.paymentType = 'Payment type is required';
//     if (!data.accessCode) newErrors.accessCode = 'Access code is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     onSave(data);
//   };

//   const handleClose = () => {
//     setData({ paymentType: payType || '', accessCode: '', printReceipt: false });
//     setErrors({});
//     onCancel();
//   };

//   return (
//     <CustomDialog
//       title="Return Sale"
//       visible={visible}
//       onHide={handleClose}
//       size="medium"
//     >
//       <div className="mb-3">
//         <p className="text-600 mb-3">
//           Refund Amount: <strong>${cartDetails?.gradTotal?.toFixed(2) || '0.00'}</strong>
//         </p>
//         <p className="text-600">
//           Process a return for this sale. This action cannot be undone.
//         </p>
//       </div>

//       <div className="grid">
//         <div className="col-12">
//           <CustomDropdown
//             label="Refund Payment Type"
//             name="paymentType"
//             value={data.paymentType}
//             onChange={(e) => handleChange({ name: 'paymentType', value: e.value })}
//             options={PAYMENT_TYPES}
//             errorMessage={errors.paymentType}
//             required
//           />
//         </div>

//         <div className="col-12">
//           <CustomInput
//             label="Access Code"
//             name="accessCode"
//             value={data.accessCode}
//             onChange={(e) => handleChange({ name: 'accessCode', value: e.target.value })}
//             type="password"
//             autoComplete="off"
//             errorMessage={errors.accessCode}
//             required
//           />
//         </div>

//         <div className="col-12">
//           <div className="flex align-items-center">
//             <Checkbox
//               inputId="printReceipt"
//               checked={data.printReceipt}
//               onChange={(e) => handleChange({ name: 'printReceipt', value: e.checked })}
//             />
//             <label htmlFor="printReceipt" className="ml-2">
//               Print Receipt
//             </label>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-content-end gap-2 mt-4">
//         <PrimaryButton
//           label="Cancel"
//           outlined
//           onClick={handleClose}
//           disabled={loading}
//         />
//         <PrimaryButton
//           label="Process Return"
//           onClick={handleSubmit}
//           loading={loading}
//           severity="warning"
//         />
//       </div>
//     </CustomDialog>
//   );
// }


import React, { useState, useEffect } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomDropdown from '@shared/inputs/CustomDropdown';
import CustomInput from '@shared/inputs/CustomInput';
import { Checkbox } from 'primereact/checkbox';
import PrimaryButton from '@shared/buttons/PrimaryButton';

const PAYMENT_TYPES = [
  { label: 'Cash', value: 'CASH', _id: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD', _id: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD', _id: 'DEBIT_CARD' },
  { label: 'Check', value: 'CHECK', _id: 'CHECK' },
  { label: 'Pre-Pay', value: 'PRE_PAY', _id: 'PRE_PAY' },
];

export default function ReturnDialog({ visible, onCancel, onSave, loading, cartDetails, payType }) {
  const [data, setData] = useState({
    paymentType: '',
    accessCode: '',
    printReceipt: false,
  });
  const [errors, setErrors] = useState({});

  // Update paymentType when payType changes
  useEffect(() => {
    if (payType) {
      setData((prev) => ({ ...prev, paymentType: payType }));
    }
  }, [payType]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!data.paymentType) newErrors.paymentType = 'Payment type is required';
    if (!data.accessCode) newErrors.accessCode = 'Access code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(data);
  };

  const handleClose = () => {
    setData({ paymentType: '', accessCode: '', printReceipt: false });
    setErrors({});
    onCancel();
  };

  return (
    <CustomDialog
      title="Return Sale"
      visible={visible}
      onHide={handleClose}
      size="medium"
    >
      <div className="mb-3">
        <p className="text-600 mb-3">
          Refund Amount: <strong>${cartDetails?.gradTotal?.toFixed(2) || '0.00'}</strong>
        </p>
        <p className="text-600">
          Process a return for this sale. This action cannot be undone.
        </p>
      </div>

      <div className="grid">
        <div className="col-12">
          <CustomDropdown
            label="Refund Payment Type"
            name="paymentType"
            value={data.paymentType}
            onChange={(e) => handleChange({ name: 'paymentType', value: e.value })}
            options={PAYMENT_TYPES}
            optionLabel="label"
            optionValue="value"
            errorMessage={errors.paymentType}
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

        <div className="col-12">
          <div className="flex align-items-center">
            <Checkbox
              inputId="printReceipt"
              checked={data.printReceipt}
              onChange={(e) => handleChange({ name: 'printReceipt', value: e.checked })}
            />
            <label htmlFor="printReceipt" className="ml-2">
              Print Receipt
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton
          label="Cancel"
          outlined
          onClick={handleClose}
          disabled={loading}
        />
        <PrimaryButton
          label="Process Return"
          onClick={handleSubmit}
          loading={loading}
          severity="warning"
        />
      </div>
    </CustomDialog>
  );
}