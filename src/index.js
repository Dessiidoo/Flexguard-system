// src/index.js
import express from 'express';
import { predictThreat } from './ai/predictor.js';
import { logger } from './utilities/logger.js';

const app = express();
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.send('FlexGuard 2.0 API is running');
});

// Example prediction route
app.post('/predict', async (req, res, next) => {
  try {
    const insights = await predictThreat(req.body);
    res.json(insights);
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, _req, res, _next) => {
  if (err instanceof Error) {
    if (logger && typeof logger.error === 'function') {
      logger.error(err.message);
    } else {
      console.error(err);
    }
    res.status(500).send(err.message);
  } else {
    res.status(500).send('Unknown error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
