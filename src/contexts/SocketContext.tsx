import React, { useMemo } from 'react';
import io from 'socket.io-client';

export const SocketContext = React.createContext<SocketIOClient.Socket | null>(
  null
);

const SocketContextProvider: React.FC = (props) => {
  const socket = useMemo(() => {
    return io(`${process.env.REACT_APP_API_URL}`);
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
