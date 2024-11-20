import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// const HOST_URL = `https://webrtc-mulipeer-native.onrender.com/`; // `https://webrtc-video.azurewebsites.net/`
const HOST_URL = `https://marmalade-foregoing-brook.glitch.me/`;

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(HOST_URL, { transports: ["websocket"] }), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
