import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import { env } from './utils/env.js';
import { Contact } from './models/contacts.js';
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

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).send({
        status: 200,
        message: 'Successfully found contacts',
        data: contacts,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send('Internal Server Error.');
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await Contact.findById(contactId);

      if (contact === null) {
        return res.status(404).send({ message: 'Contact not found' });
      }

      res.status(200).send({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send('Internal Server Error.');
    }
  });
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default setupServer;
