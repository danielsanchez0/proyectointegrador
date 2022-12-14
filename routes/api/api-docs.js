"use strict";

const express = require("express");
const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "documentation API",
            description: "API documentation: sistema de manejo de espacio, universidad de caldas",
            contact: {
                name: "Daniel Fernando Sanchez, Juan Camilo Henao, Oscar Eduardo Buritica",
                url: "Universidad De Caldas"
            },
            servers: ["http://localhost:5000"]
        }
    },
    basePath: "/",
    apis: ["./routes/*.js", "./models/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;