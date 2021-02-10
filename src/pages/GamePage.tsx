import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { SocketContext } from '~/contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';

const GamePage: React.FC<RouteComponentProps> = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.once(LobbyEvent.GAME_STARTED, (board: Board) => {
      setBoard(board);
    });
  }, [setBoard]);

  return (
    <div>
      <GameBoard board={board as Board} />
    </div>
  );
};

export default GamePage;
