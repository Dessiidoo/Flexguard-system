// src/client.ts

import { getHeartRate, getMotion } from './sensors/motions';
import { getEnvironment } from './sensors/environmental';
import { predictThreat } from './ai/predictor';
import { triggerDefense } from './defense/reactivate';
import { simulateAirburst } from './defense/airburst';

export async function simulateClientCycle() {
  const heartRate = getHeartRate();
  const motion = getMotion();
  const environment = getEnvironment();

  const threat = await predictThreat({ heartRate, motion, environment });
  const defenseAction = triggerDefense(threat);
  const airburstLog = simulateAirburst(heartRate + motion);

  return {
    heartRate,
    motion,
    environment,
    threat,
    defenseAction,
    airburstLog,
  };
}

// Example usage
(async () => {
  const cycle = await simulateClientCycle();
  console.table(cycle);
})();
