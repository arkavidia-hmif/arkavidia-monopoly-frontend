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
  _id: string;
  type: TileType;
  problem?: Problem;
  name?: string;
  price?: number;
  multiplier?: number;
  group?: string | null;
}
