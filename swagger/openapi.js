const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Cultural Heritage API",
    version: "1.0.0",
    description: "API documentation for the Cultural Heritage Management System.",
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current API server",
    },
  ],
  tags: [
    { name: "Authentication" },
    { name: "Files" },
    { name: "Users" },
    { name: "Historical Sites" },
    { name: "Lost Artefacts" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token.",
      },
    },
    schemas: {
      SignUp: {
        type: "object",
        required: ["firstname", "lastname", "email", "password", "confirmPassword"],
        properties: {
          firstname: { type: "string", example: "John" },
          lastname: { type: "string", example: "Smith" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          confirmPassword: { type: "string", minLength: 8 },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      Message: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  paths: {},
};

const jsonBody = (schema) => ({
  required: true,
  content: {
    "application/json": {
      schema: schema || {
        type: "object",
        additionalProperties: true,
      },
    },
  },
});

const standardResponses = {
  "200": { description: "Successful operation." },
  "400": { description: "Invalid request." },
  "401": { description: "Authentication required or invalid token." },
  "404": { description: "Resource not found." },
  "500": { description: "Internal server error." },
};

function crudPaths(path, tag, schemaName) {
  const schema = { $ref: `#/components/schemas/${schemaName}` };

  return {
    [path]: {
      get: {
        tags: [tag],
        summary: `Get all ${tag.toLowerCase()}`,
        security: [{ BearerAuth: [] }],
        responses: standardResponses,
      },
      post: {
        tags: [tag],
        summary: `Create ${tag.toLowerCase().replace(/s$/, "")}`,
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody(schema),
        responses: {
          ...standardResponses,
          "201": { description: "Resource created successfully." },
        },
      },
    },
    [`${path}/{id}`]: {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Resource ID.",
        },
      ],
      get: {
        tags: [tag],
        summary: `Get ${tag.toLowerCase()} by ID`,
        security: [{ BearerAuth: [] }],
        responses: standardResponses,
      },
      put: {
        tags: [tag],
        summary: `Update ${tag.toLowerCase()}`,
        security: [{ BearerAuth: [] }],
        requestBody: jsonBody({
          type: "object",
          additionalProperties: true,
        }),
        responses: standardResponses,
      },
      delete: {
        tags: [tag],
        summary: `Delete ${tag.toLowerCase()}`,
        security: [{ BearerAuth: [] }],
        responses: standardResponses,
      },
    },
  };
}

// Authentication
openapi.paths["/auth/sign-up"] = {
  post: {
    tags: ["Authentication"],
    summary: "Register a new user",
    requestBody: jsonBody({ $ref: "#/components/schemas/SignUp" }),
    responses: standardResponses,
  },
};

openapi.paths["/auth/login"] = {
  post: {
    tags: ["Authentication"],
    summary: "User login",
    requestBody: jsonBody({ $ref: "#/components/schemas/Login" }),
    responses: standardResponses,
  },
};

openapi.paths["/auth/google-oauth"] = {
  get: {
    tags: ["Authentication"],
    summary: "Start Google OAuth authentication",
    responses: {
      "302": { description: "Redirect to Google authentication." },
    },
  },
};

openapi.paths["/auth/google-callback"] = {
  get: {
    tags: ["Authentication"],
    summary: "Google OAuth callback",
    parameters: [
      {
        name: "code",
        in: "query",
        required: false,
        schema: { type: "string" },
      },
    ],
    responses: standardResponses,
  },
};

// JWT-protected CRUD resources
Object.assign(openapi.paths, crudPaths("/users", "Users", "Message"));

// Files
openapi.paths["/files/upload-single"] = {
  post: {
    tags: ["Files"],
    summary: "Upload a single file",
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["file"],
            properties: {
              file: { type: "string", format: "binary" },
            },
          },
        },
      },
    },
    responses: standardResponses,
  },
};

