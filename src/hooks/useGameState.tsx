import { useContext, useEffect, useReducer } from 'react';
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
    gameState = {
      ...gameState,
      pawnList: action.payload as Pawn[],
    };
  }

  if (action.type === GameEvent.END_TURN) {
    gameState = { ...gameState, dialog: action.payload };
    // return gameState;
  }

  if (action.type === GameEvent.START_TURN) {
    gameState = {
      ...gameState,
      state: GameState.MOVE,
      dialog: action.payload,
    };
    return gameState;
  } else if (action.type === GameEvent.PROPERTY_TILE) {
    gameState = {
      ...gameState,
      state: GameState.PROBLEM,
      dialog: action.payload,
    };
    return gameState;
  } else if (action.type === GameEvent.FREE_PARKING_TILE) {
    gameState = {
      ...gameState,
      state: GameState.PICKING_TILE,
      dialog: action.payload,
    };
    return gameState;
  } else if (action.type === GameEvent.FREE_PARKING_PICK_TILE) {
    gameState = { ...gameState, state: GameState.IDLE, dialog: action.payload };
    return gameState;
  } else if (
    action.type === GameEvent.CORRECT_ANSWER ||
    action.type === GameEvent.WRONG_ANSWER
  ) {
    gameState = { ...gameState, state: GameState.IDLE, dialog: action.payload };
    return gameState;
  }
  return gameState;
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
      // setPawnList(pawns);
      gameStateDispatcher({ type: GameEvent.PAWN_LIST, payload: pawns });
    });

    // On receiving event to move
    socket.on(GameEvent.MOVE, (diceCount: number) => {
      console.log(`Received event ${GameEvent.MOVE}`);

      // Player is allowed to play
      gameStateDispatcher({
        type: GameEvent.MOVE,
        payload: (
          <div>
            Rolling dice get {diceCount}
            <div>
              <button
                onClick={() => {
                  socket.emit(GameEvent.MOVE);
                }}
              >
                ok
              </button>
            </div>
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

    socket.on(GameEvent.FREE_PARKING_TILE, (tiles: Tile[]) => {
      console.log(`Received event ${GameEvent.FREE_PARKING_TILE}`);
      // setSelectingTile(true);
      gameStateDispatcher({
        type: GameEvent.FREE_PARKING_PICK_TILE,
        payload: (
          <div>
            Nih mo pilih yang mana cok
            {tiles.map((index) => {
              return <div key={`asd-${index}`}>asd</div>;
            })}
            <div>
              <button
                onClick={() => {
                  socket.emit(GameEvent.FREE_PARKING_PICK_TILE);
                }}
              >
                ok
              </button>
            </div>
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
        type: GameEvent.FREE_PARKING_PICK_TILE,
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
