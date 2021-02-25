import React from 'react';
import { Board } from '~/models/Board';
import { Pawn } from '~/models/Pawn';
import GameTile from './GameTile';

interface Props {
  board: Board;
  pawns: Pawn[];
}

const GameBoard: React.FC<Props> = ({ board, pawns }: Props) => {
  const pawnInTile = (index: number): Pawn | null => {
    for (const p of pawns) {
      if (p.position === index) return p;
    }
    return null;
  };

  const generateBoard = (b: Board) => {
    const result = [];
    for (let i = 0; i < b.tiles.length; i++) {
      result.push(
        <GameTile pawn={pawnInTile(i)} tile={b.tiles[i]} key={`tile-${i}`} />
      );
    }
    return result;
  };
  return <div className="flex p-2">{generateBoard(board)}</div>;
};

export default GameBoard;
