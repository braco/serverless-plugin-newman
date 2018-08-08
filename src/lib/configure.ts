import * as fs from 'fs-extra';
import * as Path from 'path';

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
export async function configure() {
  try {
    this.logger.log('Configuring Newman Environment...');

    const stackOutputs = await fs.readJson(Path.resolve(`${process.cwd()}/.serverless/stack-config.json`));

    if (!this.config.environment) {
      this.logger.log('No Newman Environment Configuration Found. Proceeding with tests');

      return;
    }

    const environment = this.config.environment;

    if (!environment.json) {
      this.logger.log('No `newman.environment.json` defined');

      return;
    }

    const absoluteJsonPath = Path.resolve(`${process.cwd()}/${environment.json}`);
    const absoluteRuntimePath = Path.resolve(`${process.cwd()}/.serverless/newman_environment.json`);

    if (!fs.existsSync(absoluteJsonPath)) {
      this.logger.log('The specified newman environment json path does not exist');
      this.logger.log(absoluteJsonPath);

      return;
    }

    const environmentObject = await fs.readJson(absoluteJsonPath);

    environmentObject.values.forEach((element) => {
      let key = element.value;

      if (key.indexOf('{') === 0) {
        key = key.replace(new RegExp('{', 'g'), '');
        key = key.replace(new RegExp('}', 'g'), '');

        element.value = findStackValue(stackOutputs, key);
      }
    });

    await fs.writeJson(absoluteRuntimePath, environmentObject, { spaces: 2 });
  } catch (error) {
    this.logger.log(error);
  }
}
