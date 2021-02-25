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
  const gameState = useContext(MonopolyContext);

  return (
    <MonopolyContextProvider board={board}>
      <div className="flex flex-col min-h-screen justify-center items-center">
        {/* <div>{message}</div>
        <div>
          <Dice count={dice} />
        </div> */}
        <GameBoard board={gameState.board} pawns={gameState.pawnList} />
        {gameState.dialog}
        {/* <button
          disabled={!isRolling}
          className={`rounded ${
            isRolling ? 'bg-blue-600' : 'bg-gray-400'
          } text-white px-2 py-2 outline-none`}
          onClick={() => {
            emitEvent<number>(GameEvent.MOVE, dice);
            console.log('Sent MOVE');
            setRolling(false);
          }}
        >
          Roll dice!
        </button>
        <div>{problem && <ProblemCard problem={problem} />}</div> */}
      </div>
    </MonopolyContextProvider>
  );
};

export default GamePage;
