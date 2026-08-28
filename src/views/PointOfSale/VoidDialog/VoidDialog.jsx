import React, { useState } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomInput from '@shared/inputs/CustomInput';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function VoidDialog({ visible, onCancel, onSave, loading }) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!accessCode) {
      setError('Access code is required');
      return;
    }
    onSave(accessCode);
  };

  const handleClose = () => {
    setAccessCode('');
    setError('');
    onCancel();
  };

  return (
    <CustomDialog
      title="Void Sale - Enter Access Code"
      visible={visible}
      onHide={handleClose}
      size="small"
    >
      <div className="mb-3">
        <p className="text-600">
          Are you sure you want to void this sale? This action cannot be undone.
        </p>
      </div>

      <CustomInput
        label="Access Code"
        name="accessCode"
        value={accessCode}
        onChange={(e) => {
          setAccessCode(e.target.value);
          setError('');
        }}
        type="password"
        autoComplete="off"
        errorMessage={error}
        required
      />

      <div className="flex justify-content-end gap-2 mt-4">
        <PrimaryButton
          label="Cancel"
          outlined
          onClick={handleClose}
          disabled={loading}
        />
        <PrimaryButton
          label="Void Sale"
          onClick={handleSubmit}
          loading={loading}
          severity="danger"
        />
      </div>
    </CustomDialog>
  );
}