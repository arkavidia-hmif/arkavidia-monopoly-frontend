import React, {
  useCallback,
  useContext,
  useEffect,
  //   useMemo,
  useState,
} from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Pawn } from '~/models/Pawn';
import { SocketContext } from '~/contexts/SocketContext';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Board } from '~/models/Board';
import { Color } from '../styles/theme';

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
    <div
      className="container mx-auto min-h-screen p-6 flex justify-center items-center flex-col"
      style={{ background: `${Color.backgroundColorThemeLobby}` }}
    >
      <h1
        className="mb-6 mt-8 text-3xl font-bold text-center"
        style={{ color: `${Color.purpleTheme}` }}
      >
        LOBBY
      </h1>
      <h1
        className="mb-6 text-xl text-center"
        style={{ color: `${Color.purpleTheme}` }}
      >
        {players.length > 0
          ? 'Here are Some Players Waiting For Your Challenge!'
          : 'The Room is Still Empty. Tell Your Friends to Join!'}
      </h1>
      <div className="flex flex-col">
        {players.map(({ playerName, color: backgroundColor }, index) => {
          return (
            <div
              key={`player-${index}`}
              style={{ backgroundColor: `${Color.boxTheme}` }}
            >
              <div
                className="flex items-center mb-1 mt-1 p-1 px-4"
                style={{
                  background: `${Color.boxTheme}`,
                  borderRadius: '10px',
                  border: `.02px outset ${Color.lightPurpleTheme}`,
                }}
              >
                <div className="pr-2">
                  <div
                    className="w-3 h-3 rounded-full shadow"
                    style={{ backgroundColor }}
                  />
                </div>
                <div className="font-semibold">{playerName}</div>
              </div>
            </div>
          );
        })}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex justify-center"
        >
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
