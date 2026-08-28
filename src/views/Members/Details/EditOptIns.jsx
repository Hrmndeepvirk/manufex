import React, { useState, useEffect } from "react";
import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomCheckbox from "@inputs/CustomCheckbox";
import { useDispatch } from "react-redux";
import { updateMember } from "@store/member/memberActions";

export default function EditOptIns({ visible, onHide, data, setData }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    text: { membership: false, services: false, booking: false },
    promotional: { membership: false, services: false, booking: false },
  });

  useEffect(() => {
    if (data) {
      setForm({
        text: {
          membership: data?.text?.membership || false,
          services: data?.text?.services || false,
          booking: data?.text?.booking || false,
        },
        promotional: {
          membership: data?.promotional?.membership || false,
          services: data?.promotional?.services || false,
          booking: data?.promotional?.booking || false,
        },
      });
    }
  }, [data]);

  const handleChange = (category, field, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateMember(data._id, form, (success, formErrors) => {
        if (success) {
          onHide();
          setData((prev) => ({ ...prev, ...form }));
        } else {
          setForm((prev) => ({ ...prev, formErrors }));
        }
      }),
    );
  };

  const rows = ["membership", "services", "booking"];

  return (
    <CustomDialog title="Edit Opt.Ins" visible={visible} onHide={onHide} size="medium">
      <CustomForm onSubmit={handleSubmit} onCancel={onHide}>
        <div className="c-col-12">
          <div className="flex mb-3">
            <div style={{ width: "40%" }} />
            <div style={{ width: "30%" }} className="font-semibold">Texts</div>
            <div style={{ width: "30%" }} className="font-semibold">Promotional</div>
          </div>
          {rows.map((field) => (
            <div key={field} className="flex align-items-center mb-3">
              <div style={{ width: "40%" }} className="capitalize">{field}</div>
              <div style={{ width: "30%" }}>
                <CustomCheckbox
                  name={`text_${field}`}
                  value={form.text[field]}
                  onChange={(e) => handleChange("text", field, e.value)}
                  col={12}
                />
              </div>
              <div style={{ width: "30%" }}>
                <CustomCheckbox
                  name={`promotional_${field}`}
                  value={form.promotional[field]}
                  onChange={(e) => handleChange("promotional", field, e.value)}
                  col={12}
                />
              </div>
            </div>
          ))}
        </div>
      </CustomForm>
    </CustomDialog>
  );
}
