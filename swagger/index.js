const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi");

function setupSwagger(app) {
  app.use(
    "/culture_docs",
    swaggerUi.serve,
    swaggerUi.setup(openapi)
  );
}

module.exports = setupSwagger;
