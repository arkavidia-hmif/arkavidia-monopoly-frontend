import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { SocketContext } from '~/contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import { GameEvent } from '~/events/GameEvent';
import { Pawn } from '~/models/Pawn';
import { useMonopoly } from '~/hooks/useMonopoly';

const GamePage: React.FC<RouteComponentProps> = ({ location }) => {
  // const [board, setBoard] = useState<Board | null>(null);
  const board = (location?.state as { board: Board }).board;
  const {
    dice,
    isRolling,
    setRolling,
    pawnList,
    emitEvent,
    message,
  } = useMonopoly();

  return (
    <div>
      <div>Last emitted: {message}</div>
      <div>{dice} dots!</div>
      <GameBoard board={board} pawns={pawnList} />
      <button
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
        roll dice
      </button>
    </div>
  );
};

export default GamePage;
