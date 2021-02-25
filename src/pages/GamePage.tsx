import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import MonopolyContextProvider from '~/contexts/MonopolyContext';

const GamePage: React.FC<RouteComponentProps> = ({ location }) => {
  // const [board, setBoard] = useState<Board | null>(null);
  const board = (location?.state as { board: Board }).board;

  return (
    <MonopolyContextProvider board={board}>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <GameBoard />
      </div>
    </MonopolyContextProvider>
  );
};

export default GamePage;
