import fsp from 'fs-promise';
import path from 'path';

/**
 * Find a value for a key in the stack outputs.
 *
 * @param {Object} stackOutputs the stack config object
 * @param {String} key          the key to search by
 *
 * @returns {String} the value if found
 */
function findStackValue(stackOutputs, key) {
  let value;

  Object.keys(stackOutputs).some((output) => {
    if (output === key) {
      value = stackOutputs[output];

      return true;
    }

    return false;
  });

  return value;
}

/**
 * Configure service for deployment.
 *
 * @returns {undefined}
 */
export default async function configure() {
  try {
    this.logger.log('Configuring Newman Environment...');

    const stackOutputs = await fsp.readJson(path.resolve(`${process.cwd()}/.serverless/stack-config.json`));

    if (!this.config.environment) {
      this.logger.log('No Newman Environment Configuration Found. Proceeding with tests');

      return;
    }

    const environment = this.config.environment;

    if (!environment.json) {
      this.logger.log('No `newman.environment.json` defined');

      return;
    }

    const absoluteJsonPath = path.resolve(`${process.cwd()}/${environment.json}`);
    const absoluteRuntimePath = path.resolve(`${process.cwd()}/.serverless/newman_environment.json`);

    if (!fsp.existsSync(absoluteJsonPath)) {
      this.logger.log('The specified newman environment json path does not exist');
      this.logger.log(absoluteJsonPath);

      return;
    }

    const environmentObject = await fsp.readJson(absoluteJsonPath);

    environmentObject.values.forEach((element) => {
      let key = element.value;

      if (key.indexOf('{') === 0) {
        key = key.replace(new RegExp('{', 'g'), '');
        key = key.replace(new RegExp('}', 'g'), '');

        element.value = findStackValue(stackOutputs, key);
      }
    });

    await fsp.writeJson(absoluteRuntimePath, environmentObject);
  } catch (error) {
    this.logger.log(error);
  }
}
