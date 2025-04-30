# Gossip Protocol Simulator

Simulates a simplified version of the Gossip Protocol as used in distributed systems like Apache Cassandra.

The Gossip protocol is a protocol that allows designing highly efficient, secure and low latency distributed communication systems (P2P). The inspiration for its design has been taken from studies on epidemic expansion and algorithms resulting from it.

## Features
- Node-to-node gossip simulation
- Tracking of convergence and message count
- Visual graph of state propagation
- Tolerance to missing or slow nodes

## Installation

```bash
./run.sh
```
Open ```frontend/index.html``` in browser.

## Usage

1. Submit data to a node
2. Click "Next Round"
3. Observe data propagation