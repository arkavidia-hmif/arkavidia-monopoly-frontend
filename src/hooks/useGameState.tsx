import { useContext, useEffect, useReducer } from 'react';
import Dice from '~/components/Dice';
import ProblemCard from '~/components/Problem';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { GameState, GameStateObject } from '~/models/Game';
import { Pawn } from '~/models/Pawn';
import { Problem } from '~/models/Problem';
import { Tile } from '~/models/Tile';

// export type GameStateAction =
//   | {
//       type:
//         | typeof GameEvent.MOVE
//         | typeof GameEvent.PROPERTY_TILE
//         | typeof GameEvent.FREE_PARKING_TILE
//         | typeof GameEvent.POWER_UP_GET_ADD_POINTS
//         | typeof GameEvent.FREE_PARKING_PICK_TILE
//         | typeof GameEvent.PROBLEM
//         | typeof GameEvent.CORRECT_ANSWER
//         | typeof GameEvent.WRONG_ANSWER
//         | typeof GameEvent.START_TURN
//         | typeof GameEvent.END_TURN
//         | typeof GameEvent.END_GAME;
//       payload: React.ReactNode;
//     }
//   | { type: typeof GameEvent.PAWN_LIST; payload: Pawn[] };

export type GameStateAction =
  | { type: 'setDialog'; payload: React.ReactNode }
  | { type: 'setSelect'; payload: boolean }
  | { type: 'setPawnList'; payload: Pawn[] };

export const gameStateReducer = (
  gameState: GameStateObject,
  action: GameStateAction
): GameStateObject => {
  if (action.type === 'setDialog') {
    return { ...gameState, dialog: action.payload };
  } else if (action.type === 'setSelect') {
    return { ...gameState, canSelect: action.payload };
  } else if (action.type === 'setPawnList') {
    return { ...gameState, pawnList: action.payload };
  }

  // if (action.type === GameEvent.PAWN_LIST) {
  //   console.log(action.payload);
  //   return {
  //     ...gameState,
  //     pawnList: action.payload as Pawn[],
  //   };
  // } else if (
  //   action.type === GameEvent.END_TURN ||
  //   action.type === GameEvent.END_GAME
  // ) {
  //   return { ...gameState, dialog: action.payload, canSelect: false };
  // } else if (action.type === GameEvent.START_TURN) {
  //   return { ...gameState, dialog: null, canSelect: false };
  // } else if (action.type === GameEvent.MOVE) {
  //   return {
  //     ...gameState,
  //     state: GameState.MOVE,
  //     dialog: action.payload,
  //     canSelect: false,
  //   };
  // } else if (action.type === GameEvent.PROBLEM) {
  //   return {
  //     ...gameState,
  //     state: GameState.PROBLEM,
  //     dialog: action.payload,
  //     canSelect: false,
  //   };
  // } else if (action.type === GameEvent.FREE_PARKING_TILE) {
  //   return {
  //     ...gameState,
  //     state: GameState.PICKING_TILE,
  //     dialog: action.payload,
  //     canSelect: false,
  //   };
  // } else if (action.type === GameEvent.FREE_PARKING_PICK_TILE) {
  //   return {
  //     ...gameState,
  //     state: GameState.IDLE,
  //     dialog: action.payload,
  //     canSelect: true,
  //   };
  // } else if (
  //   action.type === GameEvent.CORRECT_ANSWER ||
  //   action.type === GameEvent.WRONG_ANSWER
  // ) {
  //   return {
  //     ...gameState,
  //     state: GameState.IDLE,
  //     dialog: action.payload,
  //     canSelect: false,
  //   };
  // }

  return { ...gameState };
};

