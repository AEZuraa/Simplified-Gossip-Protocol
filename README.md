# Gossip Protocol Simulator

Simulates a simplified version of the Gossip Protocol as used in distributed systems like Apache Cassandra.

The Gossip protocol is a protocol that allows designing highly efficient, secure and low latency distributed communication systems (P2P). The inspiration for its design has been taken from studies on epidemic expansion and algorithms resulting from it.

## Features
- Node-to-node gossip simulation
- Displaying a simulation of each round of messaging
- Visualization of the entire simulation process
- Tolerance to dead nodes

## Installation

Type the following in the terminal of the project root folder:
```bash
chmod +x run.sh
./run.sh
```
Then open ```http://localhost:3000``` in browser.

## Usage

1. Select the number of nodes in the simulation
2. Select the message to send to the other nodes
3. Select the node id of the node from which the simulation will start
4. Observe the simulation process