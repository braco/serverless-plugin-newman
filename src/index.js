import Promise from 'bluebird';
import validate from './lib/validate';
import configure from './lib/configure';
import runNewman from './lib/runNewman';

class Newman {
  /**
   * Create a new instance.
   *
   * @param {Object} serverless the Serverless instance
   * @param {Object} options    passed in options
   */
  constructor(serverless, options) {
    this.serverless = serverless;
    this.logger = this.serverless.cli;
    this.options = options;
    this.service = this.serverless.service;
    this.provider = serverless.getProvider('aws');

    if (this.service.custom) {
      this.config = this.service.custom.newman;
    }

    const commonOptions = {
      stage: {
        usage: 'Stage of the service',
        shortcut: 's',
      },
      region: {
        usage: 'Region of the service',
        shortcut: 'r',
      },
      verbose: {
        usage: 'Show all stack events during deployment',
        shortcut: 'v',
      },
    };

    this.commands = {
      newman: {
        usage: 'Runs newman tests',
        lifecycleEvents: [
          'validate',
          'configure',
          'newman',
        ],
        options: commonOptions,
      },
    };

    this.hooks = {
      'newman:configure': () => Promise.bind(this)
        .then(validate)
        .then(configure)
        .then(runNewman),

      // 'newman:run': () => Promise.bind(this)
      //   .then(validate)
      //   .then(configure)
      //   .then(runNewman),
    };
  }
}

module.exports = Newman;
