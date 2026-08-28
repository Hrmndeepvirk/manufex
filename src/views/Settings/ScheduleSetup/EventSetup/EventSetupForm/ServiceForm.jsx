import CustomDialog from "@shared/overlays/CustomDialog";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import CustomForm from "@inputs/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventSetup } from "@store/settings/scheduleSetup/eventSetupActions";
import CustomMultiSelect from "@shared/inputs/CustomMultiSelect";
import formValidation, { showFormErrors } from "@formValidations";
import { addOrUpdateEventSetupService } from "@store/settings/scheduleSetup/eventsSetupServiceActions";

export default function ServiceForm({
  visible,
  onHide,
  servicesData,
  refresh,
  selectedService,
  eventData,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const levels = useSelector((state) => state.dropdown.levels);

  const _levels = levels?.filter((l) => l.type === eventData?.eventType);
  const catalogItems = useSelector((state) => state.dropdown.catalogItems);

  useEffect(() => {
    if (selectedService) {
      setData({
        eventLevel: selectedService.eventLevel?._id,
        eventSetup: selectedService.eventSetup,
        duration: selectedService.duration,
        services: selectedService.services?.map((service) => service._id) || [],
      });
    }
  }, [selectedService]);

  const [data, setData] = useState({
    eventLevel: null,
    eventSetup: id,
    duration: 0,
    services: [],
  });

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const [loading, setLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    eventType: "",
    duration: [],
  });

  const catalogItemsOptions = catalogItems.filter(
    (item) => item.type === "SERVICE",
  );

  const availableDurations = eventInfo?.duration.filter((dur) => {
    if (selectedService && dur === selectedService.duration) return true;
    // Check if any other service with the same eventLevel uses this duration
    const usedByOther = servicesData?.some(
      (service) =>
        service.eventLevel._id === data.eventLevel &&
        service.duration === dur &&
        (!selectedService || service._id !== selectedService._id),
    );
    return !usedByOther;
  });

  const durationOptions = availableDurations.map((dur) => ({
    title: `${dur} minutes`,
    _id: dur,
  }));

  useEffect(() => {
    if (id) {
      dispatch(
        getEventSetup(
          id,
          () => {},
          (res) => {
            setEventInfo({
              eventType: res.eventType,
              duration: res.duration,
            });
          },
        ),
      );
    }
  }, [id]);

  const handleHide = () => {
    onHide();
    setData({
      eventLevel: null,
      eventSetup: id,
      duration: 0,
      services: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateEventSetupService(
          selectedService?._id,
          data,
          setLoading,
          (success, formErrors) => {
            if (success) {
              refresh();
              handleHide();
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };

  return (
    <>
      <CustomDialog
        title={selectedService ? "Edit Service" : "Add Service"}
        size="medium"
        visible={visible}
        onHide={handleHide}
      >
        <CustomForm
          onSubmit={handleSubmit}
          onCancel={handleHide}
          submitLoading={loading}
        >
          {!selectedService && (
            <CustomDropdown
              name="eventLevel"
              col={12}
              options={_levels}
              data={data}
              onChange={handleChange}
              required
            />
          )}

          <CustomDropdown
            name="duration"
            col={12}
            data={data}
            options={durationOptions}
            onChange={handleChange}
            required
          />
          <CustomMultiSelect
            name="services"
            col={12}
            filter
            data={data}
            options={catalogItemsOptions}
            onChange={handleChange}
            required
          />
        </CustomForm>
      </CustomDialog>
    </>
  );
}
