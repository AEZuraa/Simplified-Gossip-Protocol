import React, { useEffect, useState } from 'react';

const MessageLine = ({ message, nodePositions, circleSize }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [message]);

  const fromPos = nodePositions.find(pos => pos.id === message.from)?.position;
  const toPos = nodePositions.find(pos => pos.id === message.to)?.position;

  if (!fromPos || !toPos) return null;

  const fromX = parseFloat(fromPos.left) / 100 * circleSize;
  const fromY = parseFloat(fromPos.top) / 100 * circleSize;
  const toX = parseFloat(toPos.left) / 100 * circleSize;
  const toY = parseFloat(toPos.top) / 100 * circleSize;

  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div 
      className="message-line"
      style={{
        left: `${fromX}px`,
        top: `${fromY}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div 
        className={`message-dot ${animated ? 'animated' : ''}`}
        title={`Message: ${message.message}`}
      />
    </div>
  );
};

export default MessageLine;