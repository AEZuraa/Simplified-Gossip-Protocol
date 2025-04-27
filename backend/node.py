class Node:
    def __init__(self, node_id) -> None:
        self.id = node_id
        self.data = {} #known data
        self.active = True #is this node active
        self.alive = True #is this node alive

    def send_to(self, other) -> None:
        """
        Send data to other node
        """
        other.rec_from(self.data)
    
    def rec_from(self, new_data) -> None:
        """
        Recieve new data and add it to known data
        """
        for key, value in new_data.items():
            if key not in self.data:
                self.data[key] = value

    def kill(self) -> None:
        """
        Kill node
        """
        self.active = False
        self.alive = False

    def wake_up(self):
        """
        Wake up a previously inactive node.
        """
        if self.alive:
            self.active = True