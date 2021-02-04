import { Router } from '@reach/router';
import React from 'react';
import LobbyPage from 'pages/LobbyPage';
import GamePage from 'pages/GamePage';

const App: React.FC = () => {
  return (
    <Router>
      <LobbyPage path="/" />
      <GamePage path="/game" />
    </Router>
  );
};

export default App;
