import { Router } from '@reach/router';
import React from 'react';
import LobbyPage from '~/pages/LobbyPage';
import GamePage from '~/pages/GamePage';
import SocketContextProvider from '~/contexts/SocketContext';
import IndexPage from '~/pages/IndexPage';

const App: React.FC = () => {
  return (
    <SocketContextProvider>
      <Router>
        <IndexPage path="/" />
        <LobbyPage path="/lobby" />
        <GamePage path="/game" />
      </Router>
    </SocketContextProvider>
  );
};

export default App;
