import React, { useContext, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { SocketContext } from '~/contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import { GameEvent } from '~/events/GameEvent';
import { Pawn } from '~/models/Pawn';
import { useMonopoly } from '~/hooks/useMonopoly';
import { useForm } from 'react-hook-form';

type QuestionForm = {
  answer: number;
};

const GamePage: React.FC<RouteComponentProps> = ({ location }) => {
  // const [board, setBoard] = useState<Board | null>(null);
  const board = (location?.state as { board: Board }).board;
  const { handleSubmit, register, reset } = useForm();
  const {
    dice,
    isRolling,
    setRolling,
    pawnList,
    emitEvent,
    message,
    problem,
  } = useMonopoly();

  const onSubmit = (data: QuestionForm) => {
    emitEvent<number>(GameEvent.ANSWER_PROBLEM, data.answer);
    reset();
  };

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
        Roll dice!
      </button>
      <div>
        {problem && (
          <div>
            <div>{problem.statement}</div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input name="answer" ref={register} />
                <button
                  type="submit"
                  className="bg-blue-400 rounded px-4 py-2 text-white"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
