import express from 'express';
import bodyParser from 'body-parser';
import { predictThreat } from './ai/predictor.js';
import { logger } from './utilities/logger.js';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('FlexGuard 2.0 API is running');
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err?.message || 'Unknown error');
  res.status(500).send(err?.message || 'Unknown error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
