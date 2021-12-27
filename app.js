const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { restart } = require('nodemon');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const xss = require('xss-clean');
const errorController = require('./controllers/errorController');
const ErrorHandler = require('./utils/errorHandler');
const route = require('./routes/route');
const userRoad = require('./routes/userRoad');
const pageRoute = require('./routes/pageRoute');
const app = express();
const options = require('./controllers/adminBroOptions');
const buildAdminRouter = require('./routes/adminBroRouter');
const { default: AdminBro } = require('admin-bro');

app.enable('trust proxy');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Za duzo wejść na stronę z tego adresu IP. Spróbuj ponownie za godzinę!',
});
app.use('/api', limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(bodyParser.json());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());
app.use(compression());
const admin = new AdminBro(options);
const router = buildAdminRouter(admin);
app.use(admin.options.rootPath, router);
app.use('/', pageRoute);
app.use('/remonty', route);
app.use('/remonty/users', userRoad);

app.all('*', (req, res, next) => {
  next(
    new ErrorHandler(
      `Brak takiego adresu  ${req.originalUrl} na tym serwerze!`,
      404
    )
  );
});
app.use(errorController);
module.exports = app;
