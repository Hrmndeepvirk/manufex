import CustomDialog from "@shared/overlays/CustomDialog";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "grapesjs/dist/css/grapes.min.css";
import "./PageBuilder.css";
import grapesjs from "grapesjs";
import plugin from "grapesjs-preset-newsletter";
import { useNavigate } from "react-router-dom";
import CustomForm from "@inputs/CustomForm";
import CustomInput from "@inputs/CustomInput";
import CustomTextArea from "@inputs/CustomTextArea";
import CustomMultiSelect from "@inputs/CustomMultiSelect";
import CustomCheckbox from "@inputs/CustomCheckbox";
import formValidation, { showFormErrors } from "@formValidations";
import { mergeFields } from "@utils/constants";
import {
  getAgreementTemplate,
  addOrUpdateAgreementTemplate,
  addAssets,
  deleteAsset,
  getAssets,
} from "@store/settings/agreementSetup/agreementTemplateActions";

export default function PageBuilder({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    club: [],
    isActive: true,
  });

  const onGetAssets = () => {
    dispatch(
      getAssets((data) => {
        let { models } = editorRef.current.AssetManager.getAll();

        let as = data.map((item) => ({
          id: item._id,
          name: item.name,
          type: "image",
          src: item.url,
        }));

        if (models && models.length) {
          as = as.filter(
            (item) =>
              models.findIndex((item2) => item.id === item2.attributes.id) ===
              -1,
          );
        }
        editorRef.current.AssetManager.add(as);
      }),
    );
  };

  useEffect(() => {
    onGetAssets();
  }, []);

  const onAddAsset = async (e) => {
    dispatch(
      addAssets(e.target.files, (data) => {
        let as = data.map((item) => ({
          id: item._id,
          name: item.name,
          type: "image",
          src: item.url,
        }));
        editorRef.current.AssetManager.add(as);
      }),
    );
  };

  const onRemoveAsset = async ({ attributes }) => {
    dispatch(
      deleteAsset(attributes.id, () => {
        editorRef.current.AssetManager.remove(attributes.src);
      }),
    );
  };

  let initialTemplate = {
    htmlContent:
      '<body><table id="i7mg"><tbody><tr><td id="isf3"><table id="ib67"><tbody><tr><td id="ixft"><table id="ib2u2"><tbody><tr><td id="iz5hj"><img id="ishaz" src="https://impactzoneapi.appdeft.biz/public/static/dummy-logo.png"/></td></tr></tbody></table><h1 class="heading">Its time to design your Contract.</h1><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua\n      <br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua<br/><br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua<br/></p></td></tr></tbody></table><table id="i8jsj"><tbody><tr><td id="idfyu"><img id="ib46g" src="https://impactzoneapi.appdeft.biz/public/static/twitter.png"/><img src="https://impactzoneapi.appdeft.biz/public/static/facebook.png" id="ivccx"/><img src="https://impactzoneapi.appdeft.biz/public/static/link.png" id="ijlgh"/></td></tr></tbody></table><table id="ivqzu"><tbody><tr><td class="divider"></td></tr></tbody></table><div id="i6st6">Copyright | 2026 | Valence | All rights reserved</div></td></tr></tbody></table></body>',
    cssContent:
      "* { box-sizing: border-box; } body {margin: 0;}*{box-sizing:border-box;}body{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}*{box-sizing:border-box;}body{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}*{box-sizing:border-box;}body{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}#i7mg{height:150px;margin-top:0px;margin-right:auto;margin-bottom:10px;margin-left:auto;padding-top:30px;padding-right:30px;padding-bottom:30px;padding-left:30px;width:100%;background-color:rgb(242, 245, 254);}#isf3{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;vertical-align:top;}#ib67{height:150px;padding-top:50px;padding-right:50px;padding-bottom:50px;padding-left:50px;width:100%;background-color:rgb(255, 255, 255);border-top-left-radius:10px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;}#ixft{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;vertical-align:top;}#ib2u2{height:150px;margin-top:0px;margin-right:auto;margin-bottom:10px;margin-left:auto;padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px;width:100%;}#iz5hj{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;vertical-align:middle;text-align:center;}#ishaz{color:black;width:200px;height:74px;}.heading{text-align:center;}.paragraph{text-align:center;font-size:20px;color:rgb(81, 81, 81);}#i8jsj{height:150px;margin-top:0px;margin-right:auto;margin-bottom:10px;margin-left:auto;padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px;width:100%;}#idfyu{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;vertical-align:middle;text-align:center;}#ib46g{color:black;width:40px;height:40px;margin-top:0px;margin-right:10px;margin-bottom:0px;margin-left:10px;}#ijlgh{color:black;width:40px;height:40px;margin-top:0px;margin-right:10px;margin-bottom:0px;margin-left:10px;}#ivccx{color:black;width:40px;height:40px;margin-top:0px;margin-right:10px;margin-bottom:0px;margin-left:10px;}.divider{background-color:rgba(0, 0, 0, 0.1);height:1px;}#ivqzu{width:100%;margin-top:10px;margin-bottom:10px;}#i6st6{padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;text-align:center;color:rgb(71, 69, 69);}",
  };

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
    }
  }, []);

  useEffect(() => {
    const initEditor = () => {
      const editor = grapesjs.init({
        container: ".gpj",
        plugins: [plugin],
        storageManager: {
          type: null,
          autosave: false,
          autoload: false,
        },

        assetManager: {
          assets: [],
          uploadFile: onAddAsset,
        },
      });

      let panelManager = editor.Panels;

      let am = editor.AssetManager;
      let assets = am.getAll();
      assets.on("remove", onRemoveAsset);

      editor.DomComponents.addType("merge_field", {
        model: {
          defaults: {
            traits: [
              {
                type: "select",
                label: "Merge Fields",
                name: "merge_fields_dropdown",
                options: mergeFields.map((item) => ({
                  name: item.name,
                  value: item.value,
                })),
                changeProp: 1,
              },
            ],
          },
          init() {
            this.on("change:merge_fields_dropdown", this.handleTypeChange);
          },

          handleTypeChange(e) {
            this.replaceWith(
              ` <div data-gjs-type="merge_field" data-gjs-droppable="false">${e.changed.merge_fields_dropdown}</div>`,
            );
          },
        },
      });
      editor.BlockManager.add("membership_type", {
        id: "membership_type",
        label: "Membership Type",
        category: "Field",
        content: `<span>{{MEMBERSHIP_TYPE}}</span>`,
        media: `<svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5382_9541)">
                <path d="M16.0151 0.5C16.9988 0.653312 17.7253 1.23739 18.3677 1.93951C18.9125 2.53512 19.5908 2.9184 20.3011 3.26369C21.3804 3.78943 22.0893 4.60416 22.2969 5.81234C22.3498 6.12032 22.3837 6.43441 22.4665 6.73493C22.5906 7.18808 22.7317 7.6392 22.8999 8.0781C23.0261 8.40847 23.2127 8.7151 23.3599 9.03732C23.79 9.97619 23.8286 10.9388 23.3497 11.8526C22.7894 12.9224 22.4319 14.0376 22.2521 15.2288C22.1395 15.975 21.7738 16.6188 21.1524 17.0815C21.0025 17.1934 21.0561 17.2857 21.1097 17.4037C21.9428 19.2251 22.7799 21.0438 23.5993 22.8714C23.6902 23.0749 23.7425 23.3354 23.7031 23.5491C23.6217 23.9839 23.1821 24.1861 22.7025 24.0545C21.8227 23.813 20.9449 23.5633 20.0664 23.3178C19.97 23.2906 19.8717 23.2703 19.7597 23.2425C19.4755 23.8394 19.1967 24.4255 18.9179 25.0117C18.7619 25.34 18.6058 25.6683 18.4532 25.9973C18.3087 26.308 18.0774 26.5007 17.726 26.498C17.3753 26.4953 17.1487 26.3012 17.0062 25.9878C16.1725 24.1576 15.3334 22.33 14.503 20.4984C14.4284 20.3343 14.3389 20.261 14.1571 20.2298C13.5981 20.1348 13.0439 20.1409 12.493 20.2603C12.4035 20.28 12.3051 20.3879 12.263 20.4794C11.4422 22.2595 10.6295 24.0436 9.81548 25.8271C9.78767 25.8888 9.75782 25.9492 9.73 26.0109C9.59297 26.3175 9.35961 26.4953 9.02178 26.498C8.68192 26.5014 8.44924 26.3202 8.3061 26.0197C7.90382 25.1724 7.50358 24.3245 7.10131 23.4765C7.06535 23.4012 7.02533 23.3286 6.97852 23.237C6.24724 23.4412 5.52477 23.6427 4.80162 23.8442C4.53299 23.9188 4.26367 23.9907 3.99504 24.066C3.67892 24.1542 3.4035 24.0809 3.18981 23.8354C2.9673 23.5796 2.94967 23.2865 3.08873 22.982C3.56224 21.944 4.03642 20.9068 4.5106 19.8689C4.88642 19.0467 5.26563 18.2259 5.63331 17.3996C5.66858 17.3203 5.67401 17.1581 5.6272 17.1222C4.84843 16.532 4.52146 15.6996 4.40071 14.7804C4.27996 13.8606 3.99843 13.0085 3.55206 12.1979C3.25222 11.6531 3.05956 11.0663 3.06228 10.4327C3.06499 9.80796 3.26986 9.23744 3.54935 8.69135C3.89193 8.02044 4.23179 7.35225 4.32201 6.58636C4.3634 6.23497 4.44209 5.88696 4.51942 5.54099C4.71411 4.66996 5.2039 4.00787 5.96436 3.54318C6.05119 3.49027 6.13395 3.42921 6.22621 3.38783C7.22613 2.93604 8.08631 2.29972 8.83727 1.49789C9.34537 0.956545 9.99253 0.629569 10.732 0.5C11.0366 0.5 11.3418 0.5 11.6464 0.5C12.7976 0.786273 13.9495 0.785595 15.1007 0.5C15.4053 0.5 15.7099 0.5 16.0151 0.5ZM11.1878 2.00463C10.5508 1.97953 10.1079 2.33975 9.71847 2.76102C8.98922 3.54861 8.14736 4.17203 7.16711 4.60687C6.40258 4.94606 5.98606 5.52403 5.89787 6.35843C5.78798 7.40516 5.47796 8.39083 4.94544 9.30325C4.8776 9.41925 4.83215 9.54882 4.77449 9.67092C4.53163 10.1845 4.52688 10.698 4.77042 11.2129C4.83554 11.3506 4.8871 11.4951 4.9624 11.6267C5.44947 12.4828 5.77984 13.3918 5.86463 14.3761C5.94875 15.3509 6.43582 16.0029 7.33535 16.3807C8.25522 16.7674 9.02517 17.3738 9.68523 18.1153C10.2768 18.7794 10.9877 18.9952 11.856 18.81C12.7901 18.6105 13.7392 18.5508 14.676 18.7828C15.7384 19.0454 16.5734 18.7394 17.2722 17.9125C17.8196 17.2646 18.5163 16.7979 19.2862 16.4411C19.4626 16.3597 19.6281 16.2559 19.8011 16.167C20.3682 15.8753 20.7163 15.4208 20.7949 14.7852C20.9455 13.5716 21.3003 12.4285 21.9082 11.3621C22.2819 10.7061 22.2148 10.042 21.8505 9.405C21.2922 8.4295 20.9611 7.38549 20.8302 6.27024C20.7563 5.63868 20.5087 5.0797 19.8968 4.79071C18.7035 4.22766 17.6581 3.47534 16.7573 2.50934C16.3475 2.06976 15.8103 1.96325 15.2174 2.04601C14.4148 2.15794 13.615 2.33229 12.7956 2.22375C12.2597 2.15319 11.7237 2.0779 11.1878 2.00463ZM9.00482 23.933C9.56448 22.7072 10.095 21.5452 10.6356 20.3614C9.90367 20.2447 9.33655 19.8737 8.82912 19.3968C8.57066 19.1532 8.33256 18.8866 8.06256 18.6567C7.75797 18.3982 7.42828 18.1696 7.08164 17.9071C6.4209 19.3533 5.79205 20.7311 5.14556 22.1469C5.25342 22.1252 5.31854 22.1164 5.38095 22.0987C5.91009 21.9529 6.43922 21.807 6.96767 21.6591C7.64333 21.4705 7.88958 21.5838 8.19417 22.2256C8.45398 22.7744 8.71448 23.3218 9.00482 23.933ZM17.7368 23.9215C17.806 23.7885 17.8501 23.7099 17.8888 23.6278C18.1391 23.1014 18.384 22.5729 18.6391 22.0492C18.8392 21.6388 19.1607 21.495 19.6017 21.613C20.0827 21.7419 20.5616 21.8796 21.0426 22.0105C21.2135 22.0573 21.3865 22.0974 21.6042 22.1523C20.9503 20.7209 20.3201 19.3432 19.6553 17.8887C19.2489 18.2191 18.8629 18.4911 18.5258 18.8147C17.823 19.4883 17.1562 20.204 16.1121 20.3634C16.6542 21.5506 17.1833 22.7093 17.7368 23.9215Z" fill="#252B42"/>
                <path d="M10.8269 10.4925C10.1621 9.2884 10.1451 8.0307 10.5358 6.79131C10.97 5.41286 12.455 4.58796 13.8544 4.83149C15.3279 5.08724 16.4011 6.32866 16.4214 7.80005C16.4241 7.99474 16.4153 8.18944 16.4234 8.38345C16.4553 9.12627 16.34 9.83313 15.9004 10.4722C15.9588 10.5034 15.9995 10.5298 16.0429 10.5488C17.0089 10.9748 17.4953 11.7244 17.5251 12.7712C17.538 13.2277 17.5306 13.6849 17.5265 14.1415C17.5217 14.6862 17.2212 14.9888 16.6744 14.9894C14.4745 14.9922 12.2752 14.9922 10.0752 14.9894C9.52778 14.9888 9.22591 14.6862 9.22116 14.1428C9.21709 13.6775 9.20827 13.2121 9.22319 12.7474C9.25576 11.7326 9.72994 10.9999 10.6566 10.5692C10.7102 10.5441 10.7645 10.521 10.8269 10.4925ZM14.9154 8.32647C14.9093 8.32579 14.9025 8.32579 14.8964 8.32511C14.8964 8.14738 14.9019 7.96964 14.8957 7.79259C14.8673 6.96294 14.1889 6.31645 13.3586 6.32391C12.5398 6.33137 11.8756 6.97786 11.8532 7.79869C11.8437 8.13652 11.8451 8.47503 11.8526 8.81286C11.8709 9.58146 12.457 10.2096 13.2249 10.2931C13.9772 10.3745 14.6943 9.8623 14.8517 9.1066C14.9039 8.85289 14.8957 8.58696 14.9154 8.32647ZM10.7685 13.4489C12.5072 13.4489 14.2425 13.4489 15.9845 13.4489C15.9845 13.1544 16.0151 12.8729 15.9737 12.6029C15.9472 12.4333 15.8523 12.2115 15.7186 12.1335C15.3577 11.9232 14.9602 11.774 14.5728 11.6118C14.5226 11.5908 14.4426 11.6295 14.3802 11.6505C13.7086 11.8778 13.039 11.8805 12.3668 11.6498C12.2786 11.62 12.1633 11.6139 12.0778 11.6444C11.7997 11.7421 11.5269 11.8581 11.2556 11.9748C10.989 12.0894 10.8038 12.2902 10.7753 12.5805C10.7468 12.8621 10.7685 13.1483 10.7685 13.4489Z" fill="#252B42"/>
                </g>
                <defs>
                <clipPath id="clip0_5382_9541">
                <rect width="26" height="26" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
                </defs>
                </svg>`,
      });
      editor.BlockManager.add("services", {
        id: "services",
        label: "Services",
        category: "Field",
        content: `<span>{{SERVICES}}</span>`,
        media: `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M20.017 14.669L23 13.564l-.012-3.208-2.996-1.085a8.455 8.455 0 0 0-.437-1.05l1.329-2.893-2.277-2.26-2.886 1.351a8.396 8.396 0 0 0-1.052-.436L13.564 1l-3.208.012-1.085 2.996a8.485 8.485 0 0 0-1.05.437L5.328 3.116l-2.26 2.276L4.419 8.28a8.378 8.378 0 0 0-.436 1.052L1 10.436l.012 3.208 2.996 1.085a8.46 8.46 0 0 0 .437 1.05l-1.329 2.893 2.276 2.26 2.887-1.351a8.383 8.383 0 0 0 1.052.436L10.436 23l3.208-.012 1.085-2.996a8.478 8.478 0 0 0 1.05-.437l2.893 1.329 2.26-2.276-1.351-2.887a8.382 8.382 0 0 0 .436-1.052zm-.287 3.73l-1.275 1.285-2.694-1.238-.429.215a7.612 7.612 0 0 1-.928.385l-.452.156-1.01 2.789-1.81.007-1.03-2.779-.456-.151a7.394 7.394 0 0 1-.926-.385l-.43-.21-2.688 1.257-1.286-1.275 1.239-2.695-.216-.43a7.551 7.551 0 0 1-.386-.926l-.155-.452-2.79-1.01-.005-1.81 2.777-1.03.152-.456a7.46 7.46 0 0 1 .384-.927l.212-.43L4.27 5.601l1.275-1.285 2.694 1.238.429-.215a7.612 7.612 0 0 1 .928-.385l.452-.156 1.01-2.789 1.81-.007 1.03 2.779.456.151a7.35 7.35 0 0 1 .925.385l.43.211L18.4 4.27l1.285 1.275-1.239 2.695.216.43a7.551 7.551 0 0 1 .386.926l.155.452 2.79 1.01.005 1.81-2.777 1.03-.152.456a7.46 7.46 0 0 1-.384.927l-.212.43zM12 7.2a4.8 4.8 0 1 0 4.8 4.8A4.8 4.8 0 0 0 12 7.2zm0 8.6a3.8 3.8 0 1 1 3.8-3.8 3.804 3.804 0 0 1-3.8 3.8z" fill="#252B42" stroke="2" /><path fill="none" d="M0 0h24v24H0z"/></svg>
                `,
      });
      editor.BlockManager.add("assessed_fees", {
        id: "assessed_fees",
        label: "Assessed Fees",
        category: "Field",
        content: `<span>{{ASSESSED_FEES}}</span>`,
        media: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.58203 13.9453V14.4828V24.0974H7.05159V22.7411L7.07485 22.7495C8.50452 23.225 10.5491 23.6477 12.5698 24.3703L12.72 24.4211L12.8682 24.3873C13.5032 24.2394 15.2142 23.7117 17.2544 23.0564C19.2945 22.401 21.6219 21.6267 23.3524 21.0293C24.1805 20.7425 24.6258 19.8163 24.3214 18.9938C24.0016 18.1523 23.0739 17.7739 22.2838 18.0164C21.6258 18.218 18.5374 19.172 16.5096 19.7705C16.5287 19.1921 16.6808 18.5666 16.2112 18.1983L16.1859 18.173L16.1541 18.1602C13.8749 16.8004 13.6817 16.6242 10.4772 14.9209L10.327 14.8468L10.1619 14.8638C9.05996 14.982 7.18775 15.2919 7.05158 15.3145V13.9454L1.58203 13.9453ZM2.66536 15.0288H5.97461V23.0141H2.66536V15.0288ZM10.1133 15.9639C13.0404 17.5229 13.3765 17.7609 15.5405 19.0511C15.8915 19.3265 15.985 19.6647 15.7733 19.9693C15.6596 20.1328 15.5406 20.1976 15.3755 20.2252C15.2104 20.2548 14.9825 20.2167 14.7217 20.1023C13.7471 19.6519 13.2169 19.3647 12.1403 18.7608L11.6685 18.4964L11.1395 19.4401L11.6113 19.7045C12.6949 20.3123 13.2672 20.6291 14.2752 21.0946H14.2837C14.6955 21.2781 15.1301 21.3658 15.5574 21.2934C15.7348 21.2637 15.8506 21.0828 16.0123 20.9951L16.0293 21.0438L16.5498 20.8955C18.5803 20.3009 21.922 19.2666 22.5991 19.059V19.0504C22.855 18.9721 23.2008 19.1013 23.3037 19.372C23.3995 19.6435 23.2746 19.9064 22.9969 20.0025C21.2782 20.5959 18.9554 21.368 16.9222 22.0211C14.94 22.6579 13.2626 23.1658 12.7349 23.2949C10.7012 22.5887 8.68032 22.1434 7.41552 21.7227L7.05159 21.6062V16.4097L7.14257 16.3969C7.14257 16.3969 9.01243 16.0931 10.1133 15.9639Z" fill="#252B42"/>
                <path d="M17.4843 1.57031C13.7866 1.57031 10.7734 4.58337 10.7734 8.28096C10.7734 11.9785 13.7866 14.9833 17.4843 14.9833C21.1821 14.9833 24.187 11.9785 24.187 8.28096C24.187 4.58337 21.1821 1.57031 17.4843 1.57031ZM17.4843 2.65428C20.5966 2.65428 23.103 5.16882 23.103 8.28096C23.103 11.3931 20.5966 13.8994 17.4843 13.8994C14.3721 13.8994 11.8574 11.3931 11.8574 8.28096C11.8574 5.16882 14.3721 2.65428 17.4843 2.65428Z" fill="#252B42"/>
                <path d="M16.9347 4.65625V5.20431V5.5958H15.46V8.81821H18.418V9.87412H16.0059H15.46V10.9574H16.0059H16.9347V11.3467V11.8926H18.0181V11.3467V10.9574H19.5013V7.73489H16.5433V6.67912H18.9554H19.5013V5.5958H18.9554H18.0181V5.20431V4.65625H16.9347Z" fill="#252B42"/>
                </svg>`,
      });
      editor.BlockManager.add("membership_name", {
        id: "membership_name",
        label: "Membership Name",
        category: "Field",
        content: `<div>{{MEMBERSHIP_NAME}}</div>`,
        media: `<svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5382_9560)">
                <path d="M13.9702 22.6438C11.8083 22.6438 9.6456 22.6446 7.48369 22.6438C6.06167 22.643 5.1388 21.9328 4.78971 20.5566C4.15655 18.0624 3.52659 15.5683 2.90466 13.0709C2.47211 11.3319 3.91339 9.87215 5.65079 10.283C6.48699 10.4804 7.32158 10.6859 8.15216 10.9074C8.34396 10.9587 8.43705 10.909 8.5502 10.7661C9.65925 9.36979 10.7731 7.97666 11.8902 6.58674C13.0297 5.16954 14.9693 5.16874 16.1097 6.58594C17.2147 7.95981 18.3174 9.33609 19.4095 10.7204C19.5636 10.9162 19.6968 10.9579 19.936 10.8929C20.7457 10.6714 21.561 10.4708 22.378 10.2774C24.0512 9.88098 25.5093 11.3046 25.1073 12.981C24.4861 15.5707 23.8297 18.1515 23.1652 20.7307C22.8587 21.9224 21.874 22.639 20.6069 22.6422C18.3944 22.6479 16.1819 22.6438 13.9702 22.6438ZM22.4943 12.8558C21.7408 13.0436 21.0458 13.2178 20.3509 13.3887C19.2169 13.6679 18.2788 13.3598 17.5462 12.4441C16.5824 11.2404 15.6202 10.0343 14.6564 8.82971C14.4461 8.5665 14.2327 8.30568 14.0039 8.02321C13.9125 8.13074 13.8402 8.21099 13.7736 8.29445C12.6598 9.68678 11.5451 11.0783 10.4337 12.4722C9.98747 13.0324 9.41529 13.4087 8.70749 13.4465C8.21957 13.4721 7.71882 13.3598 7.2325 13.2659C6.66915 13.1576 6.11463 13.0011 5.54406 12.8622C5.54085 12.9321 5.53202 12.9626 5.53844 12.9882C6.11383 15.2898 6.69243 17.5905 7.26139 19.8929C7.30393 20.0646 7.3922 20.0855 7.53745 20.0855C11.8404 20.0831 16.1434 20.0831 20.4472 20.0871C20.6301 20.0871 20.7048 20.0333 20.7489 19.8488C20.9848 18.8657 21.2376 17.8875 21.4832 16.906C21.8162 15.5795 22.1469 14.2498 22.4943 12.8558Z" fill="#252B42"/>
                <path d="M13.9993 26.4955C11.4667 26.4955 8.934 26.4979 6.40213 26.4939C5.54186 26.4923 4.98412 25.9113 5.0411 25.096C5.08283 24.5029 5.57075 24.0014 6.16138 23.9476C6.28095 23.9372 6.40133 23.938 6.5217 23.938C11.5068 23.9372 16.4919 23.9372 21.4762 23.9396C21.6648 23.9396 21.8614 23.9404 22.0411 23.9893C22.6615 24.1579 23.0282 24.7373 22.9528 25.3961C22.8846 25.9932 22.3718 26.4803 21.7474 26.4875C20.4666 26.5027 19.1851 26.4947 17.9035 26.4955C16.6026 26.4963 15.301 26.4955 13.9993 26.4955Z" fill="#252B42"/>
                <path d="M14.012 0.500095C14.8907 0.509725 15.6138 1.24481 15.6041 2.11953C15.5945 3.00067 14.8602 3.72532 13.9887 3.71569C13.11 3.70606 12.3869 2.97017 12.3966 2.09626C12.4054 1.21512 13.1397 0.490465 14.012 0.500095Z" fill="#252B42"/>
                <path d="M3.7405 7.54992C3.74692 8.4455 3.04955 9.15731 2.15958 9.16293C1.27122 9.16935 0.551385 8.46316 0.544965 7.57881C0.538545 6.69366 1.25036 5.9674 2.13069 5.96098C3.01745 5.95456 3.73408 6.66236 3.7405 7.54992Z" fill="#252B42"/>
                <path d="M25.8397 9.16294C24.9498 9.15733 24.2524 8.44551 24.2588 7.54993C24.2653 6.66157 24.9819 5.95377 25.8678 5.96099C26.7482 5.96741 27.46 6.69367 27.4544 7.57882C27.4487 8.46317 26.7289 9.16936 25.8397 9.16294Z" fill="#252B42"/>
                </g>
                <defs>
                <clipPath id="clip0_5382_9560">
                <rect width="26.9092" height="26" fill="white" transform="translate(0.544922 0.5)"/>
                </clipPath>
                </defs>
                </svg>`,
      });
      editor.BlockManager.add("signature", {
        id: "signature",
        label: "Signature",
        category: "Field",
        content: `<div>{{MEMBER_SIGNATURE}}</div>`,
        media: `<svg fill="#000000" width="26" height="26" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" ><path d="M232 64L280 64 280 214 277 270 300 242 356 189 388 221 256 353 124 221 156 189 212 242 235 270 232 214 232 64ZM64 400L448 400 448 448 64 448 64 400Z" fill="#252B42" stroke="2" /></svg>`,
      });
      editor.BlockManager.add("initials", {
        id: "initials",
        label: "Initials",
        category: "Field",
        content: `<div>{{MEMBER_INITIALS}}</div>`,
        media: `<svg width="26" height="26" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="ic_fluent_signature_28_filled" fill="#212121" fill-rule="nonzero">
                            <path d="M16.4798956,21.0019578 L16.75,21 C17.9702352,21 18.6112441,21.5058032 19.4020627,22.7041662 L19.7958278,23.3124409 C20.1028266,23.766938 20.2944374,23.9573247 20.535784,24.0567929 C20.9684873,24.2351266 21.3271008,24.1474446 22.6440782,23.5133213 L23.0473273,23.3170319 C23.8709982,22.9126711 24.4330286,22.6811606 25.0680983,22.5223931 C25.4699445,22.4219316 25.8771453,22.6662521 25.9776069,23.0680983 C26.0780684,23.4699445 25.8337479,23.8771453 25.4319017,23.9776069 C25.0371606,24.0762922 24.6589465,24.2178819 24.1641364,24.4458997 L23.0054899,25.0032673 C21.4376302,25.7436944 20.9059009,25.8317321 19.964216,25.4436275 C19.3391237,25.1860028 18.9836765,24.813298 18.4635639,24.0180227 L18.2688903,23.7140849 C17.6669841,22.7656437 17.3640608,22.5 16.75,22.5 L16.5912946,22.5037584 C16.1581568,22.5299816 15.8777212,22.7284469 14.009281,24.1150241 C12.2670395,25.4079488 10.9383359,26.0254984 9.24864243,26.0254984 C7.18872869,26.0254984 5.24773367,25.647067 3.43145875,24.8905363 L6.31377803,24.2241784 C7.25769404,24.4250762 8.23567143,24.5254984 9.24864243,24.5254984 C10.5393035,24.5254984 11.609129,24.0282691 13.1153796,22.9104743 L14.275444,22.0545488 C15.5468065,21.1304903 15.8296113,21.016032 16.4798956,21.0019578 L16.4798956,21.0019578 Z M22.7770988,3.22208979 C24.4507223,4.8957133 24.4507566,7.60916079 22.7771889,9.28281324 L21.741655,10.3184475 C22.8936263,11.7199657 22.8521526,13.2053774 21.7811031,14.279556 L18.7800727,17.2805874 L18.7800727,17.2805874 C18.4870374,17.5733384 18.0121637,17.573108 17.7194126,17.2800727 C17.4266616,16.9870374 17.426892,16.5121637 17.7199273,16.2194126 L20.7188969,13.220444 C21.2039571,12.7339668 21.2600021,12.1299983 20.678941,11.3818945 L10.0845437,21.9761011 C9.78635459,22.2743053 9.41036117,22.482705 8.99944703,22.5775313 L2.91864463,23.9807934 C2.37859061,24.1054212 1.89457875,23.6214094 2.0192066,23.0813554 L3.42247794,17.0005129 C3.51729557,16.5896365 3.72566589,16.2136736 4.0238276,15.9154968 L16.7165019,3.22217992 C18.3900415,1.54855555 21.1034349,1.54851059 22.7770988,3.22208979 Z" fill="#252B42"></path>
                        </g>
                    </g>
                </svg>`,
      });
      editor.BlockManager.add("merge_field", {
        id: "merge_field",
        label: "Merge Field",
        category: "Field",
        content:
          '<div data-gjs-type="merge_field" data-gjs-droppable="false">{{SELECT_MERGE_FIELD_FROM_SETTINGS}}</div>',
        attributes: { class: "merge-field" },
        media: `<svg width="26" height="26" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none"/>
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path d="M44,9a7,7,0,1,0-9,6.7V16a6,6,0,0,1-6,6H21a10.3,10.3,0,0,0-6,2V15.7a7,7,0,1,0-4,0V32.3a7,7,0,1,0,4,0V32a6,6,0,0,1,6-6h8A10,10,0,0,0,39,16v-.3A7,7,0,0,0,44,9ZM10,9a3,3,0,0,1,6,0,3,3,0,0,1-6,0Zm6,30a3,3,0,1,1-3-3A2.9,2.9,0,0,1,16,39ZM37,12a2.9,2.9,0,0,1-3-3,3,3,0,0,1,6,0A2.9,2.9,0,0,1,37,12Z" fill="#252B42"/>
                  </g>
                </g>
              </svg>`,
      });

      editor.RichTextEditor.add("custom-vars", {
        icon: `<select>
                      <option value="">- Merge Fields -</option>
                      ${mergeFields.map(
                        (item) =>
                          `<option value=${item.value}>${item.name}</option>`,
                      )}
                    </select>`,
        event: "change",
        result: (rte, action) => rte.insertHTML(action.btn.firstChild.value),
        update: (rte, action) => {
          action.btn.firstChild.value = "";
        },
      });

      panelManager.addButton("options", {
        id: "save",
        className: "fa fa-upload",
        command: "onSave",
        attributes: { title: "Save" },
        // active: false,
      });

      const commands = editor.Commands;
      commands.add("onSave", onSave);

      panelManager.removeButton("devices-c", "set-device-desktop");
      panelManager.removeButton("devices-c", "set-device-tablet");
      panelManager.removeButton("devices-c", "set-device-mobile");

      panelManager.removeButton("options", "sw-visibility");
      panelManager.removeButton("options", "preview");
      panelManager.removeButton("options", "fullscreen");
      panelManager.removeButton("options", "export-template");

      editorRef.current = editor;
      setEditorReady(true);
    };
    initEditor();
    return () => {};
  }, []);

  useEffect(() => {
    if (editorReady) {
      if (id) {
        dispatch(
          getAgreementTemplate(id, setLoading, (res) => {
            editorRef.current.setComponents(res.htmlContent);
            editorRef.current.setStyle(res.cssContent);
            setData({
              title: res.title || "",
              description: res.description || "",
              club: res.club || [],
              isActive: res.isActive,
            });
          }),
        );
      } else {
        editorRef.current.setComponents(initialTemplate.htmlContent);
        editorRef.current.setStyle(initialTemplate.cssContent);
      }
    }
  }, [id, editorReady]);

  const onSave = () => {
    setVisible(true);
  };

  const handleChange = ({ name, value }) => {
    let formErrors = formValidation(name, value, data, ["club"]);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData, ["club"])) {
      const htmlContent = editorRef.current.getHtml();
      const cssContent = editorRef.current.getCss();
      dispatch(
        addOrUpdateAgreementTemplate(
          id,
          { ...data, htmlContent, cssContent },
          setLoading,
          (success, formErrors) => {
            if (success) {
              navigate(-1);
            } else {
              setData((prev) => ({ ...prev, formErrors }));
            }
          },
        ),
      );
    }
  };
  const handleHide = () => {
    setVisible(false);
    if (!id) {
      setData({
        title: "",
        description: "",
        club: [],
        isActive: true,
      });
    }
  };

  return (
    <>
      <CustomDialog
        title="Agreement Template Form"
        visible={visible}
        onHide={handleHide}
      >
        <CustomForm onSubmit={handleSubmit} onCancel={handleHide}>
          <CustomInput
            data={data}
            onChange={handleChange}
            name="title"
            col={12}
            required
          />
          <CustomMultiSelect
            data={data}
            onChange={handleChange}
            name="club"
            col={12}
            optionsType="clubs"
          />
          <CustomTextArea
            data={data}
            onChange={handleChange}
            name="description"
          />
          <CustomCheckbox
            data={data}
            onChange={handleChange}
            name="isActive"
            label="Active"
            col={12}
          />
        </CustomForm>
      </CustomDialog>

      <div className="gpj" ref={editorRef}></div>
    </>
  );
}
