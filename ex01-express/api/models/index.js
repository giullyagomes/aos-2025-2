import Sequelize from "sequelize";

import buildUserSchema from "./user";
import createMessageSchema from "./message";

//POSTGRES_URL
const databaseConnection = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  protocol: "postgres",
  // logging: false, // Disable SQL query logging
  dialectOptions: {
    // Necessary for SSL on NeonDB, Render.com and other providers
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialectModule: require("pg"),
});

const databaseModels = {
  User: buildUserSchema(databaseConnection, Sequelize),
  Message: createMessageSchema(databaseConnection, Sequelize),
};

Object.keys(databaseModels).forEach((modelName) => {
  if ("associate" in databaseModels[modelName]) {
    databaseModels[modelName].associate(databaseModels);
  }
});

export { databaseConnection as sequelize };

export default databaseModels;
