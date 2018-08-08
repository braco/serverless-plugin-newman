import { spawn } from 'child-process-promise';
import * as fs from 'fs-extra';
import * as Path from 'path';

const logger = console;

/**
 * Retrieves stack Ouputs from AWS.
 *
 * @returns {undefined}
 */
export async function runNewman() {
  try {
    this.logger.log('Running Newman...');

    if (!this.config.environment) {
      this.logger.log('No Newman Environment Configuration Found. Proceeding with tests');

      return;
    }

    const collection = this.config.collection;
    const environment = this.config.environment || '';

    if (!collection.file) {
      this.logger.log('No `newman.collection.json` defined. Exiting Newman.');

      return;
    }

    const absoluteCollectionPath = Path.resolve(`${process.cwd()}/${collection.file}`);
    const absoluteEnvironmentPath = Path.resolve(`${process.cwd()}/${environment.file}`);

    const spawnArgs = ['run', absoluteCollectionPath];

    if (fs.existsSync(absoluteEnvironmentPath)) {
      spawnArgs.push('-e');
      spawnArgs.push(absoluteEnvironmentPath);
    }

    const promise = spawn('newman', spawnArgs);
    const child = promise.childProcess;

    child.stdout.on('data', (data) => {
      logger.log(data.toString());
    });
    child.stderr.on('data', (data) => {
      logger.log(data.toString());
    });

    await promise;
  } catch (error) {
    this.logger.log(error);

    throw error;
  }
}
