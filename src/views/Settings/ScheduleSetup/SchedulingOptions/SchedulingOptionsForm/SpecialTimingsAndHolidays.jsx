import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomDialog from "@shared/overlays/CustomDialog";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomDropdown from "@shared/inputs/CustomDropdown";
import { showFormErrors } from "@formValidations";
import CustomForm from "@inputs/CustomForm";
import {
  addOrUpdateSpecialTimingsAndHolidays,
  getSpecialTimingsAndHolidays,
} from "@store/settings/scheduleSetup/specialTimingAndHolidaysActions";

function SpecialTimingsAndHolidaysForm({
  visible,
  onHide,
  refresh,
  selectedRow,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (selectedRow) {
      setData((prev) => ({
        ...prev,
        timingAndHoliday: [
          {
            date: selectedRow.date,
            open: selectedRow.open,
            startTime: selectedRow.startTime,
            endTime: selectedRow.endTime,
          },
        ],
      }));
    } else {
      // reset if adding new
      setData({
        timingAndHoliday: [
          {
            date: null,
            open: false,
            startTime: null,
            endTime: null,
          },
        ],
      });
    }
  }, [selectedRow]);

  const specialTimingsAndHolidays = useSelector(
    (state) => state.settings.scheduleSetup.specialTimingsAndHolidays
  );

  const handleHide = () => {
    onHide();
    setData({
      timingAndHoliday: [
        {
          date: null,
          open: false,
          startTime: null,
          endTime: null,
        },
      ],
    });
  };

  useEffect(() => {}, []);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    hoursOperation: [
      {
        days: [],
        startTime: null,
        endTime: null,
      },
    ],

    timingAndHoliday: [
      {
        date: null,
        open: false,
        startTime: null,
        endTime: null,
      },
    ],
  });

  useEffect(() => {
    dispatch(getSpecialTimingsAndHolidays(() => {}));
  }, []);

  const handleSpecialScheduleChange = ({ name, value }, index) => {
    setData((prev) => {
      const updated = [...prev.timingAndHoliday];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, timingAndHoliday: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const current = data.timingAndHoliday[0];

    const newRecord = {
      date: current.date,
      open: current.open,
      startTime: current.open ? current.startTime : null,
      endTime: current.open ? current.endTime : null,
    };

    let updatedList;

    if (selectedRow) {
      // Editing existing record
      updatedList = (specialTimingsAndHolidays?.timingAndHoliday || []).map(
        (item) =>
          item._id === selectedRow._id ? { ...item, ...newRecord } : item
      );
    } else {
      // Adding new record
      updatedList = [
        ...(specialTimingsAndHolidays?.timingAndHoliday || []),
        newRecord,
      ];
    }

    dispatch(
      addOrUpdateSpecialTimingsAndHolidays(
        id,
        { timingAndHoliday: updatedList },
        setLoading,
        (success, formErrors) => {
          if (success) {
            refresh();
            onHide();
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }
      )
    );
  };

  return (
    <CustomDialog
      title={"Add Special Timing or Holiday"}
      visible={visible}
      onHide={handleHide}
      size="medium"
    >
      <CustomForm
        onSubmit={handleSubmit}
        onCancel={() => {
          handleHide();
        }}
      >
        {data?.timingAndHoliday?.map((item, index) => (
          <React.Fragment key={index}>
            <CustomCalendarInput
              data={item}
              onChange={(e) => handleSpecialScheduleChange(e, index)}
              name="date"
              dateString
              col={12}
            />

            <CustomDropdown
              data={item}
              onChange={(e) => handleSpecialScheduleChange(e, index)}
              name="open"
              col={12}
              booleanOptions
            />

            {item?.open === true && (
              <>
                <CustomCalendarInput
                  data={item}
                  onChange={(e) => handleSpecialScheduleChange(e, index)}
                  name="startTime"
                  timeOnly
                  col={12}
                />

                <CustomCalendarInput
                  data={item}
                  onChange={(e) => handleSpecialScheduleChange(e, index)}
                  name="endTime"
                  timeOnly
                  col={12}
                />
              </>
            )}
          </React.Fragment>
        ))}
      </CustomForm>
    </CustomDialog>
  );
}
export default React.memo(SpecialTimingsAndHolidaysForm);
