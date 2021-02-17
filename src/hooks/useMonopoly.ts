import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { Pawn } from '~/models/Pawn';
import { Problem } from '~/models/Problem';

export const useMonopoly = () => {
  // const [board, setBoard] = useState<Board | null>(null);
  const socket = useContext(SocketContext) as SocketIOClient.Socket;
  const [pawnList, setPawnList] = useState<Pawn[]>([]);
  const [dice, setDice] = useState<number>(-1);
  const [isRolling, setRolling] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    socket.emit(GameEvent.START_TURN);

    // On invalid turn
    socket.on(GameEvent.INVALID_TURN, (msg: string) => {
      console.log(`Received event ${GameEvent.INVALID_TURN}`);
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
      setDice(diceCount);
      setRolling(true);
    });

    socket.on(GameEvent.START_TILE, () => {
      console.log(`Received event ${GameEvent.START_TILE}`);
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.PRISON_TILE, () => {
      console.log(`Received event ${GameEvent.PRISON_TILE}`);
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.FREE_PARKING_TILE, () => {
      console.log(`Received event ${GameEvent.FREE_PARKING_TILE}`);
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.POWER_UP_TILE, () => {
      console.log(`Received event ${GameEvent.POWER_UP_TILE}`);
      emitEvent(GameEvent.END_TURN);
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
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.POWER_UP_GET_REDUCE_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_REDUCE_POINTS}`);
      emitEvent(GameEvent.END_TURN);
    });

    socket.on(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER, () => {
      console.log(
        `Received event ${GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER}`
      );
      emitEvent(GameEvent.END_TURN);
    });

    // On receiving event to end turn
    socket.on(GameEvent.END_TURN, () => {
      console.log(`Received event ${GameEvent.END_TURN}`);
      emitEvent(GameEvent.END_TURN);
    });

    // ON receiving event to start turn
    socket.on(GameEvent.START_TURN, () => {
      console.log(`Received event ${GameEvent.START_TURN}`);
      emitEvent(GameEvent.START_TURN);
    });
  }, []);

  // Helper function to emit message to server outside the React hook
  const emitEvent = <T>(eventName: string, body?: T | undefined) => {
    if (body) {
      socket.emit(eventName, body);
    } else {
      socket.emit(eventName);
    }
    // setMessage(eventName);
  };

  return {
    pawnList,
    message,
    problem,
    dice,
    isRolling,
    setRolling,
    emitEvent,
  };
};
