export interface Pawn {
  playerId: string;
  playerName: string;
  position: number;
  color: string;
  points: number;
  property: string[];
  prisonImmunity: 0;
  isPrisoner: boolean;
}
