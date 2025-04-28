import React from 'react';

const NodeCircle = ({ node, position }) => {
  const getNodeColor = () => {
    if (!node.alive) return '#7f8c8d'; // серый если не alive
    if (node.has_message) return '#2ecc71'; // зеленый если получил сообщение
    if (node.active) return '#3498db'; // синий если активен
    return '#bdc3c7'; // светло-серый если просто alive
  };

  const getNodeText = () => {
    if (!node.alive) return '💀';
    return node.id.replace('Node ', '');
  };

  return (
    <div
      className="node"
      style={{
        ...position,
        backgroundColor: getNodeColor(),
      }}
      title={node.has_message ? "Has the message" : "Doesn't have the message"}
    >
      {getNodeText()}
    </div>
  );
};

export default NodeCircle;