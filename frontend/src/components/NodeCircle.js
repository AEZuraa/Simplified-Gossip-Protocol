import React, { useState, useEffect } from 'react';

const NodeCircle = ({ node, position }) => {
  const [currentColor, setCurrentColor] = useState('#bdc3c7');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!node.alive) {
        setCurrentColor('#7f8c8d');
      } else if (node.has_message) {
        setCurrentColor('#2ecc71');
      } else if (node.active) {
        setCurrentColor('#3498db');
      } else {
        setCurrentColor('#bdc3c7');
      }
    }, 100); 

    return () => clearTimeout(timer);
  }, [node]);

  const getNodeText = () => {
    if (!node.alive) return '💀';
    return node.id.replace('Node ', '');
  };

  return (
    <div
      className="node"
      style={{
        ...position,
        backgroundColor: currentColor,
        transition: 'background-color 0.5s ease'
      }}
      title={node.has_message ? "Has the message" : "Doesn't have the message"}
    >
      {getNodeText()}
    </div>
  );
};

export default NodeCircle;