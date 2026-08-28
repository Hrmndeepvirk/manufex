import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomCheckbox from "@inputs/CustomCheckbox";
import CustomDropdown from "@inputs/CustomDropdown";
import formValidation, { showFormErrors } from "@formValidations";
import {
  addOrUpdateReport,
  getReport,
} from "../../../store/reports/reportsActions";
import { getDataPoints } from "@utils/reportDataPoints";
import RuleModal from "./RuleModal";
import RuleBox from "./RuleBox";
import AdditionalRulesContainer from "./AdditionalRulesContainer";
import ReportColumns from "./ReportColumns";

const FORMAT_TYPE_OPTIONS = [
  { title: "PDF", _id: "PDF" },
  { title: "CSV", _id: "CSV" },
];

const PAGE_ORIENTATION_OPTIONS = [
  { title: "Portrait", _id: "PORTRAIT" },
  { title: "Landscape", _id: "LANDSCAPE" },
];

function ReportForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    isActive: true,
    editAtRuntime: false,
    masterRule: null,
    additionalRules: [],
    reportColumns: [],
    formatType: "PDF",
    showPageHeader: true,
    showPageFooter: true,
    pageOrientation: "PORTRAIT",
    formErrors: {},
  });

  const [ruleModal, setRuleModal] = useState({
    visible: false,
    rule: null,
    isMaster: false,
    editIndex: null,
  });

  useEffect(() => {
    if (id) {
      dispatch(
        getReport(id, setLoading, (res) => {
          setData({
            title: res.title || "",
            description: res.description || "",
            isActive: res.isActive ?? true,
            editAtRuntime: res.editAtRuntime ?? false,
            masterRule: res.masterRule || null,
            additionalRules: res.additionalRules || [],
            reportColumns: res.reportColumns || [],
            formatType: res.formatType || "PDF",
            showPageHeader: res.showPageHeader ?? true,
            showPageFooter: res.showPageFooter ?? true,
            pageOrientation: res.pageOrientation || "PORTRAIT",
            formErrors: {},
          });
        }),
      );
    }
  }, [id]);

  const handleChange = ({ name, value }) => {
    const ignore = ["description"];
    let formErrors = formValidation(name, value, data, ignore);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const openMasterRuleModal = () => {
    setRuleModal({
      visible: true,
      rule: data.masterRule,
      isMaster: true,
      editIndex: null,
    });
  };

  const openAddRuleModal = () => {
    setRuleModal({
      visible: true,
      rule: null,
      isMaster: false,
      editIndex: null,
    });
  };

  const openEditRuleModal = (index) => {
    setRuleModal({
      visible: true,
      rule: data.additionalRules[index],
      isMaster: false,
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
    if (ruleModal.isMaster) {
      setData((prev) => {
        const masterRule = { ...ruleData, sortOrder: 1 };
        return {
          ...prev,
          masterRule,
          reportColumns: syncReportColumns(
            masterRule,
            prev.additionalRules,
            prev.reportColumns,
          ),
          formErrors: { ...prev.formErrors, masterRule: "" },
        };
      });
    } else if (ruleModal.editIndex !== null) {
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
    setData((prev) => {
      // Rebuild each rule's dataPoints from the remaining columns
      const masterDataPoints = newColumns
        .filter((c) => c.ruleNumber === 1)
        .map((c) => c.dataPointId);

      const updatedMaster = prev.masterRule
        ? { ...prev.masterRule, dataPoints: masterDataPoints }
        : prev.masterRule;

      const updatedAdditional = prev.additionalRules.map((rule, i) => {
        const ruleNum = i + 2;
        const ruleDataPoints = newColumns
          .filter((c) => c.ruleNumber === ruleNum)
          .map((c) => c.dataPointId);
        return { ...rule, dataPoints: ruleDataPoints };
      });

      return {
        ...prev,
        reportColumns: newColumns,
        masterRule: updatedMaster,
        additionalRules: updatedAdditional,
      };
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const ignore = ["description"];
    if (showFormErrors(data, setData, ignore)) {
      if (!data.masterRule || !data.masterRule.userType) {
        setData((prev) => ({
          ...prev,
          formErrors: {
            ...prev.formErrors,
            masterRule: "Master Rule is required!",
          },
        }));
        return;
      }
      const payload = {
        title: data.title,
        description: data.description,
        editAtRuntime: data.editAtRuntime,
        masterRule: data.masterRule,
        additionalRules: data.additionalRules,
        reportColumns: data.reportColumns,
        formatType: data.formatType,
        showPageHeader: data.showPageHeader,
        showPageFooter: data.showPageFooter,
        pageOrientation: data.pageOrientation,
      };
      dispatch(
        addOrUpdateReport(id, payload, setLoading, (success, formErrors) => {
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
        onSubmit={handleSubmit}
        submitLoading={loading}
      >
        <CustomCard title="Report Details">
          <CustomInput
            name="title"
            data={data}
            onChange={handleChange}
            required
          />
          <CustomTextArea
            name="description"
            data={data}
            onChange={handleChange}
          />
          <CustomCheckbox
            data={data}
            onChange={handleChange}
            name="isActive"
            label="Active"
          />
          <CustomCheckbox
            data={data}
            onChange={handleChange}
            name="editAtRuntime"
            label="Edit At Runtime"
          />
        </CustomCard>

        <CustomCard
          title="Master Rule"
          actions
          onEdit={openMasterRuleModal}
          onAdd={!data.masterRule ? openMasterRuleModal : undefined}
          addTitle="Configure Master Rule"
        >
          {data.masterRule?.userType ? (
            <div className="c-col-12">
              <RuleBox
                rule={data.masterRule}
                index={0}
                onEdit={openMasterRuleModal}
                isMaster
              />
            </div>
          ) : (
            <div
              className="c-col-12 text-center text-secondary py-3"
              onClick={openMasterRuleModal}
              style={{ cursor: "pointer" }}
            >
              No master rule configured. Click edit to configure.
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
        isMaster={ruleModal.isMaster}
      />
    </>
  );
}

export default React.memo(ReportForm);
