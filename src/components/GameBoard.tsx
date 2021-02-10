import React from 'react';
import { Board } from '~/models/Board';

interface Props {
  board: Board;
}

const GameBoard: React.FC<Props> = ({ board }: Props) => {
  return (
    <div className="flex p-2">
      {board.tiles.map((val, index) => {
        return (
          <div
            className="flex flex-col items-center p-4 mx-2 rounded border border-gray-400 shadow"
            style={{ backgroundColor: val.group ? (val.group as string) : '' }}
            key={`tile-${index}`}
          >
            <div className="font-bold">{val.type}</div>
            <div className="text-sm">
              {val.problem &&
                `
              ${val.problem?.statement}: ${val.problem?.answer}`}
            </div>
            <div className="text-sm">{val.price}</div>
            <div className="text-sm">{val.multiplier}</div>
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
