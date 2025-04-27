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

  const loadRoundData = useCallback(async (simId, roundNumber) => {
    try {
      const data = await fetchRoundData(simId, roundNumber);
      return data;
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
        setNodes(data.nodes || []);
        setMessages(data.messages || []);
        
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
    
    try {
      const { simulation_id } = await startAlgorithm(nodesCount);
      setSimulationId(simulation_id);
      
      // Генерируем позиции узлов по кругу
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
        
        <button 
          onClick={handleStartAlgorithm} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Start Algorithm'}
        </button>
      </div>

      {currentRound && (
        <h2>Round {currentRound} {isFinished && '(Finished)'}</h2>
      )}

      <div className="visualization-container">
        <div className="circle" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
          {nodes.map((node) => {
            const position = nodePositions.find(p => p.id === node.id)?.position;
            return position ? (
              <NodeCircle 
                key={`${node.id}-${currentRound}`}
                node={node} 
                position={position} 
              />
            ) : null;
          })}

          {messages.map((message, idx) => (
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