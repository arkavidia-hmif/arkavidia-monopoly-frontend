import React, { useContext } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useForm } from 'react-hook-form';
import { SocketContext } from '../contexts/SocketContext';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Color } from '../styles/theme';
import ArkavidiaLogo from '../img/logo-arkavidia.png';

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
    <div
      className="w-full min-h-screen"
      style={{ background: `${Color.backgroundColorThemeLobby}` }}
    >
      <div className="container mx-auto min-h-screen p-6 flex justify-center items-center flex-col">
        <img src={ArkavidiaLogo} style={{ width: '200px' }} />
        <h1
          className="mt-8 text-3xl font-bold text-center"
          style={{ color: `${Color.purpleTheme}` }}
        >
          Welcome to Arkavidia Monopoly!
        </h1>
        <h1
          className="mt-1 mb-10 text-xl text-center"
          style={{ color: `${Color.purpleTheme}` }}
        >
          Enter your name below to begin!
        </h1>
        <form className="flex flex-col">
          <input
            type="text"
            name="playerName"
            ref={register}
            className="rounded border border-gray-400 p-1 mb-4 outline-none"
            placeholder="Player Name"
            style={{ textAlign: 'center' }}
          />
          <button
            className="text-white bg-blue-600 px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 hover:shadow"
            onClick={handleSubmit(onSubmit)}
            // style={{ backgroundColor: `${Color.pinkTheme}` }}
          >
            PLAY!
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;
