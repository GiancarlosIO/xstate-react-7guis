import React from 'react';
import { Machine, assign } from 'xstate';

import { useMachine } from '@xstate/react';

import Layout from './Layout';

interface Context {
  count: number;
}

interface CounterSchema {
  states: {
    active: {};
  };
}

type CounterEvents =
  | {
      type: 'INCREMENT';
    }
  | {
      type: 'DECREASE';
    };

const counterMachine = Machine<Context, CounterSchema, CounterEvents>(
  {
    context: {
      count: 0,
    },
    initial: 'active',
    states: {
      active: {
        on: {
          INCREMENT: {
            actions: 'increaseCounter',
          },
          DECREASE: {
            actions: 'decreaseCounter',
            cond: 'isGreaterThanZero',
          },
        },
      },
    },
  },
  {
    guards: {
      isGreaterThanZero: (context, event) => {
        return context.count > 0;
      },
    },
    actions: {
      increaseCounter: assign({
        count: (context, event) => context.count + 1,
      }),
      decreaseCounter: assign({
        count: (context, event) => context.count - 1,
      }),
    },
  },
);

const Counter = props => {
  const [state, sendEvent] = useMachine(counterMachine);

  function onClickPlusButton() {
    sendEvent({
      type: 'INCREMENT',
    });
  }

  function onClickMinusButton() {
    sendEvent({
      type: 'DECREASE',
    });
  }

  return (
    <Layout
      state={state}
      title="Counter"
      challenge="Challenge: Understanding the basic ideas of a language/toolkit."
      description={`
        The task is to build a frame containing a label or read-only textfield T
        and a button B. Initially, the value in T is “0” and each click of B
        increases the value in T by one. Counter serves as a gentle introduction
        to the basics of the language, paradigm and toolkit for one of the
        simplest GUI applications imaginable. Thus, Counter reveals the required
        scaffolding and how the very basic features work together to build a GUI
        application. A good solution will have almost no scaffolding.
      `}
    >
      <span
        style={{
          width: 88,
          height: 88,
        }}
        className="text-xl border-solid border-teal-500 border-2 rounded flex items-center justify-center"
      >
        {state.context.count}
      </span>
      <div>
        <button
          type="button"
          onClick={onClickMinusButton}
          className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          -
        </button>
        <button
          type="button"
          onClick={onClickPlusButton}
          className="ml-1 mt-4 bg-teal-500 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>
    </Layout>
  );
};

export default Counter;
