import React from 'react';
import { Pawn } from '~/models/Pawn';
import { Tile, TileType } from '~/models/Tile';

interface Props {
  tile: Tile;
  pawn?: Pawn | null;
}

const GameTile: React.FC<Props> = ({ tile, pawn }) => {
  return (
    <div className="flex flex-col">
      <div className="h-4">
        {pawn && (
          <div
            className="w-4 h-4 rounded-full border-2 border-black"
            style={{ backgroundColor: pawn.color }}
          ></div>
        )}
      </div>
      <div className="flex flex-col items-center mx-2 rounded border border-gray-400 shadow w-28 h-36 bg-gray-200">
        <div
          className="font-bold rounded-t w-full py-2 text-center"
          style={{
            backgroundColor: tile.group ? (tile.group as string) : '',
          }}
        >
          {tile.type}
        </div>
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="text-sm">
            <div className="flex font-bold">
              <div>
                {tile.type === TileType.PROPERTY ? 'Pts: ' : ''}
                {tile.price}
              </div>
            </div>
          </div>
          <div className="text-sm">{tile.multiplier}</div>
        </div>
        {/* <div className="text-sm">
          {tile.problem &&
            `
    ${tile.problem?.statement}: ${tile.problem?.answer}`}
        </div> */}
      </div>
    </div>
  );
};

export default GameTile;
