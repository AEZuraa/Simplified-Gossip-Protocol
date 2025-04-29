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

  //right-up
  const flipX = dx > 0 && dy < 0 ? 1 : -1;
  const flipY = dx > 0 && dy < 0 ? 1 : -1;

  //right-down
  const flipX2 = dx > 0 && dy > 0 ? 1 : -1;
  const flipY2 = dx > 0 && dy > 0 ? 1 : -1;

  //left-up
  const flipX3 = dx < 0 && dy < 0 ? 1 : -1;
  const flipY3 = dx < 0 && dy < 0 ? -1 : 1;

  //left-down
  const flipX4 = dx < 0 && dy > 0 ? 1 : 1;
  const flipY4 = dx < 0 && dy > 0 ? -1 : 1;

  let flipDirectionX = 1;
  let flipDirectionY = 1;

  if (dx > 0 && dy < 0) {
    flipDirectionX = flipX;
    flipDirectionY = flipY;
  } else if (dx > 0 && dy > 0) {
    flipDirectionX = flipX2;
    flipDirectionY = flipY2;
  } else if (dx < 0 && dy < 0) {
    flipDirectionX = flipX3;
    flipDirectionY = flipY3;
  } else if (dx < 0 && dy > 0) {
    flipDirectionX = flipX4;
    flipDirectionY = flipY4;
  }

  return (
    <div
      className="message-line"
      style={{
        left: `${fromX}px`,
        top: `${fromY}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,  // Поворачиваем линию сообщения
        transition: 'all 0.3s ease' // Добавляем плавность
      }}
    >
      <div
        className={`message-dot ${animated ? 'animated' : ''}`}
        title={`Message: ${message.message}`}
        style={{
          transform: `scaleX(${flipDirectionX}) scaleY(${flipDirectionY})`, // Зеркалим спрайт
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
};

export default MessageLine;
