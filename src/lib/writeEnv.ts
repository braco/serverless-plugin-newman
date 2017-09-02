import * as fsp from 'fs-promise';
import { IEnvFile, IEnvValue, IPluginConfig, ValueType } from "../types";

/**
 * Get the env file template.
 *
 * @param {String} name the service name
 *
 * @returns {IEnvFile} the env file
 */
function getEnvTemplate(name): IEnvFile {
  return {
    name,
    values: [],
    _postman_variable_scope: 'environment',
  };
}

export async function writeEnv() {
  try {
    this.logger.log('Writing postman_environment.json file...');

    const outputs = await fsp.readJson(`${process.cwd()}/.serverless/stack-outputs.json`);
    const config: IPluginConfig = this.config;
    const envFilePath = this.config.environment.file;
    const envFile = getEnvTemplate(this.serverless.service.service);

    // console.log(outputs);
    // console.log(envFilePath);

    config.environment.values.forEach((value: IEnvValue) => {
      if (!value.enabled) {
        return;
      }

      if (value.type === ValueType.OUTPUTS) {
        value.value = outputs[value.value];
      }

      delete value.type;

      envFile.values.push(value);
    });

    await fsp.writeJson(envFilePath, envFile);
  } catch (error) {
    this.logger.log(error);

    throw error;
  }
}
