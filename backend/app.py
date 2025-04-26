from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Пример данных с данным форматом
round_data = {
    1: {
        "round": 1,
        "nodes": [
            {"id": "Node 1", "active": True, "alive": True, "data_received": True},
            {"id": "Node 2", "active": False, "alive": True, "data_received": False},
            {"id": "Node 3", "active": True, "alive": True, "data_received": False},
            {"id": "Node 4", "active": False, "alive": True, "data_received": False}
        ],
        "messages": [
            {"from": "Node 1", "to": "Node 2", "message": "Data from Node 1 to Node 2"},
            {"from": "Node 3", "to": "Node 4", "message": "Data from Node 3 to Node 4"}
        ]
    },
    2: {
        "round": 2,
        "nodes": [
            {"id": "Node 1", "active": True, "alive": True, "data_received": True},
            {"id": "Node 2", "active": True, "alive": True, "data_received": False},
            {"id": "Node 3", "active": False, "alive": True, "data_received": False},
            {"id": "Node 4", "active": False, "alive": True, "data_received": False}
        ],
        "messages": [
            {"from": "Node 2", "to": "Node 3", "message": "Data from Node 2 to Node 3"}
        ]
    },
    3: {
        "round": 3,
        "nodes": [
            {"id": "Node 1", "active": True, "alive": True, "data_received": True},
            {"id": "Node 2", "active": True, "alive": True, "data_received": True},
            {"id": "Node 3", "active": False, "alive": True, "data_received": False},
            {"id": "Node 4", "active": False, "alive": True, "data_received": False}
        ],
        "messages": [
            {"from": "Node 3", "to": "Node 4", "message": "Data from Node 3 to Node 4"}
        ]
    },
    4: {
        "round": 4,
        "nodes": [
            {"id": "Node 1", "active": True, "alive": True, "data_received": True},
            {"id": "Node 2", "active": True, "alive": True, "data_received": True},
            {"id": "Node 3", "active": True, "alive": True, "data_received": True},
            {"id": "Node 4", "active": True, "alive": True, "data_received": True}
        ],
        "messages": []
    }
}

@app.post("/start")
async def start_algorithm(nodes_count: int):
    # Инициализация и запуск алгоритма
    return {"message": "Algorithm started!"}

@app.get("/round/{round_number}")
def get_round(round_number: int):
    return round_data.get(round_number, {"nodes": [], "messages": []})