import { useContext, useEffect, useMemo, useState } from 'react';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { Board } from '~/models/Board';
import { Pawn } from '~/models/Pawn';
import { Problem } from '~/models/Problem';
import { Tile } from '~/models/Tile';

export interface IUseMonopoly {
  board: Board;
  pawnList: Pawn[];
  message: string;
  problem: Problem | null;
  dice: number;
  isRolling: boolean;
  isPlaying: boolean;
  isSelectingTile: boolean;
  setRolling: React.Dispatch<React.SetStateAction<boolean>>;
  emitEvent: <T>(eventName: string, body?: T | undefined) => void;
}

export const useMonopoly = (boardInput: Board): IUseMonopoly => {
  const socket = useContext(SocketContext) as SocketIOClient.Socket;
  const board = useMemo(() => {
    return boardInput;
  }, []);
  const [pawnList, setPawnList] = useState<Pawn[]>([]);
  const [dice, setDice] = useState<number>(-1);
  const [isRolling, setRolling] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isSelectingTile, setSelectingTile] = useState<boolean>(false);

  useEffect(() => {
    socket.emit(GameEvent.START_TURN);

    // On invalid turn
    socket.on(GameEvent.INVALID_TURN, (msg: string) => {
      console.log(`Received event ${GameEvent.INVALID_TURN}`);
      setPlaying(false);
      console.log(msg);
    });

    // On receiving pawn list
    socket.on(GameEvent.PAWN_LIST, (pawns: Pawn[]) => {
      // console.log(`Received event ${GameEvent.PAWN_LIST}`);
      setPawnList(pawns);
    });

    // On receiving event to move
    socket.on(GameEvent.MOVE, (diceCount: number) => {
      console.log(`Received event ${GameEvent.MOVE}`);

      // PLayer is allowed to play
      setPlaying(true);
      setDice(diceCount);
      setRolling(true);
    });

    socket.on(GameEvent.START_TILE, () => {
      console.log(`Received event ${GameEvent.START_TILE}`);
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.PRISON_TILE, () => {
      console.log(`Received event ${GameEvent.PRISON_TILE}`);
      emitEvent(GameEvent.PRISON_TILE);
    });

    socket.on(GameEvent.FREE_PARKING_TILE, (tiles: Tile[]) => {
      console.log(`Received event ${GameEvent.FREE_PARKING_TILE}`);
      setSelectingTile(true);
      emitEvent(GameEvent.FREE_PARKING_TILE);
    });

    socket.on(GameEvent.POWER_UP_TILE, () => {
      console.log(`Received event ${GameEvent.POWER_UP_TILE}`);
      emitEvent(GameEvent.POWER_UP_TILE);
    });

    // On receiving event by landing on a property tile
    socket.on(GameEvent.PROPERTY_TILE, () => {
      console.log(`Received event ${GameEvent.PROPERTY_TILE}`);
      emitEvent(GameEvent.PROPERTY_TILE);
    });

    socket.on(GameEvent.GIVE_PROBLEM, () => {
      console.log(`Received event ${GameEvent.GIVE_PROBLEM}`);
      emitEvent(GameEvent.GIVE_PROBLEM);
    });

    socket.on(GameEvent.PROBLEM, (problem: Problem) => {
      console.log(`Received event ${GameEvent.PROBLEM}`);
      setProblem(problem);
      // emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.CORRECT_ANSWER, () => {
      console.log(`Received event ${GameEvent.CORRECT_ANSWER}`);
      setProblem(null);
      emitEvent(GameEvent.CORRECT_ANSWER);
    });

    socket.on(GameEvent.WRONG_ANSWER, () => {
      console.log(`Received event ${GameEvent.WRONG_ANSWER}`);
      setProblem(null);
      emitEvent(GameEvent.WRONG_ANSWER);
    });

    socket.on(GameEvent.POWER_UP_GET_ADD_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_ADD_POINTS}`);
      emitEvent(GameEvent.POWER_UP_GET_ADD_POINTS);
    });

    socket.on(GameEvent.POWER_UP_GET_REDUCE_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_REDUCE_POINTS}`);
      emitEvent(GameEvent.POWER_UP_GET_REDUCE_POINTS);
    });

    socket.on(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER, () => {
      console.log(
        `Received event ${GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER}`
      );
      emitEvent(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER);
    });

    // On receiving event to end turn
    socket.on(GameEvent.END_TURN, (message: string | undefined) => {
      console.log(`Received event ${GameEvent.END_TURN}`);
      if (message) {
        setMessage(message);
      }
      emitEvent(GameEvent.END_TURN);
    });

    // ON receiving event to start turn
    socket.on(GameEvent.START_TURN, () => {
      console.log(`Received event ${GameEvent.START_TURN}`);
      emitEvent(GameEvent.START_TURN);
    });
  }, []);

  // Helper function to emit message to server outside the React hook
  const emitEvent = <T,>(eventName: string, body?: T | undefined) => {
    if (body) {
      socket.emit(eventName, body);
    } else {
      socket.emit(eventName);
    }
    // setMessage(eventName);
  };

  return {
    board,
    pawnList,
    message,
    problem,
    dice,
    isRolling,
    setRolling,
    isPlaying,
    isSelectingTile,
    emitEvent,
  };
};
