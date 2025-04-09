// socket.js
import io from "socket.io-client";
import React, { createContext, useContext, useState } from "react";

const ENDPOINT = "https://mentor-connect-5.onrender.com";  // <-- update to your Render URL

const SocketContext = createContext();
export { SocketContext };  // <-- ADD THIS LINE!

export const SocketProvider = ({ children, token }) => {
  const [socket] = useState(() =>
    io(ENDPOINT, {
      query: { auth: token },
    })
  );

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
