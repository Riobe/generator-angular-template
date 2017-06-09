'use strict';

const chalk = require('chalk');

module.exports = {
  info: chalk.green('%s'),
  warn: chalk.bold.yellow('%s'),
  error: chalk.bold.red('%s'),
  verbose: chalk.blue('%s'),
  verbosePriority: chalk.bold.blue('%s'),
  debug: chalk.magenta('%s')
};
