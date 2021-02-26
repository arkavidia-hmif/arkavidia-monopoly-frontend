import { Tile } from './Tile';

export interface Pawn {
  playerId: string;
  playerName: string;
  position: number;
  color: string;
  totalPoints: number;
  points: number;
  property: Tile[];
  prisonImmunity: 0;
  isPrisoner: boolean;
}
