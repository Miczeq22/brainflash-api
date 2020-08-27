const jsdoc = require('swagger-jsdoc');

export const swaggerDocs = jsdoc({
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Brainflash API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Auth-Token',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/api/**/actions/*.ts', 'src/api/**/actions/*.js'],
});
