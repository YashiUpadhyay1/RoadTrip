/**
 * @fileoverview Swagger configuration for API documentation.
 * Sets up Swagger UI at /api-docs for interactive API exploration.
 * @module swagger
 */

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Swagger setup function.
 * @param {import('express').Application} app - Express application instance.
 */
const setupSwagger = (app) => {
  // Swagger definition and metadata
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'RoadTrip Planner API',
        version: '1.0.0',
        description: 'API documentation for the RoadTrip Planner backend',
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development Server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ['./routes/*.js', './controllers/*.js', './models/*.js'], // Scans these for JSDoc comments
  };

  const swaggerSpec = swaggerJsDoc(swaggerOptions);

  // Swagger UI endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('📘 Swagger Docs available at: http://localhost:5000/api-docs');
};

module.exports = setupSwagger;