export const useGameState = (
  initialState: GameStateObject
): GameStateObject => {
  const socket = useContext(SocketContext) as SocketIOClient.Socket;
  const [gameState, gameStateDispatcher] = useReducer(
    gameStateReducer,
    initialState
  );

  // Init all listeners OwO
  useEffect(() => {
    // On invalid turn
    socket.on(GameEvent.INVALID_TURN, (msg: string) => {
      console.log(`Received event ${GameEvent.INVALID_TURN}`);
      console.log(msg);
    });

    // On receiving pawn list
    socket.on(GameEvent.PAWN_LIST, (pawns: Pawn[]) => {
      console.log(`Received event ${GameEvent.PAWN_LIST}`);
      gameStateDispatcher({ type: 'setPawnList', payload: pawns });
    });

    // On receiving event to move
    socket.on(GameEvent.MOVE, (diceCount: number) => {
      console.log(`Received event ${GameEvent.MOVE}, ${diceCount}`);

      // Player is allowed to play
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="flex">
              {diceCount < 6 ? (
                <div className="p-1">
                  <Dice count={diceCount} />
                </div>
              ) : (
                <>
                  <div className="p-1">
                    <Dice count={6} />
                  </div>
                  <div className="p-1">
                    <Dice count={diceCount - 6} />
                  </div>
                </>
              )}
            </div>
            <div className="font-semibold">You rolled {diceCount}!</div>
            <button
              className="bg-blue-600 rounded text-white px-4 py-2"
              onClick={() => {
                socket.emit(GameEvent.MOVE, diceCount);
              }}
            >
              Move pawn!
            </button>
          </div>
        ),
      });
    });

    socket.on(GameEvent.START_TILE, () => {
      console.log(`Received event ${GameEvent.START_TILE}`);
      socket.emit(GameEvent.END_TURN);
    });

    socket.on(GameEvent.PRISON_TILE, () => {
      console.log(`Received event ${GameEvent.PRISON_TILE}`);
      gameStateDispatcher({
        type: 'setSelect',
        payload: false,
      });
      socket.emit(GameEvent.PRISON_TILE);
    });

    socket.on(GameEvent.FREE_PARKING_TILE, () => {
      socket.emit(GameEvent.FREE_PARKING_TILE);
    });

    socket.on(GameEvent.FREE_PARKING_PICK_TILE, (tiles: Tile[]) => {
      console.log(`Received event ${GameEvent.FREE_PARKING_PICK_TILE}`);
      console.log(tiles);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="font-bold">Choose wisely.</div>
          </div>
        ),
      });
      // socket.emit(GameEvent.FREE_PARKING_TILE);
      gameStateDispatcher({
        type: 'setSelect',
        payload: true,
      });
    });

    socket.on(GameEvent.POWER_UP_TILE, () => {
      console.log(`Received event ${GameEvent.POWER_UP_TILE}`);
      gameStateDispatcher({
        type: 'setSelect',
        payload: false,
      });
      socket.emit(GameEvent.POWER_UP_TILE);
    });

    // On receiving event by landing on a property tile
    socket.on(GameEvent.PROPERTY_TILE, () => {
      console.log(`Received event ${GameEvent.PROPERTY_TILE}`);
      gameStateDispatcher({
        type: 'setSelect',
        payload: false,
      });
      socket.emit(GameEvent.PROPERTY_TILE);
    });

    socket.on(GameEvent.GIVE_PROBLEM, () => {
      console.log(`Received event ${GameEvent.GIVE_PROBLEM}`);
      gameStateDispatcher({
        type: 'setSelect',
        payload: false,
      });
      socket.emit(GameEvent.GIVE_PROBLEM);
    });

    socket.on(GameEvent.PROBLEM, (problem: Problem) => {
      console.log(`Received event ${GameEvent.PROBLEM}`);
      // setProblem(problem);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <ProblemCard problem={problem} />
          </div>
        ),
      });
    });

    socket.on(GameEvent.CORRECT_ANSWER, () => {
      console.log(`Received event ${GameEvent.CORRECT_ANSWER}`);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">Correct! You got this property!</div>
            <div>
              <button
                className="bg-blue-600 rounded text-white px-4 py-2"
                onClick={() => {
                  socket.emit(GameEvent.CORRECT_ANSWER);
                }}
              >
                OK
              </button>
            </div>
          </div>
        ),
      });
    });

    socket.on(GameEvent.WRONG_ANSWER, () => {
      console.log(`Received event ${GameEvent.WRONG_ANSWER}`);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">Wrong answer, better luck next time!</div>
            <div>
              <button
                className="bg-blue-600 rounded text-white px-4 py-2"
                onClick={() => {
                  socket.emit(GameEvent.WRONG_ANSWER);
                }}
              >
                OK
              </button>
            </div>
          </div>
        ),
      });
    });

    socket.on(GameEvent.POWER_UP_GET_ADD_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_ADD_POINTS}`);
      const points = Math.floor(Math.random() * 100) + 50;
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">You got {points} points!</div>
            <div>
              <button
                className="bg-blue-600 rounded text-white px-4 py-2"
                onClick={() => {
                  socket.emit(GameEvent.POWER_UP_GET_ADD_POINTS, points);
                }}
              >
                OK
              </button>
            </div>
          </div>
        ),
      });
      // socket.emit(GameEvent.POWER_UP_GET_ADD_POINTS);
    });

    socket.on(GameEvent.POWER_UP_GET_REDUCE_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_REDUCE_POINTS}`);
      socket.emit(GameEvent.POWER_UP_GET_REDUCE_POINTS);
    });

    socket.on(GameEvent.POWER_UP_PICK_PLAYER, (pawnList: Pawn[]) => {
      console.log(`Received event ${GameEvent.POWER_UP_PICK_PLAYER}`);
      const points = Math.floor(Math.random() * 100) + 50;
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">
              Select player to be reduced by {points} points:
            </div>
            {pawnList.map((pawn, index) => {
              return (
                <div className="flex items-center p-1" key={`pawn-${index}`}>
                  <div
                    style={{ backgroundColor: pawn.color }}
                    className="w-4 h-4 rounded-full m-1"
                  />
                  <div>{pawn.playerName}</div>
                  <button
                    className="bg-blue-600 rounded text-white px-2 py-1"
                    onClick={() => {
                      socket.emit(GameEvent.POWER_UP_PICK_PLAYER, {
                        playerIndex: index,
                        points: points,
                      });
                    }}
                  >
                    OK
                  </button>
                </div>
              );
            })}
          </div>
        ),
      });
    });

    // socket.on(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER, () => {
    //   console.log(
    //     `Received event ${GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER}`
    //   );
    //   socket.emit(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER);
    // });

    socket.on(GameEvent.POWER_UP_GET_PRISON, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_PRISON}`);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">You got &quot;Prison Immunity&quot;!</div>
            <div>
              <button
                className="bg-blue-600 rounded text-white px-4 py-2"
                onClick={() => {
                  socket.emit(GameEvent.POWER_UP_GET_PRISON);
                }}
              >
                OK
              </button>
            </div>
          </div>
        ),
      });
    });

    // On receiving event to end turn
    socket.on(GameEvent.END_TURN, (message: string | undefined) => {
      console.log(`Received event ${GameEvent.END_TURN}`);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">{message || 'Your turn is up!'}</div>
            <div>
              <button
                className="bg-blue-600 rounded text-white px-4 py-2"
                onClick={() => {
                  socket.emit(GameEvent.END_TURN);
                }}
              >
                OK
              </button>
            </div>
          </div>
        ),
      });
    });

    // On receiving event to end game
    socket.on(GameEvent.END_GAME, () => {
      console.log(`Received event ${GameEvent.END_GAME}`);
      gameStateDispatcher({
        type: 'setDialog',
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="mb-4">Game finished!</div>
          </div>
        ),
      });
      gameStateDispatcher({
        type: 'setSelect',
        payload: false,
      });
    });

    // ON receiving event to start turn
    socket.on(GameEvent.START_TURN, () => {
      console.log(`Received event ${GameEvent.START_TURN}`);
      gameStateDispatcher({ type: 'setDialog', payload: null });
      socket.emit(GameEvent.START_TURN);
    });
  }, []);

  return gameState;
};
