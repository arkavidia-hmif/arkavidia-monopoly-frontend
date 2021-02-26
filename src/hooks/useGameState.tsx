import { useContext, useEffect, useReducer } from 'react';
import Dice from '~/components/Dice';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { GameState, GameStateObject } from '~/models/Game';
import { Pawn } from '~/models/Pawn';
import { Problem } from '~/models/Problem';
import { Tile } from '~/models/Tile';

export type GameStateAction =
  | {
      type:
        | typeof GameEvent.MOVE
        | typeof GameEvent.PROPERTY_TILE
        | typeof GameEvent.FREE_PARKING_TILE
        | typeof GameEvent.FREE_PARKING_PICK_TILE
        | typeof GameEvent.PROBLEM
        | typeof GameEvent.CORRECT_ANSWER
        | typeof GameEvent.WRONG_ANSWER
        | typeof GameEvent.END_TURN;
      payload: React.ReactNode;
    }
  | { type: typeof GameEvent.PAWN_LIST; payload: Pawn[] };

export const gameStateReducer = (
  gameState: GameStateObject,
  action: GameStateAction
): GameStateObject => {
  if (action.type === GameEvent.PAWN_LIST) {
    return {
      ...gameState,
      pawnList: action.payload as Pawn[],
    };
  } else if (action.type === GameEvent.END_TURN) {
    return { ...gameState, dialog: action.payload, canSelect: false };
  } else if (action.type === GameEvent.MOVE) {
    return {
      ...gameState,
      state: GameState.MOVE,
      dialog: action.payload,
    };
  } else if (action.type === GameEvent.PROBLEM) {
    return {
      ...gameState,
      state: GameState.PROBLEM,
      dialog: action.payload,
    };
  } else if (action.type === GameEvent.FREE_PARKING_TILE) {
    return {
      ...gameState,
      state: GameState.PICKING_TILE,
      dialog: action.payload,
    };
  } else if (action.type === GameEvent.FREE_PARKING_PICK_TILE) {
    return {
      ...gameState,
      state: GameState.IDLE,
      dialog: action.payload,
      canSelect: true,
    };
  } else if (
    action.type === GameEvent.CORRECT_ANSWER ||
    action.type === GameEvent.WRONG_ANSWER
  ) {
    return {
      ...gameState,
      state: GameState.IDLE,
      dialog: action.payload,
    };
  }
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
      console.log(pawns);
      gameStateDispatcher({ type: GameEvent.PAWN_LIST, payload: pawns });
    });

    // On receiving event to move
    socket.on(GameEvent.MOVE, (diceCount: number) => {
      console.log(`Received event ${GameEvent.MOVE}, ${diceCount}`);

      // Player is allowed to play
      gameStateDispatcher({
        type: GameEvent.MOVE,
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
      socket.emit(GameEvent.PRISON_TILE);
    });

    socket.on(GameEvent.FREE_PARKING_TILE, () => {
      socket.emit(GameEvent.FREE_PARKING_TILE);
    });

    socket.on(GameEvent.FREE_PARKING_PICK_TILE, (tiles: Tile[]) => {
      console.log(`Received event ${GameEvent.FREE_PARKING_PICK_TILE}`);
      console.log(tiles);
      gameStateDispatcher({
        type: GameEvent.FREE_PARKING_PICK_TILE,
        payload: (
          <div className="flex flex-col items-center rounded border border-gray-400 p-4">
            <div className="font-bold">Choose wisely.</div>
          </div>
        ),
      });
      // socket.emit(GameEvent.FREE_PARKING_TILE);
    });

    socket.on(GameEvent.POWER_UP_TILE, () => {
      console.log(`Received event ${GameEvent.POWER_UP_TILE}`);
      socket.emit(GameEvent.POWER_UP_TILE);
    });

    // On receiving event by landing on a property tile
    socket.on(GameEvent.PROPERTY_TILE, () => {
      console.log(`Received event ${GameEvent.PROPERTY_TILE}`);
      socket.emit(GameEvent.PROPERTY_TILE);
    });

    socket.on(GameEvent.GIVE_PROBLEM, () => {
      console.log(`Received event ${GameEvent.GIVE_PROBLEM}`);
      socket.emit(GameEvent.GIVE_PROBLEM);
    });

    socket.on(GameEvent.PROBLEM, (problem: Problem) => {
      console.log(`Received event ${GameEvent.PROBLEM}`);
      // setProblem(problem);
      gameStateDispatcher({
        type: GameEvent.PROBLEM,
        payload: (
          <div>
            nih masalah
            <div>{problem.statement}</div>
            <div>
              <button
                onClick={() => {
                  socket.emit(GameEvent.ANSWER_PROBLEM, problem.answer);
                }}
              >
                answer hehe
              </button>
            </div>
          </div>
        ),
      });
    });

    socket.on(GameEvent.CORRECT_ANSWER, () => {
      console.log(`Received event ${GameEvent.CORRECT_ANSWER}`);
      gameStateDispatcher({
        type: GameEvent.CORRECT_ANSWER,
        payload: null,
      });
      socket.emit(GameEvent.CORRECT_ANSWER);
    });

    socket.on(GameEvent.WRONG_ANSWER, () => {
      console.log(`Received event ${GameEvent.WRONG_ANSWER}`);
      gameStateDispatcher({
        type: GameEvent.WRONG_ANSWER,
        payload: null,
      });
      socket.emit(GameEvent.WRONG_ANSWER);
    });

    socket.on(GameEvent.POWER_UP_GET_ADD_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_ADD_POINTS}`);
      socket.emit(GameEvent.POWER_UP_GET_ADD_POINTS);
    });

    socket.on(GameEvent.POWER_UP_GET_REDUCE_POINTS, () => {
      console.log(`Received event ${GameEvent.POWER_UP_GET_REDUCE_POINTS}`);
      socket.emit(GameEvent.POWER_UP_GET_REDUCE_POINTS);
    });

    socket.on(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER, () => {
      console.log(
        `Received event ${GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER}`
      );
      socket.emit(GameEvent.POWER_UP_GET_DISABLE_MULTIPLIER);
    });

    // On receiving event to end turn
    socket.on(GameEvent.END_TURN, (message: string | undefined) => {
      console.log(`Received event ${GameEvent.END_TURN}`);
      gameStateDispatcher({
        type: GameEvent.END_TURN,
        payload: <div>{message || 'turn finish'}</div>,
      });
      socket.emit(GameEvent.END_TURN);
    });

    // ON receiving event to start turn
    socket.on(GameEvent.START_TURN, () => {
      console.log(`Received event ${GameEvent.START_TURN}`);
      socket.emit(GameEvent.START_TURN);
    });
  }, []);

  return gameState;
};
