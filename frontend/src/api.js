const BASE_URL = "http://localhost:8000";

export async function startAlgorithm(nodesCount) {
  const response = await fetch(`${BASE_URL}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes_count: nodesCount }),
  });
  return await response.json();
}

export async function fetchRoundData(simulationId, roundNumber) {
  try {
    const response = await fetch(`${BASE_URL}/round/${simulationId}/${roundNumber}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching round data:', error);
    throw error;
  }
}