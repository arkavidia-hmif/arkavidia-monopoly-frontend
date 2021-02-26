import React from 'react';

interface Props {
  count: number;
}

const dotsMapping: number[][][] = [
  [[1]],
  [
    [0, 1],
    [1, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  [
    [1, 1],
    [1, 1],
    [1, 1],
  ],
];

const Dots: React.FC<Props> = ({ count }: Props) => {
  console.log(dotsMapping);
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {dotsMapping[count - 1].map((row, i) => {
        return (
          <div className="flex" key={`row-${i}`}>
            {row.map((val, j) => {
              return val ? (
                <div
                  className="w-4 h-4 bg-black rounded-full m-0.5"
                  key={`dot-${i}-${j}`}
                />
              ) : (
                <div
                  className="w-4 h-4 rounded-full m-0.5"
                  key={`dot-${i}-${j}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Dice: React.FC<Props> = ({ count }: Props) => {
  if (count <= 0 || count > 6) return null;

  return (
    <div className="rounded border border-gray-400 p-2 w-20 h-20">
      <Dots count={count} />
    </div>
  );
};

export default Dice;
