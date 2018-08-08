# Newman Serverless Plugin

A serverless plugin for newman.

## Dependencies

* This plugin is dependent on the output of [Stack Config Plugin for Serverless](https://www.npmjs.com/package/serverless-plugin-stack-config) for its environment configuration

## Features

* `newman env` - This writes the postman environment file with the configured values
* `newman run` - This executes the newman postman tests

## Usage

Add the plugin to your `serverless.yml` like the following:

### serverless.yml

```yaml
provider:
...

plugins:
  - serverless-plugin-newman

custom:
    collection:
      file: test/postman_collection.json
    environment:
      file: test/deploy.postman_environment.json
      values:
        - key: endpoint
          enabled: true
          value: ServiceEndpoint
          type: OUTPUTS

functions:
...
resources:
...
```

### # Configure Environment

```shell
serverless newman env --stage dev --region eu-west-1
```

### # Run Newman

```shell
serverless newman run --stage dev --region eu-west-1
```

## License

MIT
