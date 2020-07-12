import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import Layout from './Layout';

type MachineContext = {
  // the elapsed time (in seconds)
  elapsed: number;
  // the maximum time (in seconds)
  duration: number;
  // the interval to send TICK events(in seconds)
  interval: number;
};

interface MachineSchema {
  states: {
    running: {};
    paused: {};
  };
}

type MachineEvents =
  | {
      type: 'TICK';
    }
  | {
      type: 'DURATION.UPDATE';
      value: number;
    }
  | {
      type: 'RESET';
    };

const timerMachine = Machine<MachineContext, MachineSchema, MachineEvents>(
  {
    id: 'timer',
    initial: 'running',
    context: {
      elapsed: 0,
      duration: 5,
      interval: 0.1,
    },
    states: {
      running: {
        invoke: {
          src: context => cb => {
            const interval = setInterval(() => {
              cb('TICK');
            }, 1000 * context.interval);

            // this will run when the machine transioned from running to paused
            return () => {
              clearInterval(interval);
            };
          },
        },
        always: [
          {
            target: 'paused',
            cond: (context, event) => {
              return context.elapsed >= context.duration;
            },
          },
        ],
        on: {
          TICK: {
            actions: assign({
              elapsed: context =>
                +(context.elapsed + context.interval).toFixed(2),
            }),
          },
        },
      },
      paused: {
        always: [
          {
            target: 'running',
            cond: context => context.elapsed < context.duration,
          },
        ],
      },
    },
    on: {
      'DURATION.UPDATE': {
        actions: assign({
          duration: (_, event) => event.value,
        }),
      },
      RESET: {
        actions: assign({
          elapsed: 0,
        }),
      },
    },
  },
  {},
);

const Timer = props => {
  const [state, sendEvent] = useMachine<MachineContext, MachineEvents>(
    timerMachine,
  );

  const onSliderChange = ({ target: { value } }) => {
    console.log({ value });

    sendEvent({
      type: 'DURATION.UPDATE',
      value: +value,
    });
  };

  const onClickButton = () => {
    sendEvent({
      type: 'RESET',
    });
  };

  const { duration, elapsed } = state.context;

  return (
    <Layout
      title="Timer"
      challenge="Challenges: concurrency, competing user/signal interactions, responsiveness."
      description={`
      The task is to build a frame containing a gauge G for the elapsed time e, a label which shows the elapsed time as a numerical value, a slider S by which the duration d of the timer can be adjusted while the timer is running and a reset button R. Adjusting S must immediately reflect on d and not only when S is released. It follows that while moving S the filled amount of G will (usually) change immediately. When e ≥ d is true then the timer stops (and G will be full). If, thereafter, d is increased such that d > e will be true then the timer restarts to tick until e ≥ d is true again. Clicking R will reset e to zero.
      <br />
      Timer deals with concurrency in the sense that a timer process that updates the elapsed time runs concurrently to the user’s interactions with the GUI application. This also means that the solution to competing user and signal interactions is tested. The fact that slider adjustments must be reflected immediately moreover tests the responsiveness of the solution. A good solution will make it clear that the signal is a timer tick and, as always, has not much scaffolding.
      <br />
      Timer is directly inspired by the timer example in the paper Crossing State Lines: Adapting Object-Oriented Frameworks to Functional Reactive Languages.
      `}
      state={state}
    >
      <div className="flex flex-col">
        <div
          className="relative inline-block text-center font-bold text-xl border-blue-500 border-solid border-2 p-4"
          style={{
            width: 200,
          }}
        >
          <div
            className="absolute inset-0 bg-teal-500 w-full h-full w-auto"
            style={{
              transition: 'transform 0.1s linear',
              transform: `scaleX(
                ${elapsed >= duration ? 1 : elapsed / duration}
              )`,
              transformOrigin: 'left',
            }}
          />
          <span className="relative">
            {`${elapsed.toFixed(1)}s / ${duration.toFixed(1)}s`}
          </span>
        </div>
        <div className="mt-4 w-full">
          <label className="w-full">
            <span className="font-bold">Duration</span>
            <input
              onChange={onSliderChange}
              className="w-full"
              type="range"
              value={duration}
              min="0"
              max="60"
            />
          </label>
        </div>
        <button
          onClick={onClickButton}
          type="button"
          className="mt-4 font-bold border-2 bg-blue-500 text-white px-4 py-2"
        >
          Reset
        </button>
      </div>
    </Layout>
  );
};

export default Timer;
