// src/components/NodeCircle.js
import React from 'react';

function NodeCircle({ x, y, label }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: '50px',
        height: '50px',
        backgroundColor: 'lightgray',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  );
}

export default NodeCircle;