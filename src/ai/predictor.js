export async function predictThreat() {
  const load = Math.random() * 100;
  const stress = Math.random() * 100;
  const anomalies = Math.random() * 20;

  const rawScore = load * 0.4 + stress * 0.4 + anomalies * 0.2;
  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let status = 'stable';
  if (riskScore > 80) status = 'critical';
  else if (riskScore > 50) status = 'elevated';

  return {
    riskScore,
    status,
    timestamp: new Date().toISOString(),
    load: load.toFixed(1),
    stress: stress.toFixed(1),
    anomalies: anomalies.toFixed(1)
  };
}
