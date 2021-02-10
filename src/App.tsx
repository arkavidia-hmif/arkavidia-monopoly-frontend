import { Router } from '@reach/router';
import React from 'react';
import LobbyPage from '~/pages/LobbyPage';
import GamePage from '~/pages/GamePage';
import SocketContextProvider from '~/contexts/SocketContext';
import IndexPage from '~/pages/IndexPage';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider>
        <Router>
          <IndexPage path="/" />
          <LobbyPage path="/lobby" />
          <GamePage path="/game" />
        </Router>
      </SocketContextProvider>
    </QueryClientProvider>
  );
};

export default App;
