import CLI from 'serverless/lib/classes/CLI';

export interface INewmanConfig {
  defineCommands(): INewmanCommands;
  defineHooks(): INewmanHooks;
}

export interface INewmanCommands {
  newman: {
    commands: {
      run: any;
      env: any;
    };
  };
}

// tslint:disable-next-line:no-empty-interface
export interface INewmanHooks {
  // 'newman:env:getValues';
  // 'outputs:download:download';
}

// export interface IRunConfig {
//   // s3: IS3BackupConfig;
// }

// export interface IEnvConfig {

// }

export interface IPluginConfig {
  collection: {
    file: string;
  };
  environment: {
    file: string;
    values: IEnvValue[];
  };
}

export interface INewmanOptions {
  env: string;
  region: string;
  path?: string;
}

export interface IEnvFile {
  name: string;
  values: IEnvValue[];
  _postman_variable_scope: string;
}

export interface IEnvValue {
  enabled: boolean;
  key: string;
  value: string;
  type: string;
}

export enum ValueType {
  OUTPUTS = 'OUTPUTS',
  STRING = 'STRING',
}
