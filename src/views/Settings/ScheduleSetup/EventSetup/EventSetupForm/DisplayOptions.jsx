import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomColorPicker from "@inputs/CustomColorPicker";
import CustomInput from "@inputs/CustomInput";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomPickList from "@inputs/CustomPickList";
import CustomTextArea from "@inputs/CustomTextArea";
import formValidation, { showFormErrors } from "@formValidations";
import { durationOptions } from "@utils/dropdownConstants";
import {
  addOrUpdateEventSetup,
  getEventSetup,
} from "@store/settings/scheduleSetup/eventSetupActions";
import { getEventSetupServices } from "@store/settings/scheduleSetup/eventsSetupServiceActions";
import {
  calendarDisplayTypes,
  popupDisplayTypes,
} from "../../../../../utils/dropdownConstants";
import CalendarEventCard from "@shared/cards/CalendarEventCard";
import EventHoverPopup from "@shared/overlays/EventHoverPopup";

function DisplayOptions({ onSaveSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [eventDurations, setEventDurations] = useState([]);
  const [eventServices, setEventServices] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const levels = useSelector((state) => state.dropdown.levels);
  const [data, setData] = useState({
    calanderDisplay: [],
    popupDisplay: [],
    clubs: [],
    boxColor: "#1E88E5",
    textColor: "#FFFFFF",
    timesShown: "Quarter Hour",
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getEventSetup(id, setPageLoading, (res) => {
          setData({
            calanderDisplay: res?.calanderDisplay,
            popupDisplay: res?.popupDisplay,
            clubs: res?.clubs,
            boxColor: res?.boxColor,
            textColor: res.textColor,
            timesShown: res?.timesShown,
          });
          setEventDurations(res?.duration || []);
          setEventTitle(res?.title || "");
        })
      );
      dispatch(
        getEventSetupServices(id, undefined, (res) => {
          setEventServices(res || []);
        })
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const previewPopupRef = useRef(null);

  const previewLevel = useMemo(() => {
    const previewDuration = eventDurations?.[0];
    if (!previewDuration || !eventServices?.length) return null;
    const matched =
      eventServices.find((s) => s.duration === previewDuration) ||
      eventServices[0];
    const eventLevelId = matched?.eventLevel?._id || matched?.eventLevel;
    if (!eventLevelId) return null;
    const level = (levels || []).find((l) => l._id === eventLevelId);
    if (!level) return null;
    return { title: level.title };
  }, [eventDurations, eventServices, levels]);

  const previewDuration = eventDurations?.[0] || 60;

  const previewEvent = useMemo(
    () => ({
      eventDetails: {
        title: eventTitle || "Aga Group",
        boxColor: data?.boxColor,
        textColor: data?.textColor,
        defaultMaxAttendes: 20,
        popupDisplay: data?.popupDisplay || [],
        calanderDisplay: data?.calanderDisplay || [],
      },
      duration: previewDuration,
      levelDetails: previewLevel,
      employeeDetails: { title: "Paul Jones" },
      locationDetails: { title: "Studio A" },
      eventMembers: [{ member: { title: "John Smith" } }],
      status: "PENDING",
      startTime: "10:00",
      eventDate: new Date().toISOString(),
      enrollment: { current: 15, maximum: 20 },
    }),
    [
      data?.boxColor,
      data?.textColor,
      data?.popupDisplay,
      data?.calanderDisplay,
      eventTitle,
      previewDuration,
      previewLevel,
    ],
  );

  const handlePreviewMouseEnter = (e) => {
    const opts = previewEvent.eventDetails.popupDisplay || [];
    if (!opts.some((o) => o && o !== "NONE")) return;
    previewPopupRef.current?.show(e, e.currentTarget);
  };

  const handlePreviewMouseLeave = () => {
    previewPopupRef.current?.hide();
  };

  const handleSubmit = (e, next) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateEventSetup(id, data, setLoading, (success, formErrors) => {
          if (success) {
            if (next) {
              onSaveSuccess?.();
            } else {
              navigate(-1);
            }
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  return (
    <FormPageLayout
      onSubmit={handleSubmit}
      onSubmitNextTab={handleSubmit}
      submitLoading={loading}
      backText="Event Setup"
      pageLoading={pageLoading}
    >
      <CustomCard title="Calendar Display">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="calanderDisplay"
          showTargetControls
          options={calendarDisplayTypes}
          required
          hideLabel
        />
      </CustomCard>
      <CustomCard title="Popup Display">
        <CustomPickList
          data={data}
          onChange={handleChange}
          showTargetControls
          name="popupDisplay"
          options={popupDisplayTypes}
          required
          hideLabel
        />
      </CustomCard>
      <CustomCard title="Pending Color">
        <CustomColorPicker
          name="boxColor"
          data={data}
          onChange={handleChange}
        />
        <CustomColorPicker
          name="textColor"
          data={data}
          onChange={handleChange}
        />
        <div className="ml-auto" style={{ width: "230px" }}>
          <label className="block font-semibold mb-2 text-color-primary">
            Display Preview
          </label>
          <div
            className="border-round-lg =p-4"
            style={{ width: "230px", height: "100px" }}
          >
            <div
              style={{ height: "100%", cursor: "pointer" }}
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handlePreviewMouseLeave}
            >
              <CalendarEventCard
                event={previewEvent}
                title={previewEvent.eventDetails.title}
                timeText="10:00 - 11:00"
              />
            </div>
          </div>
        </div>
        <EventHoverPopup
          ref={previewPopupRef}
          event={previewEvent}
          options={previewEvent.eventDetails.popupDisplay}
          accentColor={data?.boxColor}
        />
      </CustomCard>

      <CustomCard title="Rebooking Time Option"></CustomCard>

      <CustomCard title="Deploy Clubs Display">
        <CustomPickList
          data={data}
          onChange={handleChange}
          name="clubs"
          optionsType="clubs"
          required
          hideLabel
        />
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(DisplayOptions);
