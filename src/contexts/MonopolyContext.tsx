import { Socket } from 'dgram';
import React, { useContext, useEffect } from 'react';
import { GameEvent } from '~/events/GameEvent';
import { useGameState } from '~/hooks/useGameState';
import { useMonopoly, IUseMonopoly } from '~/hooks/useMonopoly';
import { Board } from '~/models/Board';
import { GameState, GameStateObject } from '~/models/Game';
import { SocketContext } from './SocketContext';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const MonopolyContext = React.createContext<GameStateObject>();

interface Props {
  board: Board;
}

const MonopolyContextProvider: React.FC<Props> = ({ board, children }) => {
  const socket = useContext(SocketContext);
  const gameState = useGameState({
    state: GameState.IDLE,
    pawnList: [],
    board,
    dialog: null,
  });

  useEffect(() => {
    console.log('asd');
    socket?.emit(GameEvent.START_TURN);
  }, []);

  return (
    <MonopolyContext.Provider value={gameState}>
      {children}
    </MonopolyContext.Provider>
  );
};

export default MonopolyContextProvider;
