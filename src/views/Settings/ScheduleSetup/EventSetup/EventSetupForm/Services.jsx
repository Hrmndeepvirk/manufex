import CustomCard from "@shared/cards/CustomCard";
import DetailsPageLayout from "@shared/layout/DetailsPageLayout";
import { useEffect, useMemo, useState } from "react";
import ServiceForm from "./ServiceForm";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventSetupServices } from "@store/settings/scheduleSetup/eventsSetupServiceActions";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import { useCurrencyFormatter } from "../../../../../hooks/useCurrencyFormatter";
import FormPageLayout from "@shared/layout/FormPageLayout";
import PrimaryButton from "@shared/buttons/PrimaryButton";
import {
  deleteEventSetupService,
  removeService,
} from "@store/settings/scheduleSetup/eventsSetupServiceActions";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";
import { getEventSetup } from "@store/settings/scheduleSetup/eventSetupActions";

export default function Services() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [usedLevels, setUsedLevels] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [eventData, setEventData] = useState({});
  const { formatCurrency } = useCurrencyFormatter();
  const { id } = useParams();

  const dispatch = useDispatch();

  const onFormHide = () => {
    setSelectedService(null);
    setShowForm(false);
  };

  const refresh = () => {
    dispatch(
      getEventSetupServices(id, setLoading, (res) => {
        setServicesData(res);
        setUsedLevels(res?.map((item) => item.eventLevel?._id));
      }),
    );
  };

  useEffect(() => {
    dispatch(
      getEventSetup(
        id,
        () => {},
        (res) => {
          setEventData(res);
        },
      ),
    );
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(
        getEventSetupServices(id, setLoading, (res) => {
          setServicesData(res);
          setUsedLevels(res?.map((item) => item.eventLevel?._id));
        }),
      );
    }
  }, [id, dispatch]);

  const columns = [
    {
      header: "S.No",
      body: (_, rowIndex) => rowIndex + 1,
      style: { width: "100px" },
    },
    {
      header: "Service",
      field: "title",
    },
    {
      header: "Price",
      field: "price",
      style: { width: "200px" },
      body: (rowData) => formatCurrency(rowData.price),
    },
  ];

  const onRemoveService = (service, rowId) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => {
        dispatch(
          removeService(
            service,
            { serviceId: rowId },
            () => {},
            () => {
              refresh();
            },
          ),
        );
      },
      reject: () => {},
    });
  };

  const onEditService = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const visibleServices = useMemo(() => {
    const allowed = eventData?.duration || [];
    if (!allowed.length) return servicesData || [];
    return (servicesData || []).filter((s) => allowed.includes(s.duration));
  }, [servicesData, eventData?.duration]);

  const onDeleteService = (serviceId) => {
    customConfirmDialog({
      message: "Do you want to delete this record?",
      accept: () => {
        dispatch(
          deleteEventSetupService(serviceId, () => {
            refresh();
          }),
        );
      },
      reject: () => {},
    });
  };

  return (
    <>
      <ServiceForm
        visible={showForm}
        onHide={onFormHide}
        usedLevels={usedLevels}
        servicesData={servicesData}
        selectedService={selectedService}
        refresh={refresh}
        eventData={eventData}
      />

      <FormPageLayout backText="Event Setup" hideCancel pageLoading={loading}>
        <div className="c-col-12 flex justify-content-end">
          <PrimaryButton
            label="Add Service"
            icon="pi pi-plus"
            onClick={() => {
              setShowForm(true);
            }}
          />
        </div>

        {visibleServices && visibleServices.length > 0 ? (
          visibleServices.map((service, index) => (
            <CustomCard
              actions={true}
              key={service._id}
              title={
                `Class Level: ${service.eventLevel?.title}, Duration: ${service.duration} minutes` ||
                `Service ${index + 1}`
              }
              size={12}
              onEdit={() => {
                onEditService(service);
              }}
              onDelete={() => {
                onDeleteService(service?._id);
              }}
            >
              <div className="c-col-12">
                <CustomSimpleTable
                  columns={columns}
                  data={service.services}
                  onDelete={(row) => onRemoveService(service._id, row._id)}
                />
              </div>
            </CustomCard>
          ))
        ) : (
          <div className="c-col-12 text-center">
            <DetailsPageLayout>
              <CustomCard title="No Services Added Yet" size={12}></CustomCard>
            </DetailsPageLayout>
          </div>
        )}
      </FormPageLayout>
    </>
  );
}
