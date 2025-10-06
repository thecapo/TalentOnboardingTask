import React from "react";

export const Response = ({ status, error, entityName }) => {
  return (
    <div className="response">
          {status === 'loading' && (
              <div className="text-center my-4 text-blue-500">{`Loading ${entityName}...`}</div>
          )}
          {status === 'succeeded' && (
              <div className="text-center my-4 text-green-500">Loading success...</div>
          )}
          {error && (
              <div className="text-center my-4 text-red-600">Error: {error}</div>
          )}
    </div>
  );
};