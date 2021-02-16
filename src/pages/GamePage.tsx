import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { SocketContext } from '~/contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import { GameEvent } from '~/events/GameEvent';
import { Pawn } from '~/models/Pawn';

const GamePage: React.FC<RouteComponentProps> = ({ location }) => {
  // const [board, setBoard] = useState<Board | null>(null);
  const socket = useContext(SocketContext) as SocketIOClient.Socket;
  const board = (location?.state as { board: Board }).board;
  const [pawnList, setPawnList] = useState<Pawn[]>([]);
  const [dice, setDice] = useState<number>(-1);
  const [isRollingDice, setRollingDice] = useState<boolean>(false);

  useEffect(() => {
    socket.emit(GameEvent.START_TURN);

    // Receive event to move
    socket.on(GameEvent.MOVE, (diceCount: number) => {
      setDice(diceCount);
      setRollingDice(true);
    });

    socket.on(GameEvent.PAWN_LIST, (pawns: Pawn[]) => {
      console.log(pawns);
      setPawnList(pawns);
    });
  }, [setPawnList]);

  return (
    <div>
      <div>{dice} dots!</div>
      <GameBoard board={board} pawns={pawnList} />
      <button
        className="rounded bg-blue-600 text-white"
        onClick={() => {
          if (isRollingDice) {
            socket.emit(GameEvent.MOVE, dice);
          }
        }}
      >
        roll dice
      </button>
    </div>
  );
};

export default GamePage;
