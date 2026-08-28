import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useServerTime } from "../../../../hooks/useServerTime";
import { useNavigate, useParams } from "react-router-dom";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateAvailability,
  getAvailability,
  getEmployeeClubs,
} from "@store/settings/employeeSetup/availabilityActions";
import { Button } from "primereact/button";
import { availabilityDurationsOptions } from "@utils/dropdownConstants";

function AvailabilityForm() {
  const { getServerDate } = useServerTime();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [clubFetchLoading, setClubFetchLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [employeeClubs, setEmployeeClubs] = useState([]);
  const [data, setData] = useState({
    employee: null,
    club: null,
    duration: 0,
    trackAvailability: true,
  });

  console.log({ data });
  useEffect(() => {
    if (id) {
      dispatch(
        getAvailability(id, setPageLoading, (res) => {
          setData({
            employee: res.employee,
            club: res.club,
            duration: res.duration,
            trackAvailability: res.trackAvailability,
          });
        })
      );
    }
  }, [id]);

  const employees = useSelector((state) => state.dropdown.employees);

  const employeeOptions = useMemo(
    () =>
      employees.map((item) => ({
        title: `${item.firstName} ${item?.lastName}`,
        _id: item?._id,
      })),
    [employees]
  );

  useEffect(() => {
    if (data.employee) {
      dispatch(
        getEmployeeClubs(data.employee, setClubFetchLoading, (res) => {
          setEmployeeClubs(res?.clubs);
        })
      );
    }
  }, [data.employee]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(
        addOrUpdateAvailability(id, data, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        })
      );
    }
  };

  return (
    
    <FormPageLayout
      backText="Availability"
      onSubmit={handleSubmit}
      submitLoading={loading}
      pageLoading={pageLoading}
    >
      <CustomCard title="Availability">
        <CustomDropdown
          name="employee"
          showClear
          options={employeeOptions}
          data={data}
          required
          loading={clubFetchLoading}
          onChange={handleChange}
        />
        <CustomDropdown
          name="club"
          options={employeeClubs}
          data={data}
          onChange={handleChange}
        />
        <CustomDropdown

          name="trackAvailability"
          booleanOptions
          data={data}
          onChange={handleChange}
        />

        <CustomDropdown
          name="duration"
          options={availabilityDurationsOptions}
          data={data}
          required
          onChange={handleChange}
        />

        {data?.club && data?.trackAvailability && (
          <>
            <span className="p-buttonset my-2 c-col-12 flex gap-4">
              <Button
                icon="pi pi-angle-left"
                size="small"
                // onClick={() => calendarRef.current.getApi().prev()}
              />
              <Button
                icon="pi pi-angle-right"
                size="small"
                // onClick={() => calendarRef.current.getApi().next()}
              />
            </span>

            {/* need to add a calendar here */}
            {/* <CustomCalendar /> */}
            {/* <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              dayHeaderFormat={{ month: "short", day: "numeric" }}
              selectOverlap={false}
              views={{
                timeGridWeek: {
                  type: "timeGrid",
                  duration: { weeks: 1 },
                  // dayHeaderFormat: { weekday: 'long' },
                },
              }}
              validRange={validRange}
              datesSet={handleDatesSet}
              eventOverlap={false}
              initialDate={
                data?.fromDate ? new Date(data?.fromDate) : getServerDate()
              }
              slotDuration={`00:${data?.duration}:00`}
              headerToolbar=""
              selectable={true}
              expandRows={true}
              editable={true}
              eventStartEditable={false}
              droppable={false}
              eventResize={handleEventResize}
              select={handleDateSelect}
              eventClick={deleteConfirm}
              events={[
                ...(data?.events ?? []).map((item) => ({
                  start: item.start,
                  end: item.end,
                  club: data?.club,
                  editable: true,
                  color: item.isAvailable ? "#8fdf82" : "#ff9f89",
                  title: clubName?.name,
                })),

                ...disableEvents?.map((item) => ({
                  start: item.start,
                  end: item.end,
                  club: item.club,
                  editable: false,
                  color: "#d3d3d3",
                  textColor: "#888888",
                  title: item?.club?.name,
                })),
              ]}
              slotEventOverlap={false}
            /> */}
          </>
        )}
      </CustomCard>
    </FormPageLayout>
  );
}
export default React.memo(AvailabilityForm);
