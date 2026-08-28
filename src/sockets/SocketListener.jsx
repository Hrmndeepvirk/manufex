import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "./SocketContext";
import {
  onCreateDB,
  onDeleteDB,
  onUpdateDB,
} from "../store/common/SocketActions";

export default function SocketListener() {
  const dispatch = useDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("db:create", (data) => {
      // console.log("db:create==>", data);
      dispatch(onCreateDB(data));
    });
    socket.on("db:update", (data) => {
      // console.log("db:update==>", data);
      dispatch(onUpdateDB(data));
    });
    socket.on("db:delete", (data) => {
      // console.log("db:delete==>", data);
      dispatch(onDeleteDB(data));
    });
    return () => {
      socket.off("db:create");
      socket.off("db:update");
      socket.off("db:delete");
    };
  }, [socket, dispatch]);

  return null;
}
