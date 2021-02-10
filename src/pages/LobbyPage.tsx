import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RouteComponentProps } from '@reach/router';
import { LobbyEvent } from '~/events/LobbyEvent';
import { Pawn } from '~/models/Pawn';
import { SocketContext } from '~/contexts/SocketContext';

const LobbyPage: React.FC<RouteComponentProps> = () => {
  const [players, setPlayers] = useState<Pawn[]>([]);
  const socket = useContext(SocketContext);

  const fetchPlayers = useCallback(() => {
    socket?.emit(LobbyEvent.GET_PLAYERS_IN_LOBBY);
  }, []);

  useEffect(() => {
    fetchPlayers();
    socket?.on(LobbyEvent.GET_PLAYERS_IN_LOBBY, (pawns: Pawn[]) => {
      console.log('received');
      setPlayers(pawns);
    });
  }, []);

  return (
    <div className="container mx-auto min-h-screen p-6 flex justify-center items-center">
      <div className="flex flex-col">
        {players.map(({ playerName, color: backgroundColor }, index) => {
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
        })}
        <button>Start Game</button>
      </div>
    </div>
  );
};

export default LobbyPage;