openapi.paths["/files/upload-multiple"] = {
  post: {
    tags: ["Files"],
    summary: "Upload multiple files",
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["files"],
            properties: {
              files: {
                type: "array",
                items: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
    responses: standardResponses,
  },
};

openapi.paths["/files/getallfile"] = {
  get: {
    tags: ["Files"],
    summary: "Get all uploaded files",
    security: [{ BearerAuth: [] }],
    responses: standardResponses,
  },
};

openapi.paths["/files/{id}"] = {
  delete: {
    tags: ["Files"],
    summary: "Delete a file",
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: standardResponses,
  },
};

// Historical sites
openapi.paths["/historical_sites"] = {
  get: {
    tags: ["Historical Sites"],
    summary: "Get all historical sites",
    responses: standardResponses,
  },
  post: {
    tags: ["Historical Sites"],
    summary: "Create a historical site",
    security: [{ BearerAuth: [] }],
    requestBody: jsonBody(),
    responses: standardResponses,
  },
};

openapi.paths["/historical_sites/enabled"] = {
  get: {
    tags: ["Historical Sites"],
    summary: "Get enabled historical sites",
    responses: standardResponses,
  },
};

openapi.paths["/historical_sites/{id}"] = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  get: {
    tags: ["Historical Sites"],
    summary: "Get a historical site by ID",
    responses: standardResponses,
  },
  put: {
    tags: ["Historical Sites"],
    summary: "Update a historical site",
    security: [{ BearerAuth: [] }],
    requestBody: jsonBody(),
    responses: standardResponses,
  },
  delete: {
    tags: ["Historical Sites"],
    summary: "Delete a historical site",
    security: [{ BearerAuth: [] }],
    responses: standardResponses,
  },
};

openapi.paths["/historical_sites/{id}/upload"] = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  post: {
    tags: ["Historical Sites"],
    summary: "Upload images for a historical site (maximum 20 images, 5 MB each)",
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["images"],
            properties: {
              images: {
                type: "array",
                maxItems: 20,
                items: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
    responses: standardResponses,
  },
  delete: {
    tags: ["Historical Sites"],
    summary: "Delete an image from a historical site",
    security: [{ BearerAuth: [] }],
    requestBody: jsonBody({
      type: "object",
      properties: {
        imagePath: { type: "string" },
      },
    }),
    responses: standardResponses,
  },
};

// Lost artefacts
openapi.paths["/lost_artefact"] = {
  get: {
    tags: ["Lost Artefacts"],
    summary: "Get all lost artefacts",
    parameters: [
      { name: "join", in: "query", schema: { type: "string" } },
      { name: "title", in: "query", schema: { type: "string" } },
      { name: "objectype", in: "query", schema: { type: "string" } },
      { name: "period", in: "query", schema: { type: "string" } },
      { name: "style", in: "query", schema: { type: "string" } },
    ],
    responses: standardResponses,
  },
  post: {
    tags: ["Lost Artefacts"],
    summary: "Create a lost artefact",
    security: [{ BearerAuth: [] }],
    requestBody: jsonBody(),
    responses: standardResponses,
  },
};

openapi.paths["/lost_artefact/enabled"] = {
  get: {
    tags: ["Lost Artefacts"],
    summary: "Get enabled lost artefacts",
    responses: standardResponses,
  },
};

openapi.paths["/lost_artefact/{id}"] = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  get: {
    tags: ["Lost Artefacts"],
    summary: "Get a lost artefact by ID",
    responses: standardResponses,
  },
  put: {
    tags: ["Lost Artefacts"],
    summary: "Update a lost artefact",
    security: [{ BearerAuth: [] }],
    requestBody: jsonBody(),
    responses: standardResponses,
  },
  delete: {
    tags: ["Lost Artefacts"],
    summary: "Delete a lost artefact",
    security: [{ BearerAuth: [] }],
    responses: standardResponses,
  },
};

openapi.paths["/lost_artefact/{id}/upload"] = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  post: {
    tags: ["Lost Artefacts"],
    summary: "Upload an image for a lost artefact (5 MB maximum)",
    security: [{ BearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["image"],
            properties: {
              image: { type: "string", format: "binary" },
            },
          },
        },
      },
    },
    responses: standardResponses,
  },
  delete: {
    tags: ["Lost Artefacts"],
    summary: "Delete an image from a lost artefact",
    security: [{ BearerAuth: [] }],
    responses: standardResponses,
  },
};

module.exports = openapi;
