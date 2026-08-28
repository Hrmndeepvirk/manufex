import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomNumberInput from "@inputs/CustomNumberInput";
import CustomCalendarInput from "@inputs/CustomCalendarInput";
import CustomOptionSelect from "@inputs/CustomOptionSelect";
import formValidation, { showFormErrors } from "@formValidations";
import { getReport } from "@store/reports/reportsActions";
import { runReport } from "@store/reports/queuedReportsActions";
import { showToastAction } from "@store/common/commonActions";
import { getDataPoints } from "@utils/reportDataPoints";
import { capitalizeSnakeCase } from "@utils/common";
import {
  TIME_PERIOD_TYPE_OPTIONS,
  getRuleConfig,
} from "../ManageReports/ruleConfig";
import FilterField from "../ManageReports/FilterField";
import RuleModal from "../ManageReports/RuleModal";
import AdditionalRulesContainer from "../ManageReports/AdditionalRulesContainer";
import ReportColumns from "../ManageReports/ReportColumns";

const FORMAT_TYPE_OPTIONS = [
  { title: "PDF", _id: "PDF" },
  { title: "CSV", _id: "CSV" },
];

const PAGE_ORIENTATION_OPTIONS = [
  { title: "Portrait", _id: "PORTRAIT" },
  { title: "Landscape", _id: "LANDSCAPE" },
];

const EMPTY_METRIC = {
  field: "",
  operator: "",
  value: null,
  secondValue: null,
};

const EMPTY_TIME_PERIOD = {
  type: "ALL_TIME",
  startDate: "",
  endDate: "",
  relativeDays: null,
};

