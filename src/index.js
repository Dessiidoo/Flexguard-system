import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { predictThreat } from './ai/predictor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve the UI from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Main UI page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API route for threat prediction
app.get('/api/threat', async (_req, res) => {
  const randomData = {
    load: Math.random() * 100,
    stress: Math.random() * 100,
    anomalies: Math.random() * 100
  };

  const result = await predictThreat(randomData);
  res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
