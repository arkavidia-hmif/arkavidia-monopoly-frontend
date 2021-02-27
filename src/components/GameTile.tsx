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
  owner: Pawn | null;
}

const getTileContents = (tile: Tile, owner: Pawn | null) => {
  if (tile.type === TileType.POWER_UP) {
    return (
      <div className="p-2">
        <img src="/assets/powerup.png" />
      </div>
    );
  } else if (tile.type === TileType.PROPERTY) {
    return (
      <>
        <div className="font-bold">Pts: {tile.price}</div>
        <div className="">x{tile.multiplier}</div>
        <div className="flex items-center text-xs">
          <div className="pr-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: owner ? owner.color : '',
              }}
            />
          </div>
          <div className="italic">{owner && owner.playerName}</div>
        </div>
      </>
    );
  } else if (tile.type === TileType.START) {
    return (
      <div className="">
        <img src="/assets/start.png" />
      </div>
    );
  } else if (tile.type === TileType.JAIL) {
    return (
      <div className="">
        <img src="/assets/jail.png" />
      </div>
    );
  } else if (tile.type === TileType.PARKING) {
    return (
      <div className="">
        <img src="/assets/freeparking.png" />
      </div>
    );
  } else {
    return null;
  }
};

const GameTile: React.FC<Props> = ({
  tile,
  pawns,
  canSelect,
  index,
  owner,
}) => {
  const socket = useContext(SocketContext);
  return (
    <div className="flex flex-col justify-end items-center">
      <div className="flex p-2">
        {pawns &&
          pawns.map((pawn, index) => {
            return (
              <div className="flex flex-col items-center" key={`pawn-${index}`}>
                <div className="text-sm font-bold">{pawn.playerName}</div>
                <div className="text-sm italic">{pawn.totalPoints}</div>
                <div
                  className="w-4 h-4 rounded-full border-2 border-black mx-0.5"
                  style={{ backgroundColor: pawn.color }}
                />
              </div>
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
          {tile.type === TileType.PROPERTY ? tile.name : ''}
          {/* {getTileTitle(tile)} */}
        </div>
        <div className="flex flex-col w-full h-full items-center justify-center p-2">
          {getTileContents(tile, owner)}
        </div>
      </div>
      <div className="w-full p-2">
        {canSelect && (
          <button
            className="bg-blue-600 rounded text-white px-2 py-1 w-full"
            onClick={() => {
              socket?.emit(GameEvent.FREE_PARKING_PICK_TILE, index);
            }}
          >
            Move
          </button>
        )}
      </div>
    </div>
  );
};

export default GameTile;
