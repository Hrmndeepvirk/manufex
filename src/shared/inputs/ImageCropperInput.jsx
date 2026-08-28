import React, { useState, useCallback, useEffect } from "react";
import { Image } from "primereact/image";
import Cropper from "react-easy-crop";
import InputLayout from "./InputLayout";
import PrimaryButton from "../buttons/PrimaryButton";

import { Slider } from "primereact/slider";

function ImageCropperInput({
  width = 100,
  height = 100,

  label,
  name,
  value,
  data = {},
  onChange,
  errorMessage,
  extraClassName = "",
  required = false,
  col = 12,
  disabled = false,
  removeable = true,
  editable = true,
  hideLabel = false,
  helpText,
  ...props
}) {
  let _value = data?.[name] || value || null;

  const [imageSrc, setImageSrc] = useState(null);
  const [image, setImage] = useState(_value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setImage(_value);
  }, [_value]);

  const aspect = width / height;

  const readFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await readFile(file);
    setImageSrc(dataUrl);
    e.target.value = "";
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const getCroppedImg = useCallback(async () => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { x, y, width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    const base64 = canvas.toDataURL("image/jpeg");
    setImage?.(base64);
    onChange?.({ name, value: base64 });
    setImageSrc(null);
  }, [croppedAreaPixels, imageSrc, setImage]);

  const handleRemove = () => {
    setImage(null);
    onChange?.({ name, value: null });
  };

  return (
    <>
      <InputLayout
        col={col}
        label={label}
        name={name}
        required={required}
        extraClassName={extraClassName}
        data={data}
        errorMessage={errorMessage}
        hideLabel={hideLabel}
        helpText={helpText}
      >
        <div className={`custom-image-input ${disabled && "disabled"}`}>
          {image && (
            <div className="image-container">
              <Image
                src={image}
                alt="Image"
                width={"100%"}
                height="80px"
                preview
              />
              {removeable && editable && (
                <i
                  className="pi pi-times-circle delete-icon"
                  onClick={handleRemove}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          )}
          <label htmlFor={`${name}-image-input`}>
            <div className="upload-button">
              <i className="pi pi-image" />
            </div>{" "}
          </label>
        </div>
      </InputLayout>
      <input
        id={`${name}-image-input`}
        name={name}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={handleFileChange}
        {...props}
      />
      {imageSrc && (
        <div className="custom-image-cropper-containter">
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="controls">
            <Slider
              value={zoom}
              onChange={(e) => setZoom(e.value)}
              min={1}
              max={3}
              step={0.1}
              className="w-11rem md:w-20rem ml-2"
            />
            <div className="flex gap-2">
              <PrimaryButton label="Crop" onClick={getCroppedImg} />
              <PrimaryButton
                label="Cancel"
                onClick={() => setImageSrc(null)}
                severity="secondary"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default React.memo(ImageCropperInput);
