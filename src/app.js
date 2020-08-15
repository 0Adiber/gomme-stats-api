const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
var favicon = require('serve-favicon')
var path = require('path')

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
app.set('trust proxy', 1);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    data: 'Unofficial GommeHD.net Stats Api\nDocumentation can be found on Github (https://github.com/0Adiber/gomme-stats-api)'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
