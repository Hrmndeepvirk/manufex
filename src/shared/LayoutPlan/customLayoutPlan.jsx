import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer } from "react-konva";
import URLImage from "./URLImage";
import { resources } from "./assets";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import CustomInput from "@inputs/CustomInput";
import PrimaryButton from "@shared/buttons/PrimaryButton";

const CustomLayoutPlan = forwardRef(function CustomLayoutPlan(
  {
    name,
    data,
    value,
    onChange,
    options = [],
    errorMessage,
    restrict = false,
    resourceBookings = [],
    members = [],
    onResourceClick,
    onResourceUnassign,
  },
  ref,
) {
  const stageRef = useRef();

  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState({
    setDirection: "COLUMN",
    noOfItems: 10,
    itemsDirection: "ROW",
  });

  const canvasWidth = 3000;
  const canvasHeight = 2000;
  const { setDirection, noOfItems, itemsDirection } = details;

  const _value = value || data?.[name];

  useEffect(() => {
    if (_value?.length) {
      if (JSON.stringify(_value) !== JSON.stringify(images)) {
        setImages(_value);
      }
    }
  }, [_value]);

  useEffect(() => {
    if (!_value?.length && options?.length) {
      generateLayout();
    }
  }, [options]);

  function generateLayout() {
    setImages([]);
    let x = 100;
    let y = 100;

    options.forEach((item) => {
      if (!resources[item.resource]) {
        console.warn(`Resource ${item.resource} not found`);
        return;
      }

      let { offsetX, offsetY, shortName, name: resName } =
        resources[item.resource];
      let _arr = [];
      let _quantity = item.quantity;

      let _y = y;
      let _x = x;

      for (let a = 1; a <= _quantity; a++) {
        _arr.push({
          name: resName,
          x: _x,
          y: _y,
          shortName: `${shortName}-${a}`,
        });

        if (itemsDirection === "ROW") {
          _x += offsetX;
        } else {
          _y += offsetY;
        }
        if (a % noOfItems === 0 && _quantity > a) {
          if (itemsDirection === "ROW") {
            _y += offsetY;
            _x = x;
          } else {
            _x += offsetX;
            _y = y;
          }
        }
      }
      setImages((prev) => [...prev, ..._arr]);
      let _remainder = _quantity % noOfItems;
      let _emptySlots = noOfItems - _remainder;

      if (setDirection === "ROW" && itemsDirection === "ROW") {
        x = _x + 30 + _emptySlots * offsetX;
      } else if (setDirection === "COLUMN" && itemsDirection === "COLUMN") {
        y = _y + 30 + _emptySlots * offsetY;
      } else if (setDirection === "ROW" && itemsDirection === "COLUMN") {
        x = _x + 30 + offsetX;
      } else if (setDirection === "COLUMN" && itemsDirection === "ROW") {
        y = _y + 30 + offsetY;
      }
    });

    setImages((prev) => {
      onChange && onChange({ name, value: prev });
      return prev;
    });
  }

  const dragBoundFunc = (pos) => {
    let margin = 20;
    let newX = pos.x;
    let newY = pos.y;

    const maxX = canvasWidth;
    const maxY = canvasHeight;

    if (newX < 0) newX = margin;
    if (newX > maxX) newX = maxX - margin;

    if (newY < 0) newY = margin;
    if (newY > maxY) newY = maxY - margin;

    return { x: newX, y: newY };
  };

  const onHide = () => setShow(false);
  const onShow = () => setShow(true);

  useImperativeHandle(ref, () => ({ openConfig: onShow }));

  const onSave = () => {
    generateLayout();
    onHide();
  };

  const handleChange = ({ name: fieldName, value: fieldValue }) => {
    setDetails((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onDragEnd = (e, i) => {
    let newX = e.target.x();
    let newY = e.target.y();

    const updated = [...images];
    updated[i]["x"] = newX;
    updated[i]["y"] = newY;
    setImages(updated);
    onChange && onChange({ name, value: updated });
  };

  const bookingMap = useMemo(() => {
    const toId = (val) => (val?._id ? String(val._id) : String(val || ""));
    const map = {};
    resourceBookings.forEach((b) => {
      const member = members.find((m) => toId(m.memberId) === toId(b.member));
      map[b.shortName] = member?.member || "";
    });
    return map;
  }, [resourceBookings, members]);

  let _images = useMemo(
    () =>
      images.map((item) => {
        const bookedBy = bookingMap[item.shortName];
        return {
          ...item,
          src: resources[item.name]?.["src"] || "",
          isBooked: !!bookedBy,
          displayName: bookedBy || item.shortName,
        };
      }),
    [images, bookingMap],
  );

  return (
    <>
      <CustomDialog visible={show} onHide={onHide} title="Select Layout">
        <div className="c-grid">
          <CustomDropdown
            col={12}
            name="setDirection"
            label="Set Direction"
            options={[
              { title: "Rows", _id: "COLUMN" },
              { title: "Columns", _id: "ROW" },
            ]}
            data={details}
            onChange={handleChange}
          />
          <CustomInput
            col={6}
            name="noOfItems"
            label="Items Per Row/Column"
            type="number"
            data={details}
            onChange={({ name: n, value: v }) =>
              handleChange({ name: n, value: Number(v) || 1 })
            }
          />
          <CustomDropdown
            col={6}
            name="itemsDirection"
            label="Items Direction"
            options={[
              { title: "Rows", _id: "ROW" },
              { title: "Columns", _id: "COLUMN" },
            ]}
            data={details}
            onChange={handleChange}
          />
          <div className="c-col-12 flex justify-content-end">
            <PrimaryButton label="Generate" onClick={onSave} />
          </div>
        </div>
      </CustomDialog>
      <div className="c-col-12">
        <div className="layout-plan">
          <div>
            <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
              <Layer>
                {_images.map((image, i) => (
                  <URLImage
                    draggable={!restrict}
                    key={i}
                    onDragEnd={(e) => onDragEnd(e, i)}
                    image={image}
                    dragBoundFunc={dragBoundFunc}
                    onClick={() => {
                      if (image.isBooked && onResourceUnassign) {
                        onResourceUnassign(image);
                      } else if (onResourceClick && !image.isBooked) {
                        onResourceClick(image);
                      }
                    }}
                    style={
                      (onResourceUnassign && image.isBooked) ||
                      (onResourceClick && !image.isBooked)
                        ? { cursor: "pointer" }
                        : undefined
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>

        {errorMessage || data?.formErrors?.[name] ? (
          <small className="p-error" id="error-element">
            {errorMessage || data?.formErrors?.[name]}
          </small>
        ) : null}
      </div>
    </>
  );
});

export default CustomLayoutPlan;
