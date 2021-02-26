import React, { useCallback, useContext, useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Pawn } from '~/models/Pawn';
import { SocketContext } from '~/contexts/SocketContext';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Board } from '~/models/Board';

type BoardForm = {
  boardId: string;
};

const LobbyPage: React.FC<RouteComponentProps> = () => {
  const [players, setPlayers] = useState<Pawn[]>([]);
  const socket = useContext(SocketContext);
  const { register, handleSubmit } = useForm();
  const { data } = useQuery(
    'boards',
    async () =>
      (await axios.get(`${process.env.REACT_APP_API_URL}/api/board`))
        .data as Board[]
  );
  const onSubmit = ({ boardId }: BoardForm) => {
    socket?.emit(LobbyEvent.START, boardId);
  };

  const fetchPlayers = useCallback(() => {
    socket?.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY);
  }, []);

  useEffect(() => {
    fetchPlayers();
    socket?.on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
      setPlayers(pawns);
    });
    socket?.once(LobbyEvent.GAME_STARTED, (board: Board) => {
      navigate('/game', { state: { board } });
    });
  }, []);

  return (
    <div className="container mx-auto min-h-screen p-6 flex justify-center items-center">
      <div className="flex flex-col">
        {players.length > 0 ? (
          players.map(({ playerName, color: backgroundColor }, index) => {
            return (
              <div key={`player-${index}`}>
                <div className="flex w-64 items-center">
                  <div className="p-2">
                    <div
                      className="w-8 h-8 rounded-full shadow"
                      style={{ backgroundColor }}
                    />
                  </div>
                  <div className="font-semibold">{playerName}</div>
                </div>
                <hr />
              </div>
            );
          })
        ) : (
          <div className="italic text-gray-500">
            No players currently in lobby.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <select name="boardId" ref={register}>
            {data &&
              data?.map(({ _id }) => {
                return (
                  <option value={_id} key={`board-option-${_id}`}>
                    {_id}
                  </option>
                );
              })}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default LobbyPage;
