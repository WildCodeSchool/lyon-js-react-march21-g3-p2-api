const express = require('express');
const cors = require('cors');
const { PORT, CORS_ALLOWED_ORIGINS, inTestEnv } = require('./env');

const app = express();
const connection = require('./db-config');

app.use(express.json());

connection.connect((err) =>
  err
    ? console.error(`error connecting: ${err.stack}`)
    : console.log(`connected as id ${connection.threadId}`)
);

app.set('x-powered-by', false);

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});

app.get('/books/:book_id/reviews', (req, res) => {
  const { book_id } = req.params;
  connection
    .promise()
    .query('SELECT * FROM Reviews WHERE book_id= ?', [book_id])
    .then(([results]) => {
      if (results.length) res.send(results);
      else res.sendStatus(404);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.post('/books/:book_id/reviews', (req, res) => {
  const { user_name, message } = req.body;
  const { book_id } = req.params;
  connection
    .promise()
    .query(
      'INSERT INTO Reviews (book_id, user_name, message) VALUES (?, ?, ?)',
      [book_id, user_name, message]
    )
    .then(([results]) => {
      const newMessage = {
        id: results.insertId,
        book_id,
        user_name,
        message,
      };
      res.send(newMessage);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
