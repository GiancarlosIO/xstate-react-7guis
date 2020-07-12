import React from 'react';

const Layout = ({ state, title, description, challenge, children }) => {
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="my-4 italic">{challenge}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />

      <div className="mt-10 w-full h-auto flex flex-col items-center">
        {children}
      </div>
      {state && (
        <div className="mt-10">
          <pre>
            <code>State: {JSON.stringify(state.value)}</code>
          </pre>
          <pre>
            <code>Context: {JSON.stringify(state.context)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default Layout;
