// socket.js
import io from "socket.io-client";
import React, { createContext, useContext, useState } from "react";

const ENDPOINT = "http://localhost:5000";

// Create the context
const SocketContext = createContext();

// Create a provider component
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

// Hook to use the socket easily
export const useSocket = () => {
  return useContext(SocketContext);
};
