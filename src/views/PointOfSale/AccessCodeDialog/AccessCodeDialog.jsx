import React, { useState } from 'react';
import CustomDialog from '@shared/overlays/CustomDialog';
import CustomInput from '@shared/inputs/CustomInput';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function AccessCodeDialog({ visible, onCancel, onSave, loading, title = "Access Code" }) {
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
      title={title}
      visible={visible}
      onHide={handleClose}
      size="small"
    >
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
          label="Save"
          onClick={handleSubmit}
          loading={loading}
        />
      </div>
    </CustomDialog>
  );
}