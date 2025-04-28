import React, { useState, useEffect, useCallback } from 'react';
import { startAlgorithm, fetchRoundData } from './api';
import NodeCircle from './components/NodeCircle';
import MessageLine from './components/MessageLine';
import './styles.css';

const CIRCLE_SIZE = 500;

function App() {
  const [currentRound, setCurrentRound] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [simulationId, setSimulationId] = useState(null);
  const [nodePositions, setNodePositions] = useState([]);
  const [nodesCount, setNodesCount] = useState(4);
  const [messageText, setMessageText] = useState('Hello Gossip!');
  const [startNodeId, setStartNodeId] = useState(1);

  const loadRoundData = useCallback(async (simId, roundNumber) => {
    try {
      const data = await fetchRoundData(simId, roundNumber);
      
      // Преобразуем nodes в массив, если это необходимо
      let nodesData = data?.nodes || [];
      if (nodesData && !Array.isArray(nodesData)) {
        if (typeof nodesData === 'string') {
          try {
            nodesData = JSON.parse(nodesData);
          } catch (e) {
            console.error('Error parsing nodes data:', e);
            nodesData = [];
          }
        } else {
          nodesData = Object.values(nodesData);
        }
      }

      // Преобразуем messages в массив
      let messagesData = data?.messages || [];
      if (messagesData && !Array.isArray(messagesData)) {
        messagesData = Object.values(messagesData);
      }

      return {
        ...data,
        nodes: nodesData,
        messages: messagesData
      };
    } catch (error) {
      console.error('Error loading round data:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!isRunning || !simulationId || currentRound === null) return;

    const processRound = async () => {
      const data = await loadRoundData(simulationId, currentRound);
      
      if (data) {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        
        setTimeout(() => {
          setNodes(Array.isArray(data.nodes) ? data.nodes : []);
        }, 1500);
        
        if (data.finished) {
          setIsRunning(false);
          setIsFinished(true);
        } else {
          setTimeout(() => {
            setCurrentRound(prev => prev + 1);
          }, 2000);
        }
      }
    };

    processRound();
  }, [currentRound, isRunning, loadRoundData, simulationId]);

  const handleStartAlgorithm = async () => {
    setIsRunning(true);
    setIsFinished(false);
    setMessages([]);
    setNodes([]);
    
    try {
      const selectedStartId = startNodeId > 0 ? startNodeId : Math.floor(Math.random() * nodesCount) + 1;
      
      const { simulation_id } = await startAlgorithm(
        nodesCount,
        selectedStartId,
        messageText
      );
      setSimulationId(simulation_id);
      
      const positions = [];
      for (let i = 0; i < nodesCount; i++) {
        const angle = 2 * Math.PI * i / nodesCount;
        const x = 50 + 40 * Math.cos(angle);
        const y = 50 + 40 * Math.sin(angle);
        positions.push({
          id: `Node ${i+1}`,
          position: { top: `${y}%`, left: `${x}%` }
        });
      }
      setNodePositions(positions);
      
      setCurrentRound(1);
    } catch (error) {
      console.error('Error starting algorithm:', error);
      setIsRunning(false);
    }
  };

  // Добавим проверку перед рендерингом
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="App">
      <h1>Gossip Protocol Simulator</h1>
      
      <div className="controls">
        <div className="input-group">
          <label htmlFor="nodes-count">Nodes Count:</label>
          <input 
            id="nodes-count"
            type="number" 
            min="2" 
            max="20" 
            value={nodesCount}
            onChange={(e) => setNodesCount(Math.max(2, parseInt(e.target.value) || 2))}
            disabled={isRunning}
          />
        </div>

        <div className="input-group">
          <label htmlFor="message-text">Message:</label>
          <input 
            id="message-text"
            type="text" 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div className="input-group">
          <label htmlFor="start-node">Start Node ID:</label>
          <input 
            id="start-node"
            type="number" 
            min="1" 
            max={nodesCount}
            value={startNodeId}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setStartNodeId(val > 0 && val <= nodesCount ? val : 1);
            }}
            disabled={isRunning}
          />
          <span>(0 for random)</span>
        </div>
        
        <button 
          onClick={handleStartAlgorithm} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Start Algorithm'}
        </button>
      </div>

      <div style={{ minHeight: '40px' }}>
        {currentRound - 1 > 0 ? (
          <h2>Round {currentRound - 1} {isFinished && '(Finished)'}</h2>
        ) : null}
      </div>

      <div className="visualization-container">
        <div className="circle" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
          {safeNodes.map((node) => {
            const position = nodePositions.find(p => p.id === node.id)?.position;
            return position ? (
              <NodeCircle 
                key={`${node.id}-${currentRound}`}
                node={node} 
                position={position} 
              />
            ) : null;
          })}

          {safeMessages.map((message, idx) => (
            <MessageLine
              key={`${message.from}-${message.to}-${idx}-${currentRound}`}
              message={message}
              nodePositions={nodePositions}
              circleSize={CIRCLE_SIZE}
            />
          ))}
        </div>
      </div>

      {isFinished && <div className="finished-message">Algorithm finished!</div>}
    </div>
  );
}

export default App;