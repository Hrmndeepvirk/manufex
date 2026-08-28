import React, { useState } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomDropdown from '@shared/inputs/CustomDropdown';
import { Checkbox } from 'primereact/checkbox';
import PrimaryButton from '@shared/buttons/PrimaryButton';

const PAYMENT_TYPES = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'Check', value: 'CHECK' },
  { label: 'Pre-Pay', value: 'PRE_PAY' },
];

export default function CheckoutPopup({ visible, onCancel, onCheckout, cartDetails, payType }) {
  const [paymentType, setPaymentType] = useState(payType || '');
  const [printReceipt, setPrintReceipt] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!paymentType) {
      setError('Please select a payment type');
      return;
    }

    onCheckout({ paymentType, printReceipt });
  };

  const handleClose = () => {
    setPaymentType(payType || '');
    setPrintReceipt(false);
    setError('');
    onCancel();
  };

  return (
    <CustomDialog
      title="Select Refund Payment Type"
      visible={visible}
      onHide={handleClose}
      size="medium"
    >
      <div className="mb-3">
        <p className="text-600 mb-3">
          Refund Amount: <strong>${cartDetails?.gradTotal?.toFixed(2) || '0.00'}</strong>
        </p>
      </div>

      <div className="grid">
        <div className="col-12">
          <CustomDropdown
            label="Refund Payment Type"
            name="paymentType"
            value={paymentType}
            onChange={(e) => {
              setPaymentType(e.value);
              setError('');
            }}
            options={PAYMENT_TYPES}
            errorMessage={error}
            required
          />
        </div>

        <div className="col-12">
          <div className="flex align-items-center">
            <Checkbox
              inputId="printReceipt"
              checked={printReceipt}
              onChange={(e) => setPrintReceipt(e.checked)}
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
        />
        <PrimaryButton
          label="Continue"
          onClick={handleSubmit}
        />
      </div>
    </CustomDialog>
  );
}