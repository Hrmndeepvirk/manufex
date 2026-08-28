import CustomTabView from "@shared/tabView/CustomTabView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import General from "./General";
import Tracking from "./Tracking";
import Usage from "./Usage";
import Variation from "./variations/Variation";

import { getCatalog } from "../../../../../store/settings/inventory/catalogActions";
import { getCatalogVariations } from "../../../../../store/settings/inventory/catalogVariationActions";
import { spaceToDash } from "@utils/common";

export default function CatalogForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState(null);
  const [variations, setVariations] = useState([]);

  const [enabledUpto, setEnabledUpto] = useState(0);

  const goToTab = (title, index) => {
    setEnabledUpto((prev) => Math.max(prev, index));
    setSearchParams({ tab: spaceToDash(title) }, { replace: true });
  };

  useEffect(() => {
    if (id) setEnabledUpto(10);
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(
        getCatalog(id, setLoading, (res) => {
          setCatalog(res);
        }),
      );
      fetchVariations();
    }
  }, [id]);

  const fetchVariations = () => {
    dispatch(
      getCatalogVariations(id, setLoading, (res) => {
        setVariations(res);
      }),
    );
  };

  const tabs = [
    {
      title: "General",
      content: (
        <General
          editItem={catalog}
          pageLoading={loading}
          onSaveSuccess={(newCatalog) => {
            setCatalog(newCatalog);

            if (!id && newCatalog?._id) {
              navigate(
                `/settings/inventory-setup/catalog-item/${newCatalog._id}?tab=tracking`,
                { replace: true },
              );
            }
            goToTab("tracking", 1);
          }}
        />
      ),
    },
    {
      title: "Tracking",
      content: (
        <Tracking
          editItem={catalog}
          pageLoading={loading}
          onSaveSuccess={(updatedCatalog) => {
            setCatalog(updatedCatalog);
            goToTab("usage", 2);
          }}
        />
      ),
    },
    {
      title: "Usage",
      content: (
        <Usage
          editItem={catalog}
          setCatalog={setCatalog}
          onSaveSuccess={(updatedCatalog) => {
            setCatalog(updatedCatalog);
            goToTab("variation", 3);
          }}
        />
      ),
    },
    {
      title: "Variation",
      content: (
        <Variation
          editItem={catalog}
          variations={variations}
          getVariations={fetchVariations}
        />
      ),
    },
  ];

  const disabledTabIndices = !id
    ? tabs.map((_, i) => i).filter((i) => i > enabledUpto)
    : [];

  return (
    <CustomTabView
      tabs={tabs}
      noPadding
      disabledTabIndices={disabledTabIndices}
    />
  );
}
