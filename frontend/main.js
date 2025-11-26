const riskScoreEl = document.getElementById('riskScore');
const ctx = document.getElementById('chart').getContext('2d');

let riskData = [0];
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(20).fill(''),
    datasets: [{
      label: 'Threat Level',
      borderColor: '#0ff',
      data: riskData,
      borderWidth: 2
    }]
  },
  options: { animation: false, scales: { y: { min: 0, max: 100 } } }
});

async function fetchData() {
  const res = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ load: Math.random() * 100, stress: Math.random() * 100, anomalies: Math.random() * 100 })
  });
  const data = await res.json();
  const score = data.riskScore ?? 0;
  riskScoreEl.textContent = score;
  chart.data.datasets[0].data.push(score);
  chart.data.datasets[0].data.shift();
  chart.update();
}

setInterval(fetchData, 2000);
