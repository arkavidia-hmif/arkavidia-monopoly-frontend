import React, { useState } from 'react';
import { RouteComponentProps } from '@reach/router';

const LobbyPage: React.FC<RouteComponentProps> = () => {
  const [text, setText] = useState<string>('initialState');

  return (
    <div className="container mx-auto">
      <div>
        <form>
          <input
            type="text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default LobbyPage;
