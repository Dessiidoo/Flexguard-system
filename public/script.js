const statusText = document.getElementById("statusText");
const riskText = document.getElementById("riskText");
const logWindow = document.getElementById("logWindow");
const orb = document.getElementById("orb");
const hum = document.getElementById("hum");
const glitchSound = document.getElementById("glitch");

// Start hum after any click
document.body.addEventListener("click", () => {
  hum.volume = 0.25;
  hum.play();
});

function addLog(msg) {
  const line = document.createElement("div");
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logWindow.appendChild(line);
  logWindow.scrollTop = logWindow.scrollHeight;
}

async function update() {
  const res = await fetch("/predict");
  const data = await res.json();

  statusText.textContent = data.status;
  riskText.textContent = data.riskScore;

  addLog(`status=${data.status}; risk=${data.riskScore}`);

  // CHAOS EFFECTS
  if (data.riskScore > 80) {
    orb.style.filter = "hue-rotate(180deg) brightness(2)";
    orb.style.animationDuration = "1.2s";
    glitchSound.play();
  } else if (data.riskScore > 50) {
    orb.style.filter = "hue-rotate(90deg) brightness(1.5)";
    orb.style.animationDuration = "2s";
  } else {
    orb.style.filter = "brightness(1)";
    orb.style.animationDuration = "4s";
  }
}

setInterval(update, 1000);

addLog("Flexion initialized...");
addLog("Neural guard waking...");
