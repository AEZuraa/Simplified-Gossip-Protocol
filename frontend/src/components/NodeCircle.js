import React, { useState, useEffect } from 'react';

const NodeCircle = ({ node, position }) => {
  const [imagePath, setImagePath] = useState('/images/workspace_base.png');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!node.alive) {
        setImagePath('/images/workspace_red.png');
      } else if (node.has_message) {
        setImagePath('/images/workspace_green.png');
      } else if (node.active) {
        setImagePath('/images/workspace_base.png');
      } else {
        setImagePath('/images/workspace_base.png');
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
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        transition: 'background-image 0.5s ease'
      }}
      title={node.has_message ? "Has the message" : "Doesn't have the message"}
    >
      {getNodeText()}
    </div>
  );
};

export default NodeCircle;
