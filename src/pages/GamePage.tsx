import React, { useMemo } from 'react';
import { RouteComponentProps } from '@reach/router';

const GamePage: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <form>
        <input value="" />
        <button>submit</button>
      </form>
    </div>
  );
};

export default GamePage;
