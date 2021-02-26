// import React, { useContext } from 'react';
// import { useForm } from 'react-hook-form';
// import { MonopolyContext } from '~/contexts/MonopolyContext';
// import { GameEvent } from '~/events/GameEvent';
import React from 'react';
import { Problem } from '~/models/Problem';

interface Props {
  problem: Problem;
}

// type QuestionForm = {
//   answer: number;
// };

const ProblemCard: React.FC<Props> = ({ problem }: Props) => {
  // const { emitEvent } = useContext(MonopolyContext);
  // const { handleSubmit, register, reset } = useForm();
  // const onSubmit = (data: QuestionForm) => {
  //   emitEvent && emitEvent<number>(GameEvent.ANSWER_PROBLEM, data.answer);
  //   reset();
  // };

  return (
    <div className="p-4">
      <div className="font-bold text-lg">Pertanyaan!</div>
      <div>{problem.statement}</div>
      <div>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <input name="answer" ref={register} />
          <button
            type="submit"
            className="bg-blue-400 rounded px-4 py-2 text-white"
          >
            Submit
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default ProblemCard;
