import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import Layout from './Layout';

function convertCelsiusToFahrenheit(celsius) {
  return celsius * (9 / 5) + 32;
}

function convertFahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

type MachineContext = {
  celsius?: string;
  fahrenheit?: string;
};

interface MachineSchema {
  states: {
    active: {};
  };
}

type MachineEvents =
  | {
      type: 'CELSIUS';
      value?: string;
    }
  | { type: 'FAHRENHEIT'; value?: string };

const temperatureMachine = Machine<
  MachineContext,
  MachineSchema,
  MachineEvents
>(
  {
    context: {
      celsius: '',
      fahrenheit: '',
    },
    initial: 'active',
    states: {
      active: {
        on: {
          CELSIUS: {
            actions: ['onCelsius'],
          },
          FAHRENHEIT: {
            actions: ['onFahrenheit'],
          },
        },
      },
    },
  },
  {
    actions: {
      onCelsius: assign({
        celsius: (context, event) => event.value,
        fahrenheit: (context, event) =>
          event.value
            ? convertCelsiusToFahrenheit(+event.value).toString()
            : '',
      }),
      onFahrenheit: assign({
        fahrenheit: (context, event) => event.value,
        celsius: (context, event) =>
          event.value
            ? convertFahrenheitToCelsius(+event.value).toString()
            : '',
      }),
    },
  },
);

const TemperatureConverter = () => {
  const [state, sendEvent] = useMachine<MachineContext, MachineEvents>(
    temperatureMachine,
  );

  const onChange = (type: 'C' | 'F') => ({ target: { value } }) => {
    if (type === 'C') {
      sendEvent({
        type: 'CELSIUS',
        value,
      });
    } else if (type === 'F') {
      sendEvent({
        type: 'FAHRENHEIT',
        value,
      });
    }
  };

  return (
    <Layout
      state={state}
      title="Temperature Converter"
      challenge="Challenges: bidirectional data flow, user-provided text input."
      description={`The task is to build a frame containing two textfields TC and TF representing the temperature in Celsius and Fahrenheit, respectively. Initially, both TC and TF are empty. When the user enters a numerical value into TC the corresponding value in TF is automatically updated and vice versa. When the user enters a non-numerical string into TC the value in TF is not updated and vice versa. The formula for converting a temperature C in Celsius into a temperature F in Fahrenheit is C = (F - 32) * (5/9) and the dual direction is F = C * (9/5) + 32.
      <br />
      <br />
      Temperature Converter increases the complexity of Counter by having bidirectional data flow between the Celsius and Fahrenheit inputs and the need to check the user input for validity. A good solution will make the bidirectional dependency very clear with minimal boilerplate code.
      <br />
      <br />
      Temperature Converter is inspired by the Celsius/Fahrenheit converter from the book Programming in Scala. It is such a widespread example—sometimes also in the form of a currency converter—that one could give a thousand references. The same is true for the Counter task.`}
    >
      <div className="flex flex-col items-center">
        <label>
          <input
            className="bg-teal-100 px-4 py-2 mr-1 outline-none"
            placeholder="E. g., 0"
            onChange={onChange('C')}
            type="number"
            value={state.context.celsius}
          />
          <span className="font-bold">C°</span>
        </label>
        <span> = </span>
        <label>
          <input
            className="bg-teal-100 px-4 py-2 mr-1 outline-none"
            placeholder="E. g., 0"
            type="number"
            onChange={onChange('F')}
            value={state.context.fahrenheit}
          />
          <span className="font-bold">F°</span>
        </label>
      </div>
    </Layout>
  );
};

export default TemperatureConverter;
