import path from 'path';
import fsp from 'fs-promise';
import { spawn } from 'child-process-promise';

/**
 * Retrieves stack Ouputs from AWS.
 *
 * @returns {undefined}
 */
export default async function runNewman() {
  try {
    this.logger.log('Running Newman...');

    if (!this.config.environment) {
      this.logger.log('No Newman Environment Configuration Found. Proceeding with tests');

      return;
    }

    const collection = this.config.collection;

    if (!collection.json) {
      this.logger.log('No `newman.collection.json` defined. Exiting Newman.');

      return;
    }

    const absoluteCollectionPath = path.resolve(`${process.cwd()}/${collection.json}`);
    const absoluteEnvironmentPath = path.resolve(`${process.cwd()}/.serverless/newman_environment.json`);

    const spawnArgs = ['run', absoluteCollectionPath];

    if (fsp.existsSync(absoluteEnvironmentPath)) {
      spawnArgs.push('-e');
      spawnArgs.push(absoluteEnvironmentPath);
    }

    this.logger.log(`Calling newman with: ${spawnArgs.join(', ')}`);

    const promise = spawn('newman', spawnArgs);
    const child = promise.childProcess;

    const logger = console;

    child.stdout.on('data', (data) => {
      logger.log(data.toString());
    });
    child.stderr.on('data', (data) => {
      logger.log(data.toString());
    });

    await promise;
  } catch (error) {
    this.logger.log(error);
  }
}
