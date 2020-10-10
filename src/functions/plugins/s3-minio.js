const { Client } = require('minio');
const functionHelper = require('serverless-offline/src/functionHelper');
const LambdaContext = require('serverless-offline/src/LambdaContext');
const url = require('url');

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.options = options;

    this.commands = {};

    this.hooks = {
      's3:start:startHandler': this.startHandler.bind(this),
      'before:offline:start:init': this.startHandler.bind(this),
      'before:offline:start': this.startHandler.bind(this),
    };
  }

  getClient() {
    const parsedUrl = url.parse(process.env.S3_ENDPOINT);

    return new Client({
      endPoint: parsedUrl.hostname,
      port: Number(parsedUrl.port),
      useSSL: parsedUrl.protocol.startsWith('https'),
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    });
  }

  startHandler() {
    this.client = this.getClient();
    this.eventHandlers = this.getEventHandlers();

    this.subscribe();
  }

  subscribe() {
    this.eventHandlers
      .filter((handler) => handler.name === process.env.S3_BUCKET)
      .forEach((handler) => {
        handler.listener.on('notification', async (record) => {
          this.serverless.cli.log(JSON.stringify(await handler.func(record)));
        });
      });
  }

  getEventHandlers() {
    const eventHandlers = [];

    Object.keys(this.service.functions).forEach((key) => {
      const serviceFunction = this.service.getFunction(key);

      serviceFunction.events
        .filter((event) => typeof event['s3'] !== 'undefined')
        .forEach((event) => {
          const func = (s3Event) => {
            try {
              const handler = functionHelper.createHandler(
                functionHelper.getFunctionOptions(
                  serviceFunction,
                  key,
                  this.serverless.config.servicePath,
                  this.service.provider.runtime,
                ),
                this.options,
              );

              return handler(s3Event, new LambdaContext(serviceFunction, this.service.provider));
            } catch (e) {
              console.error('Error while running handler', e);
            }
          };

          const listener = this.client.listenBucketNotification(event.s3, '', '', [event.event]);

          eventHandlers.push(this.buildEventHandler(event.s3, func, listener));
        });
    });

    return eventHandlers;
  }

  buildEventHandler(name, func, listener) {
    return {
      name,
      func,
      listener,
    };
  }
}

module.exports = ServerlessPlugin;
