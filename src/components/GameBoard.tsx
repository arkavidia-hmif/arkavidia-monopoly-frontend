import React, { useContext } from 'react';
import { MonopolyContext } from '~/contexts/MonopolyContext';
import { Board } from '~/models/Board';
import { Pawn } from '~/models/Pawn';
import GameTile from './GameTile';

const GameBoard: React.FC = () => {
  const gameState = useContext(MonopolyContext);
  const pawnsInTile = (index: number): Pawn[] | null => {
    const result = [];
    for (const p of gameState.pawnList) {
      if (p.position === index) result.push(p);
    }
    if (result.length !== 0) return result;
    return null;
  };

  const generateBoard = (b: Board) => {
    const result = [];
    for (let i = 0; i < b.tiles.length; i++) {
      result.push(
        <GameTile
          pawns={pawnsInTile(i)}
          tile={b.tiles[i]}
          index={i}
          canSelect={gameState.canSelect}
          key={`tile-${i}`}
        />
      );
    }
    return result;
  };

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex">{generateBoard(gameState.board)}</div>
      <div className="p-2">{gameState.dialog}</div>
    </div>
  );
};

export default GameBoard;
