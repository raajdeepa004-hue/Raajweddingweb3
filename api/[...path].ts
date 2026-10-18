import express from 'express';
import { apiRouter } from '../src/api/router';

const app = express();

app.use('/api', apiRouter);
app.use('/', apiRouter);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
