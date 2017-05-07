# Newman Serverless Plugin

A serverless plugin for newman.

## Dependencies

* This plugin is dependent on the output of [Stack Config Plugin for Serverless](https://www.npmjs.com/package/serverless-plugin-stack-config) for its environment configuration

## Features

* `newman` - This executes the newman postman tests

## Usage

Add the plugin to your `serverless.yml` like the following:

### serverless.yml:
```yaml
provider:
...

plugins:
  - serverless-plugin-newman

custom:
  newman:
    collection:
      json: test/integration/postman_collection.json
    environment:
      json: test/integration/postman_environment.json

functions:
...
resources:
...
```

### shell command:
```shell
serverless newman --stage dev --region eu-west-1
```

## License

MIT
