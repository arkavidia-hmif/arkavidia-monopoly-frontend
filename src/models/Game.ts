import { Board } from './Board';
import { Pawn } from './Pawn';

export enum GameState {
  IDLE,
  MOVE,
  PICKING_TILE,
  PROBLEM,
}

export interface GameStateObject {
  state: GameState;
  pawnList: Pawn[];
  board: Board;
  dialog: React.ReactNode;
  canSelect: boolean;
}
