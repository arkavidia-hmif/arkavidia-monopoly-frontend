import React from 'react';
import { Board } from '~/models/Board';
import { Pawn } from '~/models/Pawn';

interface Props {
  board: Board;
  pawns: Pawn[];
}

const GameBoard: React.FC<Props> = ({ board, pawns }: Props) => {
  return (
    <div className="flex p-2">
      {board.tiles.map((val, index) => {
        return (
          <div className="flex flex-col" key={`tile-${index}`}>
            <div>
              {pawns.map((pawn) => {
                if (pawn.position === index) {
                  return (
                    <div
                      key={`pawn-${pawn.playerId}`}
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: pawn.color }}
                    />
                  );
                } else return null;
              })}
            </div>
            <div
              className="flex flex-col items-center p-4 mx-2 rounded border border-gray-400 shadow h-full"
              style={{
                backgroundColor: val.group ? (val.group as string) : '',
              }}
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
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
