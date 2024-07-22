import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import { env } from './utils/env.js';
import ContactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/errorHandler.js';

const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

function setupServer() {
  const app = express();
  const port = env('PORT', 3000);

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use(ContactsRouter);
  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default setupServer;
