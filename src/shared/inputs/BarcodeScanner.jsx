import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Dialog } from "primereact/dialog";

function BarcodeScanner({
  visible,
  onHide,
  onScan,
  title = "Scan Barcode",
}) {
  const handleUpdate = (_err, result) => {
    const scannedValue = result?.text?.trim();

    if (scannedValue) {
      onScan?.(scannedValue);
      onHide?.();
    }
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      onHide={onHide}
      draggable={false}
      resizable={false}
      blockScroll
      style={{ width: "min(92vw, 560px)" }}
    >
      <div className="flex flex-column gap-3">
        <p className="m-0 text-sm text-600">
          Point your camera at the UPC barcode. The scanned value will be added
          to the input automatically.
        </p>

        {visible && (
          <BarcodeScannerComponent
            className="barcode-scanner"
            width={480}
            height={320}
            onUpdate={handleUpdate}
            stopStream={!visible}
          />
        )}
      </div>
    </Dialog>
  );
}

export default React.memo(BarcodeScanner);
