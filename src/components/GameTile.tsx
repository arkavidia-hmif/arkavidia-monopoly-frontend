import React, { useContext } from 'react';
import { SocketContext } from '~/contexts/SocketContext';
import { GameEvent } from '~/events/GameEvent';
import { Pawn } from '~/models/Pawn';
import { Tile, TileType } from '~/models/Tile';

interface Props {
  tile: Tile;
  pawns?: Pawn[] | null;
  canSelect: boolean;
  index: number;
}

const GameTile: React.FC<Props> = ({ tile, pawns, canSelect, index }) => {
  const socket = useContext(SocketContext);
  return (
    <div className="flex flex-col justify-end">
      <div className="flex p-2">
        {pawns &&
          pawns.map((pawn, index) => {
            return (
              <div
                className="w-4 h-4 rounded-full border-2 border-black mx-0.5"
                style={{ backgroundColor: pawn.color }}
                key={`pawn-${index}`}
              />
            );
          })}
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
        {canSelect && (
          <button
            className="bg-blue-600 rounded text-white px-4 py-2"
            onClick={() => {
              socket?.emit(GameEvent.FREE_PARKING_PICK_TILE, index);
            }}
          >
            Move
          </button>
        )}
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
