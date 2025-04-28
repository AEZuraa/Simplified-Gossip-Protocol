import json
import random

def export_history(history, filename="gossip_history.json"):
    """
    Export full gossip simulation history to JSON file.
    """
    with open(filename, 'w') as f:
        json.dump(history, f, indent=4)

def serialize_cluster_state(cluster_state):
    """
    Convert cluster state to a JSON string (pretty formatted).
    """
    return json.dumps(cluster_state, indent=4)

def simulate_node_failure(probability=0.01):
    """
    Randomly decide if a node should fail this round, based on a given probability.
    Return True if node should fail.
    """
    return random.random() < probability

def simulate_node_recovery(probability=0.05):
    """
    Randomly decide if a sleeping node wakes up this round.
    Return True if node should recover.
    """
    return random.random() < probability


