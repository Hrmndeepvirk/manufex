import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLevel,
  getLevels,
} from "@store/settings/scheduleSetup/levelActions";
import ListPageLayout from "@shared/layout/ListPageLayout";
import useDependencyDelete from "../../../../hooks/useDependencyDelete.jsx";

export default function Level() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings.scheduleSetup.levels);

  useEffect(() => {
    dispatch(getLevels());
  }, [dispatch]);

  const { onDelete, DependencyDialog } = useDependencyDelete(deleteLevel);

  let columns = [
    {
      field: "title",
      sortable: true,
    },
    { field: "description" },
    { field: "type", optionsKey: "LevelTypes" },
    { field: "isActive" },
    { field: "createdAt" },
  ];

  const onEdit = (id, navigate) => {
    navigate(`level/${id}`);
  };

  return (
    <>
      <ListPageLayout
        buttonLabel="Add Level"
        linkTo="level"
        searchable={["title"]}
        tableData={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {DependencyDialog}
    </>
  );
}
