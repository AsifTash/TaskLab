const morgan = require('morgan');

// Logger middleware
const logger = morgan('dev');

module.exports = logger;

