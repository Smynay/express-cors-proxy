const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const dotenv = require('dotenv');
const cors = require('cors');
const {createProxyMiddleware} = require('http-proxy-middleware');

const {TARGET} = require('./common/config');

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
morganBody(app);

app.use('/', (req, res, next) => {
  console.dir(req.headers);
  next();
});

app.use('/api', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/',
  },
}));

process
    .on('unhandledRejection', (reason, promise) => {
      console.log('Unhandled Rejection at: ', {
        stack: reason.stack,
        promise,
      });
    })
    .on('uncaughtException', (error) => {
      console.log('Uncaught Exception thrown', {stack: error.stack});
      process.exit(1);
    });

module.exports = app;
