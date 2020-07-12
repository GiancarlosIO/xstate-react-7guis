import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import Layout from './Layout';

type Trip = 'oneWay' | 'roundTrip';

type ContextMachine = {
  startDate?: string;
  returnDate?: string;
  trip: Trip;
};

interface SchemaMachine {
  states: {
    editing: {};
    submitted: {};
  };
}

type EventsMachine =
  | {
      type: 'SET_TRIP';
      value: Trip;
    }
  | {
      type: 'startDate.UPDATE';
      value: string;
    }
  | {
      type: 'returnDate.UPDATE';
      value: string;
    }
  | {
      type: 'SUBMIT';
    };

const flightBookerMachine = Machine<
  ContextMachine,
  SchemaMachine,
  EventsMachine
>({
  id: 'flight',
  context: {
    startDate: undefined,
    returnDate: undefined,
    trip: 'oneWay',
  },
  initial: 'editing',
  states: {
    editing: {
      on: {
        'startDate.UPDATE': {
          actions: assign({
            startDate: (context, event) => event.value,
          }),
        },
        'returnDate.UPDATE': {
          actions: assign({
            returnDate: (context, event) => event.value,
          }),
        },
        SET_TRIP: {
          actions: assign({
            trip: (_, event) => event.value,
          }),
          cond: (context, event) => {
            return event.value === 'oneWay' || event.value === 'roundTrip';
          },
        },
        SUBMIT: {
          target: 'submitted',
          cond: (context, event) => {
            if (context.trip === 'oneWay') {
              return !!context.startDate;
            }
            return (
              !!context.startDate &&
              !!context.returnDate &&
              context.returnDate > context.startDate
            );
          },
        },
      },
    },
    submitted: {
      type: 'final',
    },
  },
});

const FlightBooker = props => {
  const [state, sendEvent] = useMachine<ContextMachine, EventsMachine>(
    flightBookerMachine,
  );

  const onSubmit = e => {
    e.preventDefault();
    sendEvent('SUBMIT');
  };

  const onChangeSelect = event => {
    sendEvent({
      type: 'SET_TRIP',
      value: event.target.value,
    });
  };

  const onChangeDate = event => {
    const { value, name } = event.target;

    sendEvent({
      type: `${name}.UPDATE` as 'startDate.UPDATE' | 'returnDate.UPDATE',
      value,
    });
  };

  // https://xstate.js.org/docs/guides/transitions.html#selecting-enabled-transitions
  // It returns a new State instance,
  // which is the result of taking all the transitions enabled by the current state and event.
  // Changed will be true only if machine's state has changed from 'editing' to 'submitted'.
  // Le decimos a la machine actual que intente hacer un transition pasandole el evento SUBMIT.
  // Si la maquina logra hacer un transition, quiere decir que todos lo guards (conds / validaciones) han pasado.
  // Si la maquina logra hacer una transition, entonces changed es true. editing => submitted
  const canSubmit = flightBookerMachine.transition(state, 'SUBMIT').changed;

  return (
    <Layout
      state={state}
      title="Flight Booker"
      challenge="Challenge: Constraints."
      description={`
      The task is to build a frame containing a combobox C with the two options “one-way flight” and “return flight”, two textfields T1 and T2 representing the start and return date, respectively, and a button B for submitting the selected flight. T2 is enabled iff C’s value is “return flight”. When C has the value “return flight” and T2’s date is strictly before T1’s then B is disabled. When a non-disabled textfield T has an ill-formatted date then T is colored red and B is disabled. When clicking B a message is displayed informing the user of his selection (e.g. “You have booked a one-way flight on 04.04.2014.”). Initially, C has the value “one-way flight” and T1 as well as T2 have the same (arbitrary) date (it is implied that T2 is disabled).
      <br />
      <br />
      The focus of Flight Booker lies on modelling constraints between widgets on the one hand and modelling constraints within a widget on the other hand. Such constraints are very common in everyday interactions with GUI applications. A good solution for Flight Booker will make the constraints clear, succinct and explicit in the source code and not hidden behind a lot of scaffolding.
      <br />
      <br />
      Flight Booker is directly inspired by the Flight Booking Java example in Sodium with the simplification of using textfields for date input instead of specialized date picking widgets as the focus of Flight Booker is not on specialized/custom widgets.
      `}
    >
      <div>
        <form onSubmit={onSubmit}>
          <label className="block mb-2">
            <span
              className="inline-block font-bold mr-2"
              style={{
                width: 100,
              }}
            >
              Trip type
            </span>
            <select
              name="trip-type"
              value={state.context.trip}
              onChange={onChangeSelect}
              className="bg-blue-100 px-4 py-2 mr-1 outline-none"
            >
              <option value="oneWay">one way</option>
              <option value="roundTrip">round trip</option>
            </select>
          </label>

          <label className="block mb-2">
            <span
              className="inline-block font-bold mr-2"
              style={{
                width: 100,
              }}
            >
              Start date
            </span>
            <input
              type="date"
              name="startDate"
              className="bg-blue-100 px-4 py-2 mr-1 outline-none"
              onChange={onChangeDate}
            />
          </label>

          <label className="block mb-2">
            <span
              className="inline-block font-bold mr-2"
              style={{
                width: 100,
              }}
            >
              Return date
            </span>
            <input
              type="date"
              name="returnDate"
              className="bg-blue-100 px-4 py-2 mr-1 outline-none"
              onChange={onChangeDate}
              disabled={state.context.trip === 'oneWay'}
            />
          </label>
          <button
            type="submit"
            className="text-white rounded bg-blue-500 px-4 py-2 mx-auto block"
            disabled={!canSubmit}
            css={`
              &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
            `}
          >
            {state.matches('editing') && 'Submit'}
            {state.matches('submitted') && 'Success!'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default FlightBooker;
