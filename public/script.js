const coreOrb = document.getElementById("coreOrb");
const radar = document.getElementById("radar");
const logWindow = document.getElementById("logWindow");

const topStatus = document.getElementById("topStatus");
const metricThreat = document.getElementById("metricThreat");
const metricLoad = document.getElementById("metricLoad");
const metricStress = document.getElementById("metricStress");
const metricAnom = document.getElementById("metricAnom");
const metricNeural = document.getElementById("metricNeural");
const metricLink = document.getElementById("metricLink");

const diagPanel = document.getElementById("diagPanel");
const diagBody = document.getElementById("diagBody");
const systemPanel = document.getElementById("systemPanel");
const diagToggle = document.getElementById("diagPanelToggle");
const systemToggle = document.getElementById("systemPanelToggle");

let overrideMode = null; // 'critical' | 'overload' | null
let longPressTimer = null;

// Helper: log lines
function addLog(msg) {
  const line = document.createElement("div");
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logWindow.appendChild(line);
  logWindow.scrollTop = logWindow.scrollHeight;
}

// Helper: set core + status color
function setVisualState(status, riskScore) {
  coreOrb.classList.remove("critical", "elevated", "overload");

  topStatus.classList.remove("stable", "elevated", "critical");
  if (status === "critical") {
    coreOrb.classList.add("critical");
    topStatus.classList.add("critical");
    topStatus.textContent = "STATUS: CRITICAL";
  } else if (status === "elevated") {
    coreOrb.classList.add("elevated");
    topStatus.classList.add("elevated");
    topStatus.textContent = "STATUS: ELEVATED";
  } else {
    topStatus.classList.add("stable");
    topStatus.textContent = "STATUS: STABLE";
  }

  if (typeof riskScore === "number") {
    metricThreat.textContent = `${riskScore}`;
  }
}

// Backend polling
async function fetchThreatSample() {
  try {
    // adjust this endpoint name to your backend; earlier we set /api/threat
    const res = await fetch("/api/threat");
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();

    return {
      riskScore: Number(data.riskScore ?? 0),
      status: data.status ?? "stable",
      load: Number(data.load ?? (Math.random() * 100)),
      stress: Number(data.stress ?? (Math.random() * 100)),
      anomalies: Number(data.anomalies ?? (Math.random() * 5))
    };
  } catch (e) {
    // fallback when backend not responding
    const load = Math.random() * 100;
    const stress = Math.random() * 100;
    const anomalies = Math.random() * 10;
    const raw = load * 0.4 + stress * 0.4 + anomalies * 0.2;
    const riskScore = Math.max(0, Math.min(100, Math.round(raw)));
    let status = "stable";
    if (riskScore > 80) status = "critical";
    else if (riskScore > 50) status = "elevated";

    return { riskScore, status, load, stress, anomalies };
  }
}

// Radar blip
function spawnBlip(xPercent, yPercent) {
  const blip = document.createElement("div");
  blip.className = "radar-blip";
  blip.style.left = `${xPercent}%`;
  blip.style.top = `${yPercent}%`;
  radar.appendChild(blip);
  setTimeout(() => blip.remove(), 2000);
}

// Main update tick
async function updateFromBackend() {
  if (overrideMode) return; // manual drama mode in control

  const sample = await fetchThreatSample();

  metricLoad.textContent = `${sample.load.toFixed(1)}%`;
  metricStress.textContent = `${sample.stress.toFixed(1)}%`;
  metricAnom.textContent = `${sample.anomalies.toFixed(1)}`;

  let neural = "BALANCED";
  if (sample.stress > 75 || sample.load > 75) neural = "STRUGGLING";
  if (sample.stress < 35 && sample.load < 35) neural = "CALM";
  metricNeural.textContent = neural;

  setVisualState(sample.status, sample.riskScore);
  addLog(`Auto scan: status=${sample.status}, risk=${sample.riskScore}`);
}

// Long-range scan every few minutes
function longRangeScan() {
  addLog("Long-range sweep initiated…");
  spawnBlip(25 + Math.random() * 50, 25 + Math.random() * 50);
  setTimeout(() => addLog("Long-range sweep complete. No anomalies outside perimeter."), 2500);
}

// CORE interactions

coreOrb.addEventListener("pointerdown", () => {
  longPressTimer = setTimeout(() => {
    triggerOverload();
  }, 1100);
});

coreOrb.addEventListener("pointerup", () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
    if (!overrideMode) {
      triggerCritical();
    }
  }
});

coreOrb.addEventListener("pointerleave", () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
});

function triggerCritical() {
  overrideMode = "critical";
  coreOrb.classList.add("critical");
  addLog("USER OVERRIDE: manual critical injection.");
  topStatus.classList.remove("stable", "elevated");
  topStatus.classList.add("critical");
  topStatus.textContent = "STATUS: CRITICAL (MANUAL)";
  metricThreat.textContent = "92";
  metricAnom.textContent = (3 + Math.floor(Math.random() * 4)).toString();

  setTimeout(() => {
    overrideMode = null;
  }, 4000);
}

function triggerOverload() {
  overrideMode = "overload";
  coreOrb.classList.remove("critical", "elevated");
  coreOrb.classList.add("overload");
  addLog("!!! OVERLOAD: Core containment compromised. Flexion resisting…");

  topStatus.classList.remove("stable", "elevated", "critical");
  topStatus.textContent = "STATUS: OVERLOAD";

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      spawnBlip(20 + Math.random() * 60, 20 + Math.random() * 60);
    }, i * 250);
  }

  setTimeout(() => {
    coreOrb.classList.remove("overload");
    overrideMode = null;
    topStatus.textContent = "STATUS: RECOVERING";
    addLog("Core resealed. Returning to autonomous control.");
  }, 4000);
}

// Radar click: add threat ping
radar.addEventListener("click", (e) => {
  const rect = radar.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  spawnBlip(x, y);
  addLog("Manual threat marker added on radar.");
});

// Panel toggles
let diagOpen = false;
let systemOpen = false;

diagToggle.addEventListener("click", () => {
  diagOpen = !diagOpen;
  diagPanel.style.display = diagOpen ? "flex" : "none";
  if (diagOpen) {
    diagBody.textContent =
      "Neural guard tracking microshifts in load, stress, and anomaly density.\n" +
      "Flexion is simulating pre-emptive countermeasures.";
  }
});

systemToggle.addEventListener("click", () => {
  systemOpen = !systemOpen;
  systemPanel.style.display = systemOpen ? "flex" : "none";
  if (systemOpen) {
    addLog("System graph expanded. Core link routes visible.");
  }
});

// Init
addLog("Flexion boot sequence started…");
addLog("Neural guard waking up…");

// schedule loops
setInterval(updateFromBackend, 3000);
setInterval(longRangeScan, 180000); // every 3 min

// first tick
updateFromBackend();
