import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useServerTime } from "../../../hooks/useServerTime";

import CustomDialog from "@shared/overlays/CustomDialog";
import CustomForm from "@inputs/CustomForm";
import CustomDropdown from "../../../shared/inputs/CustomDropdown";
import CustomSimpleTable from "../../../shared/table/CustomSimpleTable";
import CustomCalendarInput from "@shared/inputs/CustomCalendarInput";
import {
  getResorces,
  postReserve,
  postReturn,
} from "../../../store/checkin/reserveActions";
import { Button } from "primereact/button";
import { formatEnum } from "@utils/common";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";

export default function ReserveDialog({ visible, onHide, member, onReserveUpdate, refreshKey }) {
  const { getServerDate } = useServerTime();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [resources, setResources] = useState([]);

  const [data, setData] = useState({
    member: null,
    resourceType: null,
    locationType: null,
    date: getServerDate(),
  });

  useEffect(() => {
    if (member) {
      setData((prev) => ({
        ...prev,
        member: member,
      }));
    }
  }, [member]);

  useEffect(() => {
    if (visible) {
      setData({
        member: member,
        resourceType: null,
        locationType: null,
        date: getServerDate(),
      });
      setFilters({
        resourceType: null,
        locationType: null,
      });
    }
  }, [visible, member]);

  const selectedDate = useMemo(() => {
    return data.date ? data.date.toISOString().split("T")[0] : null;
  }, [data.date]);

  useEffect(() => {
    getResourceFun();
  }, [selectedDate, data.member, refreshKey]);

  function getResourceFun() {
    if (data && data.member) {
      dispatch(
        getResorces(data, setLoading, (e) => {
          setResources(e);
        }),
      );
    }
  }

  const doReserve = (resource, payload) => {
    dispatch(
      postReserve(payload, resource._id, setLoading, (responseData) => {
        if (responseData) {
          setResources((prev) =>
            prev.map((r) => {
              if (
                r._id?.toString() === resource._id?.toString() &&
                r.locations?._id?.toString() === resource.locations?._id?.toString()
              ) {
                return {
                  ...r,
                  locations: {
                    ...r.locations,
                    isReserved: true,
                    reserveId: responseData._id,
                    available: Math.max(0, (r.locations.available || 0) - 1),
                    reservedCount: (r.locations.reservedCount || 0) + 1,
                  },
                };
              }
              return r;
            })
          );
          getResourceFun();
          onReserveUpdate && onReserveUpdate("reserve", resource, responseData, data.date);
        }
      }),
    );
  };

  const onReserve = (resource) => {
    const timeString = data.date
      ? `${String(data.date.getHours()).padStart(2, "0")}:${String(data.date.getMinutes()).padStart(2, "0")}`
      : "00:00";
    const payload = {
      member: data.member,
      location: resource?.locations?._id,
      date: selectedDate,
      time: timeString,
    };

    if (!resource.locations?.isReserved) {
      if (!resource.isFree && !resource.memberHasService) {
        customConfirmDialog({
          message:
            "This resource requires a service to book. You don't currently have an eligible service — reserving it will be added to your past due balance. Continue?",
          accept: () => doReserve(resource, payload),
          reject: () => {},
        });
      } else {
        doReserve(resource, payload);
      }
    } else {
      dispatch(
        postReturn(
          payload,
          resource?.locations?.reserveId,
          setLoading,
          (responseData) => {
            if (responseData) {
              setResources((prev) =>
                prev.map((r) => {
                  if (
                    r._id?.toString() === resource._id?.toString() &&
                    r.locations?._id?.toString() === resource.locations?._id?.toString()
                  ) {
                    return {
                      ...r,
                      locations: {
                        ...r.locations,
                        isReserved: false,
                        reserveId: null,
                        available: (r.locations.available || 0) + 1,
                        reservedCount: Math.max(0, (r.locations.reservedCount || 0) - 1),
                      },
                    };
                  }
                  return r;
                })
              );
              getResourceFun();
              onReserveUpdate && onReserveUpdate("return", resource, responseData);
            }
          },
        ),
      );
    }
  };

  const [filters, setFilters] = useState({
    resourceType: null,
    locationType: null,
  });

  const handleChange = ({ name, value }) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = ({ name, value }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatLocations = (locations) => {
    if (!locations || locations.length === 0) return "N/A";

    return (
      locations
        .filter((loc) => loc._id)
        .map((loc) => {
          if (loc.title) {
            return `  ${loc.title}`;
          }
          return "";
        })
        .join(", ") || "N/A"
    );
  };

  const formatPastDue = (pastDue) => {
    if (!pastDue) return "N/A";

    if (typeof pastDue === "object" && pastDue.value !== undefined) {
      return `${pastDue.value} ${formatEnum(pastDue.type)} `;
    }

    return pastDue.toString();
  };

  const getServicesAvailable = (rowData) => {
    if (rowData.isFree) return "-";
    if (rowData.hasUnlimitedService) return "ULT";
    return rowData.totalAvailableSessions ?? 0;
  };

  const posColumns = [
    { field: "title", header: "Resource" },
    {
      field: "resourceType",
      header: "Resource Type",
      optionsKey: "resourceTypes",
    },
    {
      field: "locations",
      header: "Location",
      body: (rowData) => rowData.locations.title,
    },
    {
      field: "pastDue",
      header: "Past Due",
      body: (rowData) => formatPastDue(rowData?.pastDue),
    },
    {
      field: "resourceAvailable",
      header: "Resource Available",
      body: (rowData) =>
        `${rowData?.locations?.available}/${rowData?.locations?.quantity}`,
    },
    {
      field: "servicesAvailable",
      header: "Services Available",
      body: (rowData) => getServicesAvailable(rowData),
    },
    {
      field: "reservereturn",
      header: "Reserve / Return",
      body: (rowData) => (
        <Button
          label={rowData?.locations?.isReserved ? "Return" : "Reserve"}
          size="small"
          type="button"
          disabled={!rowData?.locations?.isReserved && rowData?.locations?.available === 0}
          onClick={() => onReserve(rowData)}
        />
      ),
    },
  ];

  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    if (filters.resourceType) {
      filtered = filtered.filter(
        (item) => item.resourceType === filters.resourceType,
      );
    }
    if (filters.locationType) {
      filtered = filtered.filter(
        (item) => item?.locations?.locationType === filters?.locationType,
      );
    }
    return filtered;
  }, [resources, filters]);

  return (
    <CustomDialog
      title="Create Reserve"
      visible={visible}
      size="large"
      onHide={onHide}
    >
      <CustomForm>
        <CustomDropdown
          name="member"
          data={data}
          onChange={handleChange}
          optionsType={"members"}
          col={6}
        />
        <CustomCalendarInput
          name="date"
          data={data}
          onChange={handleChange}
          dateString
          showTime
          minDate={getServerDate()}
          required
          col={6}
        />
        <CustomDropdown
          data={filters}
          onChange={handleFilterChange}
          name="resourceType"
          optionsType="resourceTypes"
          clearable
          col={6}
        />
        <CustomDropdown
          data={filters}
          onChange={handleFilterChange}
          name="locationType"
          optionsType="locationTypes"
          clearable
          col={6}
        />

        <div className="c-col-12">
          <CustomSimpleTable
            columns={posColumns}
            data={filteredResources}
            loading={loading}
          />
        </div>
      </CustomForm>
    </CustomDialog>
  );
}
