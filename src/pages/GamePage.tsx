import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Board } from '~/models/Board';
import GameBoard from '~/components/GameBoard';
import MonopolyContextProvider from '~/contexts/MonopolyContext';

const GamePage: React.FC<RouteComponentProps> = ({ location }) => {
  // const [board, setBoard] = useState<Board | null>(null);
  const board = (location?.state as { board: Board }).board;

  return (
    <MonopolyContextProvider board={board}>
      <div className="container mx-auto">
        <div className="flex flex-col min-h-screen justify-around items-center">
          <div style={{ width: `${0.25 * 128}rem` }}>
            <img src="assets/logo-monopoli.png" />
            <div className="flex flex-col items-center">
              <div className="italic text-sm">Sponsored by:</div>
              <div className="flex">
                <img
                  src="assets/credibook.png"
                  className=" object-contain w-10 mx-1"
                  alt=""
                />
                <img
                  src="assets/jooalan.png"
                  className="object-contain w-20 mx-1"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div>
            <GameBoard />
          </div>
        </div>
      </div>
    </MonopolyContextProvider>
  );
};

export default GamePage;
