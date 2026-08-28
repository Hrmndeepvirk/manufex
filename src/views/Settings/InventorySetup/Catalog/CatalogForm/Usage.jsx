import React, { useEffect, useState } from "react";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomSimpleTable from "@shared/table/CustomSimpleTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCatalogs } from "../../../../../store/settings/inventory/catalogActions";
import PaysForDialog from "./usageDialogs/PaysForDialog";
import PaysToDialog from "./usageDialogs/PaysToDialog";

function Usage({ editItem, setCatalog }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [paysForServices, setPaysForServices] = useState([]);
  const [paysToServices, setPaysToServices] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showAddPaysForDialog, setShowAddPaysForDialog] = useState(false);
  const [showAddPaysToDialog, setShowAddPaysToDialog] = useState(false);

  const data = useSelector((state) => state.settings.inventory.catalogItems);

  // All base catalog items (no variations) except the current one — used in both dialogs
  const _availablePayOptions = data?.filter(
    (item) => !item?.variation && item?._id !== id,
  );

  const _availablePaysForServicesOptions = _availablePayOptions;
  const _availablePaysToServicesOptions = _availablePayOptions;

  const _paysForServices = _availablePayOptions?.filter((item) =>
    editItem?.paysFor?.includes(item?._id),
  );

  const _paysToServices = _availablePayOptions?.filter((item) =>
    editItem?.paysTo?.includes(item?._id),
  );

  useEffect(() => {
    dispatch(getCatalogs(setLoading));
  }, [dispatch]);

  let columns = [
    { field: "title", header: "Service" },
    { field: "itemCaption", header: "Item Caption" },
    { field: "description", header: "Description" },
  ];

  return (
    <>
      <PaysForDialog
        visible={showAddPaysForDialog}
        onHide={() => setShowAddPaysForDialog(false)}
        services={_availablePaysForServicesOptions}
        paysForServices={paysForServices}
        setPaysForServices={setPaysForServices}
        preSelectedRows={editItem?.paysFor}
      />

      <PaysToDialog
        visible={showAddPaysToDialog}
        onHide={() => setShowAddPaysToDialog(false)}
        services={_availablePaysToServicesOptions}
        preSelectedRows={editItem?.paysTo}
        paysToServices={paysToServices}
        setPaysToServices={setPaysToServices}
      />

      <FormPageLayout backText="Catalogs" pageLoading={pageLoading} hideCancel>
        <CustomCard
          title="Pays To"
          onAdd={() => setShowAddPaysToDialog(true)}
          actions
        >
          <div className="c-col-12">
            <CustomSimpleTable columns={columns} data={_paysToServices} />
          </div>
        </CustomCard>
        <CustomCard
          title="Pays For"
          onAdd={() => setShowAddPaysForDialog(true)}
          actions
        >
          <div className="c-col-12">
            <CustomSimpleTable columns={columns} data={_paysForServices} />
          </div>
        </CustomCard>
        {/* <CustomCard title="Bundles/Recipes">
          <div className="c-col-12">
            <CustomSimpleTable columns={[]} />
          </div>
        </CustomCard> */}
      </FormPageLayout>
    </>
  );
}
export default React.memo(Usage);
