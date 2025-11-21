// src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { predictThreat } from './ai/predictor';
import { logger } from './utilities/logger';

const app = express();
app.use(bodyParser.json());

// Example route
app.get('/', (_req: Request, res: Response) => {
  res.send('FlexGuard 2.0 API is running');
});

// Error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.error(err.message);
    res.status(500).send(err.message);
  } else {
    res.status(500).send('Unknown error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
