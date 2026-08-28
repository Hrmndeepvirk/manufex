import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";

import FormPageLayout from "@shared/layout/FormPageLayout";
import { showFormErrors } from "@formValidations";
import {
  addOrUpdateDefaultSettings,
  getDefaultSetting,
} from "@store/settings/business/defaultActions";
import { getCompany } from "@store/settings/business/companyActions";

import FastAddMember, { checkboxFields } from "./FastAddMember";
import AgreementPlans, { agreementCheckboxFields } from "./AgreementPlans";

export default function Default() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    agreementPlan: null,
    fastAddRequiredFields: [],
    agreementPlanRequiredFields: [],
  });

  const company = useSelector((state) => state.settings.business.company);

  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  const handleFastAddChange = ({ name, value }) => {
    setData((prev) => {
      if (checkboxFields.some((field) => field.name === name)) {
        const updatedFields = value
          ? [...new Set([...prev.fastAddRequiredFields, name])]
          : prev.fastAddRequiredFields.filter((field) => field !== name);

        return {
          ...prev,
          fastAddRequiredFields: updatedFields,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleAgreementChange = ({ name, value }) => {
    setData((prev) => {
      if (agreementCheckboxFields.some((field) => field.name === name)) {
        const updatedFields = value
          ? [...new Set([...prev.agreementPlanRequiredFields, name])]
          : prev.agreementPlanRequiredFields.filter((field) => field !== name);

        return {
          ...prev,
          agreementPlanRequiredFields: updatedFields,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (company) {
      dispatch(
        getDefaultSetting(company?._id, setLoading, (res) => {
          setData({
            agreementPlan: res.agreementPlan || null,
            fastAddRequiredFields: res.fastAddRequiredFields || [],
            agreementPlanRequiredFields: res.agreementPlanRequiredFields || [],
          });
        })
      );
    }
  }, [company]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company) {
      if (showFormErrors(data, setData)) {
        dispatch(
          addOrUpdateDefaultSettings(
            company?._id,
            data,
            setLoading,
            (success, formErrors) => {
              if (success) {
                setLoading(false);
                navigate(-1);
              } else {
                setData((prev) => ({ ...prev, formErrors }));
              }
            }
          )
        );
      }
    }
  };

  return (
    <>
      <FormPageLayout onSubmit={handleSubmit} submitLoading={loading} noPadding>
        <div className="c-col-12" style={{ paddingLeft: 0 }}>

          <TabView
            className="iz-flush-tabs"
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
          >
            <TabPanel header="Fast Add Member" >
              <FastAddMember data={data} onChange={handleFastAddChange} />
            </TabPanel>
            <TabPanel header="Agreement Plans" >
              <AgreementPlans data={data} onChange={handleAgreementChange} />
            </TabPanel>
          </TabView>
        </div>
      </FormPageLayout>
    </>
  );
}
