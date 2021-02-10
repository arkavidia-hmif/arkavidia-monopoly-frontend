import React, { useContext } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';

type FormData = {
  playerName: string;
};

const IndexPage: React.FC<RouteComponentProps> = () => {
  const { register, handleSubmit } = useForm();
  const socket = useContext(SocketContext);
  const onSubmit = ({ playerName }: FormData) => {
    socket?.emit(LobbyEvent.ADD_PLAYER, playerName);
    navigate('/lobby');
  };

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center">
      <form className="flex flex-col">
        <label htmlFor="playerName">Player Name</label>
        <input
          type="text"
          name="playerName"
          ref={register}
          className="rounded border border-gray-400 p-1 mb-4 outline-none"
        />
        <button
          className="text-white bg-blue-600 px-4 py-2 rounded"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IndexPage;
