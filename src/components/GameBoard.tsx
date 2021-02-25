import React, { useContext } from 'react';
import { MonopolyContext } from '~/contexts/MonopolyContext';
import { Board } from '~/models/Board';
import { Pawn } from '~/models/Pawn';
import GameTile from './GameTile';

const GameBoard: React.FC = () => {
  const gameState = useContext(MonopolyContext);
  const pawnInTile = (index: number): Pawn | null => {
    for (const p of gameState.pawnList) {
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
  return (
    <div className="flex p-2">
      <div>{generateBoard(gameState.board)}</div>
      <div>{gameState.dialog}</div>
    </div>
  );
};

export default GameBoard;
