import React from 'react';

interface Props {
  count: number;
}

const Dice: React.FC<Props> = (props: Props) => {
  return (
    <div className="rounded border border-gray-400 p-4">{props.count}</div>
  );
};

export default Dice;
