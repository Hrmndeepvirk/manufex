import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomTable from "../../../../shared/table/CustomTable";
import CustomDialog from "@shared/overlays/CustomDialog";
import PrimaryButton from "../../../../shared/buttons/PrimaryButton";
import UploadDocument from "../../TaskAndAlert/UploadDocument";
import { getDocuments, deleteDocument } from "../../../../store/member/documentActions";
import { customConfirmDialog } from "@shared/overlays/CustomConfirmDialog";

const Documents = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [uploadVisible, setUploadVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const fetchDocuments = () => {
    if (id) {
      dispatch(getDocuments(id, setLoading, (docs) => setData(docs)));
    }
  };

  const handleDelete = (docId) => {
    customConfirmDialog({
      message: "Do you want to delete this document?",
      accept: () => {
        dispatch(
          deleteDocument(docId, setLoading, (success) => {
            if (success) {
              fetchDocuments();
            }
          }),
        );
      },
      reject: () => {},
    });
  };

  const isImage = (url) => /\.(jpg|jpeg|png|webp)$/i.test(url);
  const isPdf = (url) => /\.pdf$/i.test(url);

  const columns = [
    {
      field: "createdAt",
      header: "Date",
      isDate: true,
      sortable: true,
    },
    {
      field: "name",
      header: "Name",
    },
    {
      field: "govtId",
      header: "Govt Id",
    },
    {
      field: "type",
      header: "Type",
      body: (rowData) => {
        const typeMap = { LICENSE: "License", PASSPORT: "Passport", OTHER: "Other" };
        return typeMap[rowData?.type] || rowData?.type || "-";
      },
    },
    {
      field: "file",
      header: "File",
      body: (rowData) => rowData?.file?.original_name || "-",
    },
    {
      field: "employee",
      header: "Uploaded By",
    },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => (
        <div className="flex gap-2">
          {rowData?.file?.url && (
            <i
              className="pi pi-eye cursor-pointer"
              title="View"
              onClick={() => setPreviewFile(rowData.file)}
            />
          )}
          <i
            className="pi pi-trash cursor-pointer"
            style={{ color: "var(--color-danger)" }}
            title="Delete"
            onClick={() => handleDelete(rowData._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <UploadDocument
        visible={uploadVisible}
        onHide={() => {
          fetchDocuments();
          setUploadVisible(false);
        }}
        member={id}
      />

      <CustomDialog
        title="Preview"
        visible={!!previewFile}
        onHide={() => setPreviewFile(null)}
        size="medium"
      >
        {previewFile?.url && isImage(previewFile.url) && (
          <img src={previewFile.url} alt="preview" className="w-full" style={{ maxHeight: "400px", objectFit: "contain" }} />
        )}
        {previewFile?.url && isPdf(previewFile.url) && (
          <iframe
            src={previewFile.url}
            title="pdf-preview"
            width="100%"
            height="400px"
          />
        )}
      </CustomDialog>

      <div className="c-col-12 mb-3 ml-auto pl-auto">
        <PrimaryButton
          label="Upload Document"
          onClick={() => setUploadVisible(true)}
          className="ml-auto mr-0"
        />
      </div>

      <div className="c-col-12">
        <CustomTable data={data} columns={columns} loading={loading} />
      </div>
    </>
  );
};

export default Documents;
