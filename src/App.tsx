import React from 'react';

import Counter from './Tasks/Counter';

const App = props => {
  return (
    <div className="max-w-screen-md mx-auto mt-10">
      <h1 className="font-bold text-3xl">
        <a
          href="https://eugenkiss.github.io/7guis/tasks"
          target="_blank"
          rel="noreferrer noopener"
          className="text-indigo-400 hover:underline"
        >
          The 7 Tasks from 7GUIs
        </a>
      </h1>
      <p className="mt-2">
        The tasks were selected by the following criteria. The task set should
        be as small as possible yet reflect as many typical (or fundamental or
        representative) challenges in GUI programming as possible. Each task
        should be as simple and self-contained as possible yet not too
        artificial. Preferably, a task should be based on existing examples as
        that gives the task more justification to
        <br />
        <br />
        Below, a description of each task hightlighted with the challenges it
        reflects and its implementation using react and xstate.
      </p>

      <div className="mt-5">
        <div className="my-10">
          <Counter />
        </div>
      </div>
    </div>
  );
};

export default App;
