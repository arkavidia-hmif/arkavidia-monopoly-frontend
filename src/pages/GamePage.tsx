import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import { GameEvent } from '~/events/GameEvent';
import { useMonopoly } from '~/hooks/useMonopoly';
import Dice from '~/components/Dice';
import MonopolyContextProvider, {
  MonopolyContext,
} from '~/contexts/MonopolyContext';
import ProblemCard from '~/components/Problem';

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
