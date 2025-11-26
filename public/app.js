async function updateOrb() {
  try {
    const res = await fetch('/api/threat');
    const data = await res.json();

    const orb = document.getElementById('orb');
    const status = document.getElementById('status');
    const score = document.getElementById('score');

    status.textContent = `Status: ${data.status}`;
    score.textContent = `Risk Score: ${data.riskScore}`;

    orb.className = '';

    if (data.status === 'critical') orb.classList.add('status-critical');
    else if (data.status === 'elevated') orb.classList.add('status-elevated');
    else orb.classList.add('status-stable');

  } catch (err) {
    console.error(err);
  }
}

// refresh every 2 seconds
setInterval(updateOrb, 2000);

// initial load
updateOrb();
