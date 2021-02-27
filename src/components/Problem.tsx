import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { Problem } from '~/models/Problem';

interface Props {
  problem: Problem;
}

type QuestionForm = {
  answer: number;
};

const ProblemCard: React.FC<Props> = ({ problem }: Props) => {
  const socket = useContext(SocketContext);
  const { handleSubmit, register, reset } = useForm();
  const onSubmit = (data: QuestionForm) => {
    socket?.emit(GameEvent.ANSWER_PROBLEM, data.answer);
    reset();
  };

  return (
    <div className="p-4">
      <div className="font-bold text-lg">Pertanyaan!</div>
      <div>
        {problem.statement.split('\\n').map((l, index) => {
          return <div key={`problem-line-${index}`}>{l}</div>;
        })}
      </div>
      <div className="p-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center -mx-2"
        >
          <div className="px-2">
            <input
              name="answer"
              ref={register}
              className="p-1 rounded outline-none border border-gray-500"
            />
          </div>
          <div className="px-2">
            <button
              type="submit"
              className="bg-blue-500 rounded px-4 py-2 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemCard;
