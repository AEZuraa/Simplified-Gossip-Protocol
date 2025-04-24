# Gossip Protocol Simulator

Simulates a simplified version of the Gossip Protocol as used in distributed systems like Apache Cassandra.

## Features
- Node-to-node gossip simulation
- Tracking of convergence and message count
- Visual graph of state propagation
- Tolerance to missing or slow nodes

## Installation

```bash
pip install -r requirements.txt
./run.sh
```
Open ```frontend/index.html``` in browser.

## Usage

1. Submit data to a node
2. Click "Next Round"
3. Observe data propagation