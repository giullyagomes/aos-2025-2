import "dotenv/config";
import cors from "cors";
import express from "express";

import databaseModels, { sequelize as databaseConnection } from "./models";
import apiRoutes from "./routes";

const serverApp = express();
serverApp.set("trust proxy", true);

var corsConfiguration = {
  origin: ["http://example.com", "*"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
serverApp.use(cors(corsConfiguration));

serverApp.use((request, response, nextMiddleware) => {
  console.log(`${request.method} ${request.path} - ${request.ip}`);
  nextMiddleware();
});

// Código para conseguir extrair o conteúdo do body da mensagem HTTP
// e armazenar na propriedade req.body (utiliza o body-parser)
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: true }));

// Código para injetar no context o usuário que está logado e os models
serverApp.use(async (request, response, nextMiddleware) => {
  request.context = {
    models: databaseModels,
    me: await databaseModels.User.findByPk(1),
  };
  nextMiddleware();
});

serverApp.use("/", apiRoutes.root);
serverApp.use("/session", apiRoutes.session);
serverApp.use("/users", apiRoutes.user);
serverApp.use("/messages", apiRoutes.message);

const serverPort = process.env.PORT ?? 3000;

const shouldEraseDatabase = process.env.ERASE_DATABASE === "true";

databaseConnection.sync({ force: shouldEraseDatabase }).then(async () => {
  if (shouldEraseDatabase) {
    initializeUsersWithMessages();
  }

  serverApp.listen(serverPort, () => {
    console.log(`Application server listening on port ${serverPort}!`);
  });
});

const initializeUsersWithMessages = async () => {
  await databaseModels.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      messages: [
        {
          text: "Published the Road to learn React",
        },
        {
          text: "Published also the Road to learn Express + PostgreSQL",
        },
      ],
    },
    {
      include: [databaseModels.Message],
    }
  );

  await databaseModels.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      messages: [
        {
          text: "Happy to release ...",
        },
        {
          text: "Published a complete ...",
        },
      ],
    },
    {
      include: [databaseModels.Message],
    }
  );
};
