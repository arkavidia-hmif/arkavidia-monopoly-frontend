import { Problem } from './Problem';

export enum TileType {
  START = 'START',
  JAIL = 'JAIL',
  PARKING = 'PARKING',
  PROPERTY = 'PROPERTY',
  POWER_UP = 'POWER_UP',
  NONE = 'NONE',
}

export interface Tile {
  type: TileType;
  problem?: Problem;
  price?: number;
  multiplier?: number;
  group?: string | null;
}
