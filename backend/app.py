from gossip import GossipAlg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import os
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AlgorithmConfig(BaseModel):
    nodes_count: int
    start_id: int
    message: str

simulations: Dict[str, Dict] = {}

@app.post("/start")
async def start_algorithm(config: AlgorithmConfig):
    if config.nodes_count < 2:
        raise HTTPException(status_code=400, detail="At least 2 nodes required")
    
    simulation_id = str(random.randint(1000, 9999))
    folder_path = os.path.join("logs", f"simulation-{simulation_id}")
    os.makedirs(folder_path, exist_ok=True)
    gossip = GossipAlg(num_nodes = config.nodes_count,simulation_id=simulation_id)
    gossip.inject_data(config.start_id, {"message":config.message})
    gossip.run_until_convergence()
    rounds = gossip.history
    
    simulations[simulation_id] = {
        "config": config,
        "rounds": rounds,
        "current_round": 1
    }
    
    return {"simulation_id": simulation_id}

@app.get("/round/{simulation_id}/{round_number}")
def get_round(simulation_id: str, round_number: int):
    if simulation_id not in simulations:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    simulation = simulations[simulation_id]
    rounds = simulation["rounds"]
    
    if round_number < 1 or round_number > len(rounds):
        raise HTTPException(status_code=404, detail="Round not found")
    
    return rounds[round_number - 1]

@app.get("/simulation/{simulation_id}")
def get_simulation_info(simulation_id: str):
    if simulation_id not in simulations:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    simulation = simulations[simulation_id]
    return {
        "config": simulation["config"],
        "total_rounds": len(simulation["rounds"]),
        "current_round": simulation["current_round"]
    }