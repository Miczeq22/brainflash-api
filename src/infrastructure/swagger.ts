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
          type: 'http',
          in: 'header',
          name: 'Authorization',
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
