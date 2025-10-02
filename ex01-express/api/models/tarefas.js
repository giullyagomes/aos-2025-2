import { DataTypes } from "sequelize";

const getTarefasModel = (dbConnection, { DataTypes }) => {
const Tarefas = dbConnection.define("message", {
    objectid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    concluide: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Tarefas.associate = (dbModels) => {
    Tarefas.belongsTo(dbModels.User, { foreignKey: "userId" });
  };

  return Tarefas;
};

export default getTarefasModel;
