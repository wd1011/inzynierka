const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ejs = require('ejs');

process.on('uncaughtException', (err) => {
  console.log('Nieznany blad!  Zamykanie apliakcji...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Połączono z MongoDB'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Aplikacja działa na porcie ${port}...`);
});
process.on('Nieznany blad', (err) => {
  console.log('Nieznany blad!  Zamykanie apliakcji');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
