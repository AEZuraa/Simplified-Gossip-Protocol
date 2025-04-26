import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const nodePositions = [
    { top: '10%', left: '50%' },
    { top: '50%', left: '90%' },
    { top: '90%', left: '50%' },
    { top: '50%', left: '10%' },
  ];

  useEffect(() => {
    if (!running) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/round/${round}`);
        const data = await response.json();
        if (data.nodes) {
          setNodes(data.nodes);
        }
        if (data.messages) {
          setMessages(data.messages);
        }
        // Проверяем, завершен ли алгоритм
        if (data.nodes.every(node => node.data_received)) {
          setRunning(false);
          setFinished(true);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();

    if (running && !finished) {
      setTimeout(() => setRound(round + 1), 2000);
    }
  }, [round, running]);

  const startAlgorithm = async () => {
    setRound(1);
    setRunning(true);
    setFinished(false);
    await fetch('http://127.0.0.1:8000/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes_count: 4 }),
    });
  };

  const findNodePosition = (nodeId) => {
    const index = nodes.findIndex(node => node.id === nodeId);
    return nodePositions[index];
  };

  return (
    <div className="App">
      <h1>Gossip Protocol: Round {round}</h1>
      <button onClick={startAlgorithm} disabled={running}>
        {running ? 'Running...' : 'Start Algorithm'}
      </button>
      <div className="circle">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className={`node ${node.active ? 'active' : ''}`}
            style={nodePositions[index]}
          >
            {node.id}
          </div>
        ))}
        {messages.map((msg, idx) => {
          const fromPos = findNodePosition(msg.from);
          const toPos = findNodePosition(msg.to);
          if (!fromPos || !toPos) return null;

          const lineStyle = {
            left: `${fromPos.left}`,
            top: `${fromPos.top}`,
            '--to-left': `${toPos.left}`,
            '--to-top': `${toPos.top}`,
          };

          return (
            <div key={idx} className="line" style={lineStyle}></div>
          );
        })}
      </div>
      {finished && <div className="finished-message">Алгоритм завершен!</div>}
    </div>
  );
}

export default App;