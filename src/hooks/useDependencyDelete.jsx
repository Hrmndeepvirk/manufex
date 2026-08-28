import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import DependencyDeleteDialog from "../components/DependencyDeleteDialog";

export default function useDependencyDelete(deleteAction) {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log({ id, data, visible, error });

  const onDelete = (id) => {
    dispatch(
      deleteAction(id, null, (res) => {
        if (!res.success && res.data) {
          setId(id);
          setData(res.data);
          setVisible(true);
          setError(null);
        }
      }),
    );
  };
  const hideDependencyDialog = () => {
    setId(null);
    setData(null);
    setVisible(false);
    setError(null);
  };
  const onReplace = (replacementId) => {
    dispatch(
      deleteAction(
        id,
        setDeleteLoading,
        (res) => {
          if (res.success) {
            hideDependencyDialog();
          } else {
            setError(res?.message || "An error occurred. Please try again.");
          }
        },
        { replacement: replacementId },
      ),
    );
  };

  const DependencyDialog = useMemo(
    () => (
      <DependencyDeleteDialog
        visible={visible}
        onHide={hideDependencyDialog}
        data={data}
        onConfirm={onReplace}
        loading={deleteLoading}
        error={error}
      />
    ),
    [visible, data, deleteLoading, error],
  );

  return { onDelete, DependencyDialog };
}
