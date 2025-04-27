from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import random
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AlgorithmConfig(BaseModel):
    nodes_count: int

simulations: Dict[str, Dict] = {}

def simulate_gossip_protocol(nodes_count: int):
    """Генерирует данные для симуляции gossip protocol с одним сообщением"""
    rounds = []
    node_ids = [f"Node {i+1}" for i in range(nodes_count)]
    message = "Gossip Message" 
    
    # Начальное состояние: первый узел активен и знает сообщение
    initial_nodes = [
        {
            "id": node_ids[i],
            "active": i == 0,
            "alive": True,
            "has_message": i == 0
        }
        for i in range(nodes_count)
    ]
    
    rounds.append({
        "round": 1,
        "finished": False,
        "nodes": initial_nodes,
        "messages": []
    })
    
    # Симулируем раунды распространения информации
    max_rounds = nodes_count * 2  # Максимальное количество раундов
    all_know_message = False
    
    for round_num in range(2, max_rounds + 1):
        prev_round = rounds[-1]
        current_nodes = [node.copy() for node in prev_round["nodes"]]
        current_messages = []
        
        # Активные узлы, знающие сообщение, отправляют его случайным соседям
        for node in current_nodes:
            if node["active"] and node["alive"] and node["has_message"]:
                # Выбираем случайного получателя
                possible_receivers = [
                    n for n in current_nodes 
                    if n["id"] != node["id"] and n["alive"] and not n["has_message"]
                ]
                
                if possible_receivers:
                    receiver = random.choice(possible_receivers)
                    current_messages.append({
                        "from": node["id"],
                        "to": receiver["id"],
                        "message": message
                    })
                    
                    # Помечаем получателя для обновления после раунда
                    receiver["_will_receive"] = True
        
        # Обновляем состояние узлов после раунда
        for node in current_nodes:
            if "_will_receive" in node:
                node["has_message"] = True
                node["active"] = True  # Узел становится активным после получения сообщения
                del node["_will_receive"]
        
        # Проверяем завершение (все узлы знают сообщение)
        all_know_message = all(
            node["has_message"] or not node["alive"] 
            for node in current_nodes
        )
        
        rounds.append({
            "round": round_num,
            "finished": all_know_message,
            "nodes": current_nodes,
            "messages": current_messages
        })
        
        if all_know_message:
            break
    
    return rounds

@app.post("/start")
async def start_algorithm(config: AlgorithmConfig):
    if config.nodes_count < 2:
        raise HTTPException(status_code=400, detail="At least 2 nodes required")
    
    simulation_id = str(random.randint(1000, 9999))
    rounds = simulate_gossip_protocol(config.nodes_count)
    
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