function RunReport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    masterRule: null,
    additionalRules: [],
    reportColumns: [],
    formatType: "PDF",
    showPageHeader: true,
    showPageFooter: true,
    pageOrientation: "PORTRAIT",
    formErrors: {},
  });

  // Inline master rule editable state (filters, metric, timePeriod only)
  const [masterRuleData, setMasterRuleData] = useState({
    userType: "",
    type: "",
    filters: {},
    metric: { ...EMPTY_METRIC },
    timePeriod: { ...EMPTY_TIME_PERIOD },
    dataPoints: [],
  });

  const [ruleModal, setRuleModal] = useState({
    visible: false,
    rule: null,
    editIndex: null,
  });

  const masterConfig = useMemo(
    () => getRuleConfig(masterRuleData.userType, masterRuleData.type),
    [masterRuleData.userType, masterRuleData.type],
  );

  useEffect(() => {
    if (id) {
      dispatch(
        getReport(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            masterRule: res.masterRule || null,
            additionalRules: res.additionalRules || [],
            reportColumns: res.reportColumns || [],
            formatType: res.formatType || "PDF",
            showPageHeader: res.showPageHeader ?? true,
            showPageFooter: res.showPageFooter ?? true,
            pageOrientation: res.pageOrientation || "PORTRAIT",
            formErrors: {},
          });

          const mr = res.masterRule;
          if (mr) {
            setMasterRuleData({
              userType: mr.userType || "",
              type: mr.type || "",
              filters: { ...(mr.filters || {}) },
              metric: { ...EMPTY_METRIC, ...(mr.metric || {}) },
              timePeriod: { ...EMPTY_TIME_PERIOD, ...(mr.timePeriod || {}) },
              dataPoints: mr.dataPoints || [],
            });
          }
        }),
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  // ── Master Rule inline handlers ──

  const handleMasterFilterChange = ({ name, value }) => {
    setMasterRuleData((prev) => ({
      ...prev,
      filters: { ...prev.filters, [name]: value },
    }));
  };

  const handleMasterMetricChange = ({ name, value }) => {
    setMasterRuleData((prev) => ({
      ...prev,
      metric: { ...prev.metric, [name]: value },
    }));
  };

  const handleMasterTimePeriodChange = ({ name, value }) => {
    setMasterRuleData((prev) => ({
      ...prev,
      timePeriod: { ...prev.timePeriod, [name]: value },
    }));
  };

  const isMasterFilterVisible = (filterDef) => {
    if (!filterDef.showWhen) return true;
    return Object.entries(filterDef.showWhen).every(
      ([key, val]) => masterRuleData.filters[key] === val,
    );
  };

  const buildMasterRuleFromState = () => {
    const d = masterRuleData;
    if (!d.userType || !d.type) return null;

    const ruleData = {
      userType: d.userType,
      type: d.type,
      sortOrder: 1,
    };

    const cleanedFilters = {};
    Object.entries(d.filters).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) {
        cleanedFilters[key] = val;
      } else if (
        val !== "" &&
        val !== null &&
        val !== undefined &&
        !Array.isArray(val)
      ) {
        cleanedFilters[key] = val;
      }
    });
    if (Object.keys(cleanedFilters).length > 0) {
      ruleData.filters = cleanedFilters;
    }

    if (masterConfig?.metric) {
      if (masterConfig.metric.fields && d.metric.field && d.metric.operator) {
        ruleData.metric = {
          field: d.metric.field,
          operator: d.metric.operator,
          value: d.metric.value,
        };
        if (d.metric.operator === "BETWEEN") {
          ruleData.metric.secondValue = d.metric.secondValue;
        }
      } else if (!masterConfig.metric.fields && d.metric.operator) {
        const derivedField =
          d.filters.earningQtyType || d.filters.redeemQtyType;
        if (derivedField) {
          ruleData.metric = {
            field: derivedField,
            operator: d.metric.operator,
            value: d.metric.value,
          };
          if (d.metric.operator === "BETWEEN") {
            ruleData.metric.secondValue = d.metric.secondValue;
          }
        }
      }
    }

    if (masterConfig?.timePeriod && d.timePeriod.type !== "ALL_TIME") {
      ruleData.timePeriod = { type: d.timePeriod.type };
      if (d.timePeriod.type === "DATE_RANGE") {
        ruleData.timePeriod.startDate = d.timePeriod.startDate;
        ruleData.timePeriod.endDate = d.timePeriod.endDate;
      } else if (d.timePeriod.type === "RELATIVE") {
        ruleData.timePeriod.relativeDays = d.timePeriod.relativeDays;
      }
    }

    if (d.dataPoints?.length > 0) {
      ruleData.dataPoints = d.dataPoints;
    }

    return ruleData;
  };

  // ── Additional Rules (modal-based) ──

  const openAddRuleModal = () => {
    setRuleModal({ visible: true, rule: null, editIndex: null });
  };

  const openEditRuleModal = (index) => {
    setRuleModal({
      visible: true,
      rule: data.additionalRules[index],
      editIndex: index,
    });
  };

  const syncReportColumns = (masterRule, additionalRules, existingColumns) => {
    const validKeys = new Set();
    const newEntries = [];

    const processRule = (rule, ruleNumber) => {
      if (!rule?.dataPoints?.length) return;
      const defs = getDataPoints(rule.userType, rule.type);
      for (const dpId of rule.dataPoints) {
        const key = `${ruleNumber}_${dpId}`;
        validKeys.add(key);
        const def = defs.find((d) => d._id === dpId);
        if (!def) continue;
        const exists = existingColumns.some(
          (c) => c.ruleNumber === ruleNumber && c.dataPointId === dpId,
        );
        if (!exists) {
          newEntries.push({
            ruleNumber,
            userType: rule.userType,
            ruleType: rule.type,
            dataPointId: dpId,
            title: def.title,
            isNumber: def.isNumber,
            sort: "",
            breakType: "",
            numericOperation: "",
          });
        }
      }
    };

    if (masterRule) processRule(masterRule, 1);
    additionalRules.forEach((r, i) => processRule(r, i + 2));

    const kept = existingColumns.filter((c) =>
      validKeys.has(`${c.ruleNumber}_${c.dataPointId}`),
    );
    return [...kept, ...newEntries];
  };

  const handleRuleSave = (ruleData) => {
    if (ruleModal.editIndex !== null) {
      setData((prev) => {
        const updated = [...prev.additionalRules];
        updated[ruleModal.editIndex] = {
          ...ruleData,
          sortOrder: ruleModal.editIndex + 2,
        };
        return {
          ...prev,
          additionalRules: updated,
          reportColumns: syncReportColumns(
            prev.masterRule,
            updated,
            prev.reportColumns,
          ),
        };
      });
    } else {
      setData((prev) => {
        const additionalRules = [
          ...prev.additionalRules,
          { ...ruleData, sortOrder: prev.additionalRules.length + 2 },
        ];
        return {
          ...prev,
          additionalRules,
          reportColumns: syncReportColumns(
            prev.masterRule,
            additionalRules,
            prev.reportColumns,
          ),
        };
      });
    }
  };

  const removeAdditionalRule = (index) => {
    setData((prev) => {
      const additionalRules = prev.additionalRules
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, sortOrder: i + 2 }));
      return {
        ...prev,
        additionalRules,
        reportColumns: syncReportColumns(
          prev.masterRule,
          additionalRules,
          prev.reportColumns,
        ),
      };
    });
  };

  const reorderRules = (reordered) => {
    setData((prev) => {
      const additionalRules = reordered.map((r, i) => ({
        ...r,
        sortOrder: i + 2,
      }));
      return {
        ...prev,
        additionalRules,
        reportColumns: syncReportColumns(
          prev.masterRule,
          additionalRules,
          prev.reportColumns,
        ),
      };
    });
  };

  const handleColumnsChange = (newColumns) => {
    setData((prev) => ({ ...prev, reportColumns: newColumns }));
  };

  const handleConditionChange = (index, value) => {
    setData((prev) => {
      const rules = [...prev.additionalRules];
      const targetGroupId = rules[index].groupId;
      if (targetGroupId) {
        rules.forEach((r, i) => {
          if (r.groupId === targetGroupId) {
            rules[i] = { ...r, conditionWithPrevious: value };
          }
        });
      } else {
        rules[index] = { ...rules[index], conditionWithPrevious: value };
      }
      return { ...prev, additionalRules: rules };
    });
  };

  const handleGroupRules = (index) => {
    setData((prev) => {
      const rules = [...prev.additionalRules];
      const above = rules[index];
      const below = rules[index + 1];
      if (!below) return prev;

      if (above.groupId && below.groupId && above.groupId !== below.groupId) {
        const targetId = above.groupId;
        const sourceId = below.groupId;
        const operator = above.conditionWithPrevious || "AND";
        rules.forEach((r, i) => {
          if (r.groupId === sourceId) {
            rules[i] = {
              ...r,
              groupId: targetId,
              conditionWithPrevious: operator,
            };
          }
        });
      } else if (above.groupId) {
        rules[index + 1] = {
          ...below,
          groupId: above.groupId,
          conditionWithPrevious: above.conditionWithPrevious || "AND",
        };
      } else if (below.groupId) {
        rules[index] = {
          ...above,
          groupId: below.groupId,
          conditionWithPrevious: below.conditionWithPrevious || "AND",
        };
      } else {
        const newGroupId = `group_${Date.now()}`;
        const operator = above.conditionWithPrevious || "AND";
        rules[index] = {
          ...above,
          groupId: newGroupId,
          conditionWithPrevious: operator,
        };
        rules[index + 1] = {
          ...below,
          groupId: newGroupId,
          conditionWithPrevious: operator,
        };
      }

      return { ...prev, additionalRules: rules };
    });
  };

  const handleUngroupRules = (groupId) => {
    setData((prev) => {
      const rules = prev.additionalRules.map((r) => {
        if (r.groupId === groupId) {
          const { groupId: _gid, ...rest } = r;
          return rest;
        }
        return r;
      });
      return { ...prev, additionalRules: rules };
    });
  };

  const handleRunReport = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      const masterRule = buildMasterRuleFromState();
      if (!masterRule) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            masterRule: "Master Rule is required!",
          },
        }));
        return;
      }
      if (!Array.isArray(data.reportColumns) || data.reportColumns.length === 0) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            reportColumns: "At least one report column is required.",
          },
        }));
        dispatch(
          showToastAction({
            description: "At least one report column is required.",
            type: "error",
          }),
        );
        return;
      }
      const masterTp = masterRuleData.timePeriod;
      if (
        masterTp?.type === "DATE_RANGE" &&
        masterTp.startDate &&
        masterTp.endDate &&
        new Date(masterTp.endDate) < new Date(masterTp.startDate)
      ) {
        dispatch(
          showToastAction({
            description: "End date must be after start date.",
            type: "error",
          }),
        );
        return;
      }
      const snapshot = {
        reportSetupId: id,
        title: data.title,
        masterRule,
        additionalRules: data.additionalRules,
        reportColumns: data.reportColumns,
        formatType: data.formatType,
        showPageHeader: data.showPageHeader,
        showPageFooter: data.showPageFooter,
        pageOrientation: data.pageOrientation,
      };
      dispatch(
        runReport(snapshot, setLoading, (success, formErrors) => {
          if (success) {
            navigate(-1);
          } else {
            setData((prev) => ({ ...prev, formErrors }));
          }
        }),
      );
    }
  };

  return (
    <>
      <FormPageLayout
        backText="Reports"
        onSubmit={handleRunReport}
        submitLoading={loading}
        submitLabel="Run Report"
      >
        <CustomCard title="Report Information">
          <CustomInput
            name="title"
            data={data}
            onChange={handleChange}
            required
            maxLength={100}
            helpText={`${(data.title || "").length}/100`}
          />
        </CustomCard>

        {/* ── Master Rule (user type & rule type read-only, rest editable) ── */}
        <CustomCard title="Master Rule">
          {masterRuleData.userType ? (
            <>
              <div className="c-col-12 flex gap-4 align-items-center mb-3">
                <div className="flex gap-2 align-items-center">
                  <span className="font-semibold text-color-primary">User Type:</span>
                  <span>{capitalizeSnakeCase(masterRuleData.userType)}</span>
                </div>
                <div className="flex gap-2 align-items-center">
                  <span className="font-semibold text-color-primary">Rule Type:</span>
                  <span>{capitalizeSnakeCase(masterRuleData.type)}</span>
                </div>
              </div>

              {/* Dynamic Filters */}
              {masterConfig?.filters?.length > 0 && (
                <>
                  <div className="c-col-12 font-semibold text-color-primary">
                    Filters
                  </div>
                  {masterConfig.filters.map(
                    (f) =>
                      isMasterFilterVisible(f) && (
                        <FilterField
                          key={f.name}
                          def={f}
                          filters={masterRuleData.filters}
                          onChange={handleMasterFilterChange}
                        />
                      ),
                  )}
                </>
              )}

              {/* Metric */}
              {masterConfig?.metric && (
                <>
                  <div className="c-col-12 font-semibold text-color-primary">
                    Metric
                  </div>
                  {masterConfig.metric.fields && (
                    <CustomDropdown
                      name="field"
                      label="Metric Field"
                      data={masterRuleData.metric}
                      onChange={handleMasterMetricChange}
                      options={masterConfig.metric.fields}
                      col={4}
                    />
                  )}
                  <CustomDropdown
                    name="operator"
                    label="Condition"
                    data={masterRuleData.metric}
                    onChange={handleMasterMetricChange}
                    options={masterConfig.metric.operators}
                    col={4}
                  />
                  <CustomNumberInput
                    name="value"
                    label="Number"
                    data={masterRuleData.metric}
                    onChange={handleMasterMetricChange}
                    col={4}
                  />
                  {masterRuleData.metric.operator === "BETWEEN" && (
                    <CustomNumberInput
                      name="secondValue"
                      label="Second Number"
                      data={masterRuleData.metric}
                      onChange={handleMasterMetricChange}
                      col={4}
                    />
                  )}
                </>
              )}

              {/* Time Period */}
              {masterConfig?.timePeriod && (
                <>
                  <div className="c-col-12 font-semibold text-color-primary">
                    {masterConfig.timePeriodLabel || "Time Period"}
                  </div>
                  <CustomOptionSelect
                    name="type"
                    label="Period Type"
                    data={masterRuleData.timePeriod}
                    onChange={handleMasterTimePeriodChange}
                    options={TIME_PERIOD_TYPE_OPTIONS}
                    col={12}
                  />
                  {masterRuleData.timePeriod.type === "DATE_RANGE" && (
                    <>
                      <CustomCalendarInput
                        name="startDate"
                        label="Start Date"
                        data={masterRuleData.timePeriod}
                        onChange={handleMasterTimePeriodChange}
                        dateString
                        col={4}
                      />
                      <CustomCalendarInput
                        name="endDate"
                        label="End Date"
                        data={masterRuleData.timePeriod}
                        onChange={handleMasterTimePeriodChange}
                        dateString
                        col={4}
                      />
                    </>
                  )}
                  {masterRuleData.timePeriod.type === "RELATIVE" && (
                    <CustomNumberInput
                      name="relativeDays"
                      label="Relative Days"
                      data={masterRuleData.timePeriod}
                      onChange={handleMasterTimePeriodChange}
                      col={4}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <div className="c-col-12 text-center text-secondary py-3">
              No master rule configured.
            </div>
          )}

          {data.formErrors?.masterRule && (
            <div
              id="error-element"
              className="c-col-12 text-sm"
              style={{ color: "var(--color-danger)" }}
            >
              {data.formErrors.masterRule}
            </div>
          )}
        </CustomCard>

        <CustomCard
          title="Additional Rules"
          actions
          onAdd={openAddRuleModal}
          addTitle="Add Rule"
        >
          <AdditionalRulesContainer
            rules={data.additionalRules}
            onEdit={openEditRuleModal}
            onDelete={removeAdditionalRule}
            onReorder={reorderRules}
            onConditionChange={handleConditionChange}
            onGroup={handleGroupRules}
            onUngroup={handleUngroupRules}
          />
        </CustomCard>

        <CustomCard title="Report Columns">
          <ReportColumns
            columns={data.reportColumns}
            onChange={handleColumnsChange}
            hideDelete
          />
        </CustomCard>

        <CustomCard title="Display Options">
          <CustomDropdown
            name="formatType"
            label="Format Type"
            data={data}
            onChange={handleChange}
            options={FORMAT_TYPE_OPTIONS}
            col={6}
          />
          <CustomDropdown
            name="pageOrientation"
            label="Page Orientation"
            data={data}
            onChange={handleChange}
            options={PAGE_ORIENTATION_OPTIONS}
            col={6}
          />
          <CustomDropdown
            name="showPageHeader"
            label="Show Page Header"
            data={data}
            onChange={handleChange}
            booleanOptions
            col={6}
          />
          <CustomDropdown
            name="showPageFooter"
            label="Show Page Footer"
            data={data}
            onChange={handleChange}
            booleanOptions
            col={6}
          />
        </CustomCard>
      </FormPageLayout>

      <RuleModal
        visible={ruleModal.visible}
        onHide={() => setRuleModal((prev) => ({ ...prev, visible: false }))}
        rule={ruleModal.rule}
        onSave={handleRuleSave}
        isMaster={false}
        hideDataPoints
      />
    </>
  );
}

export default React.memo(RunReport);
