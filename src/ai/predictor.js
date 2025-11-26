// src/ai/predictor.js

// Simple stub types via comments instead of TS
// SensorData = whatever JSON your sensors send
// Insights = basic risk output

/**
 * Fake risk calculator for now.
 * @param {Object} sensorData
 * @returns {Promise<{ riskScore: number, status: string }>}
 */
export async function predictThreat(sensorData = {}) {
  // Very simple “brain” just to keep Render happy
  const load = Number(sensorData.load ?? 0);
  const stress = Number(sensorData.stress ?? 0);
  const anomalies = Number(sensorData.anomalies ?? 0);

  const rawScore = load * 0.4 + stress * 0.4 + anomalies * 0.2;
  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let status = 'stable';
  if (riskScore > 80) status = 'critical';
  else if (riskScore > 50) status = 'elevated';

  return {
    riskScore,
    status
  };
}
