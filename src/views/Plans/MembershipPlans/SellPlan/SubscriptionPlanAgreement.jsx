import React, { useRef, useState, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import domToPdf from "dom-to-pdf";
import FormPageLayout from "@shared/layout/FormPageLayout";
import CustomCard from "@shared/cards/CustomCard";
import PrimaryButton from "@buttons/PrimaryButton";
import CustomForm from "@inputs/CustomForm";
import CustomDialog from "../../../../shared/overlays/CustomDialog";
import CustomCheckbox from "../../../../shared/inputs/CustomCheckbox";
import { base64ToFile, getFileURL } from "../../../../utils/fileHelper";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSubscriptionAgreement,
  postSubscriptionAgreement,
} from "../../../../store/plan/planActions";
import moment from "moment/moment";

import { useReactToPrint } from "react-to-print";

import sign from "../../../../assets/images/sign.png";

export default function SubscriptionPlanAgreement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const templateRef = useRef();
  const signRef = useRef();
  const [data, setData] = useState({
    htmlContent: "",
    cssContent: "",
    isSigned: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        getSubscriptionAgreement(id, setLoading, (e) => {
          let _html = stripBodyTag(e?.htmlContent);
          let _css = stripGlobalCss(e?.cssContent);
          setData({
            ...e,
            htmlContent: replaceWithImage(_html, "{{MEMBER_SIGNATURE}}"),
            cssContent: _css,
          });
          let _signatures = getPlaceholderUrls(_html, "{{MEMBER_SIGNATURE}}");
          if (e?.signatures.length) {
            setSignatures(e?.signatures);
          } else {
            setSignatures(_signatures);
          }
        }),
      );
    }
  }, [id]);

  const [openSignatureModal, setOpenSignatureModal] = useState(null);
  const [signatures, setSignatures] = useState([{}, {}]);
  const [copyToAll, setCopyToAll] = useState(false);

  const onOpenSignatureModel = (i) => {
    setOpenSignatureModal(i + 1);
  };
  const onCloseSignatureModel = () => {
    setOpenSignatureModal(null);
  };
  const handleClearSign = (e) => {
    e.preventDefault();
    signRef.current.clear();
  };
  const handleSignSave = (e) => {
    e.preventDefault();
    if (signRef.current) {
      let isEmpty = signRef.current.isEmpty();
      let file = "";
      if (!isEmpty) {
        let dataURL = signRef.current.getTrimmedCanvas().toDataURL("image/png");
        dataURL = dataURL.split(",")[1];
        const mimeType = "image/png";
        const fileName = `signature_${openSignatureModal}.png`;
        file = base64ToFile(dataURL, mimeType, fileName);
      }
      let _signatures = [...signatures];
      if (copyToAll) {
        _signatures = _signatures.map(() => ({ url: file, error: false }));
      } else {
        _signatures[openSignatureModal - 1].url = file;
        _signatures[openSignatureModal - 1].error = false;
      }
      setSignatures(_signatures);
      onCloseSignatureModel();
    }
  };

  useEffect(() => {
    if (signatures.length) {
      signatures.forEach((item, i) => {
        let imgElement = document.getElementById(`signature-${i + 1}`);
        if (imgElement && item?.url) {
          imgElement.src = getFileURL(item?.url);
        }
      });
    }
  }, [signatures]);

  function getPlaceholderUrls(template, placeholder) {
    const regex = new RegExp(placeholder, "g");
    const matches = [...template.matchAll(regex)];
    return matches.map(() => ({
      url: "",
      error: false,
    }));
  }

  function replaceWithImage(template, placeholder) {
    let occurrence = 0;
    return template.replace(new RegExp(placeholder, "g"), () => {
      occurrence += 1;
      return `<img src="${sign}" id="signature-${occurrence}" alt="signature-${occurrence}" style="max-height: 100px; max-width: 300px" />`;
    });
  }

  function stripBodyTag(html = "") {
    return html.replace(/<body[^>]*>/i, "").replace(/<\/body>/i, "");
  }
  function stripGlobalCss(css = "") {
    return css
      .replace(/body\s*\{[^}]*\}/gi, "")
      .replace(/\*\s*\{[^}]*\}/gi, "");
  }

  const handleDownloadPdf = async () => {
    let { subscription } = data;
    let { member, company } = subscription;
    setLoading(true);
    const elementToPrint = document.getElementById("agreement-template");
    const options = {
      filename: `${member?.firstName}-${member?.lastName}-${company?.shortName}(${moment().format("ll")}).pdf`,
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      html2canvas: {
        scale: 2,
      },
    };
    const wrapper = document.createElement("div");
    wrapper.appendChild(elementToPrint.cloneNode(true));
    document.body.appendChild(wrapper);
    await new Promise((resolve) => {
      domToPdf(wrapper, options, () => {
        document.body.removeChild(wrapper);
        setLoading(false);
        resolve();
      });
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (data?.isSigned) {
      return;
    }
    let isValid = true;
    let _signatures = signatures.map((item) => {
      if (!item.url) {
        isValid = false;
        return { ...item, error: true };
      } else {
        return item;
      }
    });

    if (isValid) {
      dispatch(
        postSubscriptionAgreement(
          id,
          data,
          signatures,
          setSubmitLoading,
          () => {
            navigate("/plans");
          },
        ),
      );
    } else {
      setSignatures(_signatures);
    }
  };

  return (
    <>
      <FormPageLayout hideCancel>
        <CustomCard title="Subscription Plan Agreement">
          <div className="c-col-9 bg-white border-round-sm p-2">
            <div ref={templateRef} id="agreement-template" className="p-2">
              <div
                dangerouslySetInnerHTML={{ __html: data?.htmlContent }}
              ></div>
              <style
                dangerouslySetInnerHTML={{ __html: data?.cssContent }}
              ></style>
            </div>
          </div>
          <div className="c-col-3">
            <div className="flex flex-column gap-2">
              <div className="flex gap-2">
                {!data?.isSigned && (
                  <PrimaryButton
                    label="Confirm"
                    onClick={onSubmit}
                    className="w-full"
                    loading={submitLoading}
                  />
                )}
                <PrimaryButton
                  label="Download"
                  className="w-full"
                  severity="warning"
                  onClick={handleDownloadPdf}
                />
              </div>

              {signatures?.map((item, i) => (
                <div
                  key={i}
                  className={`signature-box ${item?.error ? "signature-error" : ""}`}
                >
                  <button
                    type="button"
                    className="signature-action"
                    onClick={() => onOpenSignatureModel(i)}
                  >
                    Sign {i + 1}
                  </button>

                  <div className="signature-content">
                    {item?.url ? (
                      <img
                        src={getFileURL(item?.url)}
                        alt={`signature-${i + 1}`}
                        className="signature-image"
                      />
                    ) : (
                      <div className="signature-placeholder">
                        <span>Your Signature Here</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CustomCard>
      </FormPageLayout>

      <CustomDialog
        title={`Signature ${openSignatureModal ? openSignatureModal : ""}`}
        visible={openSignatureModal}
        onHide={onCloseSignatureModel}
      >
        <CustomForm
          onSubmit={handleSignSave}
          onCancel={onCloseSignatureModel}
          onDelete={handleClearSign}
          deleteLabel="Clear"
        >
          <div className="border-round-sm border-1 surface-border c-col-12">
            <SignaturePad ref={signRef} canvasProps={{ className: "sigPad" }} />
          </div>
          <CustomCheckbox
            label="Copy To All"
            value={copyToAll}
            onChange={(e) => setCopyToAll(e.value)}
          />
        </CustomForm>
      </CustomDialog>
    </>
  );
}
