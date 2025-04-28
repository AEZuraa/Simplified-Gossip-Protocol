from node import Node
import random
import threading
from utils import serialize_cluster_state, simulate_node_failure, simulate_node_recovery, export_history

class GossipAlg:
    def __init__(self, num_nodes, simulation_id) -> None:
        self.nodes = [] #all nodes
        self.round = 0 #num of round
        self.stop = False #should we stop
        self.history = []
        self.converged = False
        self.simulation_id = simulation_id
        self._create_nodes(num_nodes)

    def _create_nodes(self, num_nodes):
        """
        Create all nodes
        """
        for i in range(1, num_nodes + 1):
            self.nodes.append(Node(node_id=i))

    def inject_data(self, node_id, data):
        """
        Place data in the first node
        """
        if 1 <= node_id < len(self.nodes) + 1:
            self.nodes[node_id - 1].rec_from(data)
        self._save_round_history(messages_in_round=[])

    def start_round(self):
        """
        One round between nodes
        """
        self.round += 1
        messages_in_round = []

        # shuffle nodes for random conversation
        nodes_list = [node for node in self.nodes if node.active]
        random.shuffle(nodes_list)

        snapshot = {}
        for node in nodes_list:
            snapshot[node.id] = {
                "active": node.active,
                "alive": node.alive,
                "has_message": bool(node.data)
            }

        threads = []

        for node in nodes_list:
            state = snapshot[node.id]

            if not state["alive"]:
                node.kill()
                continue

            if not state["active"]:
                if simulate_node_recovery(probability=0.05):
                    node.wake_up()
                continue

            peer = self._select_peer(node)

            if peer:
                print(state)
                if state["has_message"]:
                    messages_in_round.append({
                        "from": f"Node {node.id}",
                        "to": f"Node {peer.id}",
                        "message": node.data["message"]
                    })
                    t = threading.Thread(target=node.send_to, args=(peer,))
                    threads.append(t)
                    t.start()

        for t in threads:
            t.join()

        self.converged = self.has_converged()
        self._save_round_history(messages_in_round)

    def _select_peer(self, node):
        """
        Choose random node for exchange data.
        """
        candidates = [n for n in self.nodes if n != node and n.active and n.alive]
        if not candidates:
            return None
        return random.choice(candidates)
    
    def has_converged(self):
        """
        Convergence check: all alive nodes know the same thing.
        """
        alive_nodes = [node for node in self.nodes if node.alive]
        if not alive_nodes:
            return False  #No alive

        first_data = alive_nodes[0].data
        for node in alive_nodes:
            if node.data != first_data:
                return False
        return True
    
    def kill_node(self, node_id):
        """
        Kill node(error simulation).
        """
        if 1 <= node_id < len(self.nodes) + 1:
            self.nodes[node_id - 1].kill()

    def get_cluster_state(self):
        """
        States of all nodes
        """
        state = [
            {
                "id": f"Node {node.id}",
                "active": node.active,
                "alive": node.alive,
                "has_message": bool(node.data),
            }
            for node in self.nodes
        ]
        return serialize_cluster_state(state)

    def run_until_convergence(self, max_rounds=100):
        """
        Run algorithm
        """
        while not self.converged and self.round < max_rounds:
            self.start_round()

    def _save_round_history(self, messages_in_round):
        """
        Save round information
        """
        state = self.get_cluster_state()
        current_history = {
            "round": self.round,
            "finished": self.converged,
            "nodes": state,
            "messages": messages_in_round
        }
        export_history(current_history, f"logs/simulation-{self.simulation_id}/{self.round}_round.json")
        self.history.append(current_history)
