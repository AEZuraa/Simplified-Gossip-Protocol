import axios from "axios";

const BASE_URL = "http://localhost:8000"; // FastAPI сервер

export async function fetchRoundData(roundNumber) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/round/${roundNumber}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return null;
    }
  }