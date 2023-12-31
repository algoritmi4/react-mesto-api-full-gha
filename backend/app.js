const express = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const helmet = require('helmet');

const ratelimit = require('express-rate-limit');

const { celebrate, Joi, errors } = require('celebrate');

const NotFoundError = require('./errors/NotFoundError');

const RegularURL = require('./utils/RegularURL');

const { login, logOut, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000, DB_URL = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;

const app = express();

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);
app.use(limiter);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use('/logout', logOut);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegularURL),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Передан неправильный путь'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
