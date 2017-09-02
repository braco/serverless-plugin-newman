import * as BPromise from 'bluebird';
import CLI from 'serverless/lib/classes/CLI';
import { configure } from './lib/configure';
import { runNewman } from './lib/runNewman';
import { validate } from './lib/validate';
import { writeEnv } from './lib/writeEnv';
import {
  INewmanCommands,
  INewmanConfig,
  INewmanHooks,
  INewmanOptions,
  IServerless,
} from "./types";

export default class NewmanPlugin implements INewmanConfig {
  private serverless: IServerless;
  private logger: CLI;
  private options: INewmanOptions;
  private service: any;
  private config: INewmanConfig;
  private commands: INewmanCommands;
  private hooks: INewmanHooks;

  /**
   * Create a new instance.
   *
   * @param {Object} serverless the Serverless instance
   * @param {Object} options    passed in options
   */
  constructor(serverless: IServerless, options: INewmanOptions) {
    this.serverless = serverless;
    this.logger = this.serverless.cli;
    this.options = options;
    this.service = this.serverless.service;
    // this.provider = serverless.getProvider('aws');

    if (this.service.custom) {
      this.config = this.service.custom.newman;
    }

    // make sure that we have access to node_modules/.bin services
    // if (process.env.PATH.indexOf('./node_modules/.bin') === -1) {
    //   process.env.PATH = `./node_modules/.bin:${process.env.PATH}`;
    // }

    this.commands = this.defineCommands();
    this.hooks = this.defineHooks();

    // console.log(JSON.stringify(this.serverless.pluginManager.hooks, null, 2));
  }

  public defineCommands(): INewmanCommands {
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

    return {
      newman: {
        commands: {
          env: {
            usage: 'Write the postman environment file',
            lifecycleEvents: [
              'init',
              'newman',
              'env',
            ],
            options: commonOptions,
          },
          run: {
            usage: 'Runs newman tests',
            lifecycleEvents: [
              'init',
              'newman',
              'run',
            ],
            options: commonOptions,
          },
        },
      },
    };
  }

  public defineHooks(): INewmanHooks {
    return {
      'newman:env:init': () => BPromise.bind(this)
        .then(validate)
        .then(writeEnv),

      'newman:run:init': () => BPromise.bind(this)
        .then(validate)
        .then(runNewman),
    };
  }
}
